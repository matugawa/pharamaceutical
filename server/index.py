import re
import os
import asyncpg
from dotenv import load_dotenv
from fastapi import FastAPI, Response, Query as FQuery
from fastapi.responses import JSONResponse
from schema.query import Query
from service.context import get_context
from service.db_service import DbService
from starlette.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.printer import print_schema

from playwright.async_api import async_playwright


import uvicorn

load_dotenv()
IS_DEV = os.getenv("IS_DEV", "false").lower() == "true"
PMDA_BASE_URL = os.getenv("PMDA_BASE_URL")
PMDA_SEARCH_URL = f"{PMDA_BASE_URL}{os.getenv('PMDA_SEARCH_PATH')}"
PMDA_DETAIL_URL = f"{PMDA_BASE_URL}{os.getenv('PMDA_DETAIL_PATH')}"

schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema, context_getter=get_context)


# @app.on_event("startup")は旧式
async def lifespan(app: FastAPI):
    print("Starting up...")

    app.db = await asyncpg.create_pool(
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        database=os.getenv("POSTGRES_DB"),
        host=os.getenv("POSTGRES_HOST", "db")
    )
    DbService.set_db_pool(app.db)

    # playwright initialization
    app.playwright = await async_playwright().start()
    app.browser = await app.playwright.chromium.launch(headless=True)
    app.context = await app.browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
        locale="ja-JP"
    )

    yield
    print("Shutting down...")

    # db close
    await app.db.close()
    # playwright
    await app.context.close()
    await app.browser.close()
    await app.playwright.stop()

app = FastAPI(lifespan=lifespan)

# CORS対策
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_origins=["http://localhost:3301"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graphql_app, prefix="/graphql")

# TODO REST urlの/api?
# nginx proxy_passs
#   location /api/ {
#       proxy_pass http://127.0.0.1:8501/;
#   or  proxy_pass http://127.0.0.1:8501;
app.include_router(graphql_app, prefix="/api/graphql")


@app.get("/get_schema")
async def get_schema():
    schema_str = print_schema(schema)
    return Response(status_code=200, media_type="text/plain", content=schema_str)


@app.get("/api/package_insert")
async def get_package_insert(nameWord: str = FQuery(...)):
    page = await app.context.new_page()
    try:
        await page.goto(PMDA_SEARCH_URL, wait_until="domcontentloaded", timeout=30000)
        await page.fill('input[name="nameWord"]', nameWord)

        async with app.context.expect_page() as tab_info:
            await page.click('input[name="btnA"]')
        result_tab = await tab_info.value
        await result_tab.wait_for_selector('#ResultList', timeout=15_000)

        pdf_url = None
        selector = 'a[href*="/ResultDataSetPDF/"]'

        for frame in result_tab.frames:
            link = await frame.query_selector(selector)
            if not link:
                continue

            text = (await link.text_content() or "").strip()
            if not text.startswith("PDF("):
                continue

            href = await link.get_attribute("href") or ""
            pdf_url = href if href.startswith(
                "http") else f"{PMDA_BASE_URL}{href}"
            break

        if not pdf_url:
            return JSONResponse(
                {"pdf_url": None, "message": "PDF が見つかりませんでした"},
                status_code=200,
            )

        print('URL', pdf_url)

        return JSONResponse({"pdf_url": pdf_url}, status_code=200)

    except Exception as e:
        print("Error in /api/package_insert:", e)
        return JSONResponse({"error": str(e)}, status_code=500)

    finally:
        await page.close()
        if "result_tab" in locals():
            await result_tab.close()


@app.get("/api/contraindication")
async def get_contraindication(nameWord: str = FQuery(...)):
    page = await app.context.new_page()
    try:
        await page.goto(PMDA_SEARCH_URL, wait_until="domcontentloaded", timeout=30000)
        await page.fill('input[name="nameWord"]', nameWord)

        async with app.context.expect_page() as result_tab_info:
            await page.click('input[name="btnA"]')
        result_tab = await result_tab_info.value
        # await result_tab.wait_for_load_state("networkidle")
        await result_tab.wait_for_load_state("domcontentloaded")

        html_fname = None
        for f in result_tab.frames:
            a = f.locator('a[onclick*="detailDisp"]')
            # if await a.count():
            if await a.first.is_visible():
                onclick = await a.first.get_attribute("onclick")
                m = re.search(r'detailDisp\([^,]+,\s*"(.*?)"', onclick)
                if m:
                    html_fname = m.group(1)
                    break

        if not html_fname:
            return JSONResponse(
                content={"contraindications": "禁忌情報のリンクが見つかりませんでした"},
                status_code=200
            )

        html_url = f"{PMDA_DETAIL_URL}{html_fname}"

        detail = await result_tab.context.new_page()
        # await detail.goto(html_url, timeout=30_000)
        await detail.goto(html_url, wait_until="domcontentloaded", timeout=30_000)

        # 見出しなし禁忌情報
        # await detail.wait_for_selector('#HDR_ContraIndications .VariousForm', timeout=15_000)
        # html_raw = await detail.inner_html('#HDR_ContraIndications .VariousForm')

        # 見出しあり禁忌情報
        await detail.wait_for_selector('#HDR_ContraIndications', timeout=15_000)
        html_raw = await detail.inner_html('#HDR_ContraIndications')

        print('html', html_raw)

        if not html_raw:
            return JSONResponse(
                {"html": None, "message": "禁忌情報が見つかりませんでした"},
                status_code=200,
            )

        return JSONResponse({"html": html_raw}, status_code=200)

    except Exception as e:
        print("Error in /api/contraindication:", e)
        return JSONResponse(content={"error": str(e)}, status_code=500)

    finally:
        await page.close()
        if 'result_tab' in locals():
            await result_tab.close()
        if 'detail' in locals():
            await detail.close()


if __name__ == "__main__":
    # procではreload=true外す
    uvicorn.run("index:app", host="0.0.0.0", port=8501, reload=IS_DEV)
