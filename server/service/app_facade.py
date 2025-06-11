from __future__ import annotations
import threading

from typing import Optional


from service.data_service import DataService, get_data_service


class AppFacade:
    _instance = None
    _instance_lock = threading.Lock()

    @staticmethod
    def get_instance(data_service: DataService) -> AppFacade:
        with AppFacade._instance_lock:
            if AppFacade._instance is None:
                AppFacade._instance = AppFacade(data_service)
            return AppFacade._instance

    def __init__(self, data_service: DataService):
        self._datas = data_service

    async def pharmaceutical(self,
                             category: Optional[str],
                             search_name: str,
                             specification: Optional[str]):
        # TODO AppReturn実装
        ret = await self._datas.get_pharmaceuticals(category=category,
                                                    search_name=search_name,
                                                    specification=specification)
        return ret


def get_app_facade() -> AppFacade:
    return AppFacade.get_instance(get_data_service())
