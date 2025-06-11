from typing import List

import strawberry
from strawberry.types import Info

from service.app_facade import get_app_facade
from service.context import Context

from schema.pharmaceutical import IngredientList, Pharmaceutical, PharmaceuticalSearch


@strawberry.type
class Query:
    @strawberry.field
    def test(self) -> str:
        return 'test'

    @strawberry.field
    async def pharmaceutical(self, info: Info[Context, None], search: PharmaceuticalSearch) -> IngredientList:

        print('searctType', type(search))
        tmp = await get_app_facade().pharmaceutical(category=search.category,
                                                    search_name=search.search_name,
                                                    specification=search.specification)

        # print('26', tmp)
        # for t in tmp:
        #     print('------------')
        #     for tt in t:
        #         print('???????')
        #         print(tt)

        return tmp
