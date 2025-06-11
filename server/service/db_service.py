from __future__ import annotations
from decimal import Decimal
import threading
from typing import Optional

from model.pharmaceutical import Pharmaceutical


class DbService:
    _instance = None
    _instance_lock = threading.Lock()

    def __init__(self, db_pool):
        self.db_pool = db_pool

    @staticmethod
    def set_db_pool(db_pool):
        with DbService._instance_lock:
            if DbService._instance is None:
                DbService._instance = DbService(db_pool)
            else:
                raise Exception("DbServie is already initialized with db pool")

    @staticmethod
    def get_instance() -> DbService:
        with DbService._instance_lock:
            if DbService._instance is None:
                raise Exception("DbService not initialized with db pool")
            return DbService._instance

    async def fetch_drug_price_r6(self, ingre: str):
        query = """
        SELECT category, drug_code, ingredient, specification, product, manufacturer,
               eligible_generic, brand_generic, brand_generic_with_generic,
               price, expirary_date, remarks
        FROM "2024_12"
        WHERE ingredient = $1
        """
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(query, ingre)
            print('now')
            print('41_len', len(rows))
            ret = [Pharmaceutical(**row) for row in rows]
        # print('44', type(ret[0]))
        print('46', ret)
        return ret

    async def find_by_search_name(self, table_name: str, search_name: str) -> list[Pharmaceutical]:
        query = f"""
        SELECT *
        FROM "{table_name}"
        WHERE ingredient ILIKE $1
        UNION
        SELECT *
        FROM "{table_name}"
        WHERE product ILIKE $1
        """

        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(query, f"%{search_name}%")
            ret = [Pharmaceutical(**row) for row in rows]
        return ret

    async def find_by_ingredient(self, table_name: str,ingredient: str) -> list[Pharmaceutical]:
        query = f"""
        SELECT *
        FROM "{table_name}"
        WHERE ingredient = $1
        """
        print('74', ingredient)
        async with self.db_pool.acquire() as conn:
            rows = await conn.fetch(query, ingredient)
            print('now')
            print('41_len', len(rows))
            ret = [Pharmaceutical(**row) for row in rows]
        # print('44', type(ret[0]))
        print('744_len is', len(ret))
        return ret

    async def get_price_by_drug_code(self, drug_code: str) -> Optional[Decimal]:
        query = """
        SELECT price
        FROM "2024_02"
        WHERE drug_code = $1
        """
        print("86", drug_code)
        async with self.db_pool.acquire() as conn:
            result = await conn.fetch(query, drug_code)
            if result:
                print('90', result)
                print('91', result[0]["price"])
                return result[0]["price"]
            else:
                return None


def get_db_service() -> DbService:
    return DbService.get_instance()
