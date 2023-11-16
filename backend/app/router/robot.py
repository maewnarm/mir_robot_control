from fastapi import APIRouter, Depends, HTTPException
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from app.schema.robot import (
    RobotListResponse
)
from app.manager import (
    CommonManager
)

from app.services import RobotSyncService

from app.functions import api_key_auth

def robot_router(db: AsyncGenerator, robot_sync_service: RobotSyncService) -> APIRouter:
    router = APIRouter()
    common_manager = CommonManager()

    @router.get('/list', response_model=RobotListResponse, dependencies=[Depends(api_key_auth)])
    async def get_robot_list(db: AsyncSession = Depends(db)):
        return RobotListResponse(
            robot_list=robot_sync_service.get_robot_list()
        )

    return router
