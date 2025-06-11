from __future__ import annotations
import asyncio
from collections import defaultdict
from decimal import Decimal
import itertools
import threading

from typing import Optional

from model.pharmaceutical import Ingredient, IngredientList, Pharmaceutical
from service.db_service import DbService, get_db_service


class DataService:
    _instance = None
    _instance_lock = threading.Lock()

    @staticmethod
    def get_instance(db_service: DbService) -> DataService:
        with DataService._instance_lock:
            if DataService._instance is None:
                DataService._instance = DataService(db_service)
            return DataService._instance

    def __init__(self, db_service: DataService):
        self._dbs = db_service

    async def get_pharmaceuticals(self,
                                  category: Optional[str],
                                  search_name: str,
                                  specification: Optional[str]):
        """
        検索名で成分名と品名を検索し、成分名のset作成
        set要素ごとに成分名を検索しリストを作成する

        """
        # TODO ひらカナ

        tables = ["7_4_16_oral", "7_4_16_injection",
                  "7_4_16_topical", "7_4_16_dental"]
                  
        search_tasks = [self._dbs.find_by_search_name(
            t, search_name) for t in tables]
        search_results = await asyncio.gather(*search_tasks)
        list_by_search_name = list(itertools.chain.from_iterable(search_results))

        ingredient_set = {
            l.ingredient for l in list_by_search_name if l.ingredient}

        ingredient_tasks = [
            self._dbs.find_by_ingredient(t, l)
            for l in ingredient_set
            for t in tables
        ]
        ingredient_results = await asyncio.gather(*ingredient_tasks)
        full_pharmaceuticals = list(itertools.chain.from_iterable(ingredient_results))

        ingredient_dict: dict[str, list[Pharmaceutical]] = defaultdict(list)
        for f in full_pharmaceuticals:
            if f.ingredient:
                # 旧薬価処理
                # pre_price = await self._dbs.get_price_by_drug_code(f.drug_code)
                # f.previouse_price = float(
                #     pre_price) if pre_price is not None else None
                ingredient_dict[f.ingredient].append(f)

        ingredients = [Ingredient(ingredient=k, pharmaceuticals=v)
                       for k, v in ingredient_dict.items()]

        return IngredientList(ingredients=ingredients)


def get_data_service() -> DataService:
    return DataService.get_instance(get_db_service())
