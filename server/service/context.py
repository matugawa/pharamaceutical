from fastapi import Request
from strawberry.fastapi import BaseContext


class Context(BaseContext):
    def __init__(self, request: Request):
        self.request = request


async def get_context(request: Request) -> Context:
    return Context(request)
