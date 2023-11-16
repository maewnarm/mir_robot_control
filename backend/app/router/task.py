from fastapi import APIRouter, Depends, HTTPException
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from app.manager import (
    CommonManager,
    TaskManager
)
from app.exceptions import DBNotAvailableException
from app.functions import api_key_auth
from app.schema.task import (
    TaskHistoryListResponse,
    TaskQueueListResponse,
    FirstTaskQueueResponse,
    SaveTaskHistoryRequest,
    SaveTaskHistoryResponse,
    SaveTaskQueueRequest,
    SaveTaskQueueResponse,
    SwapTaskQueueRequest,
    SwapTaskQueueResponse,
    DeleteTaskQueueResponse
)

def task_router(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    task_manager = TaskManager()
    common_manager = CommonManager()

    @router.get('/task_histories', response_model=TaskHistoryListResponse, dependencies=[Depends(api_key_auth)])
    async def get_task_histories(db: AsyncSession = Depends(db)):
        try:
            data_list = await task_manager.get_task_histories(db=db)
            return TaskHistoryListResponse(task_histories=data_list)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during get task history {e}")

    @router.get('/task_history_by_robot_id', response_model=TaskHistoryListResponse, dependencies=[Depends(api_key_auth)])
    async def get_task_histories(robot_id: str, db: AsyncSession = Depends(db)):
        try:
            data_list = await task_manager.get_task_histories(db=db, robot_id=robot_id)
            return TaskHistoryListResponse(task_histories=data_list)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during get task history {e}")
        
    @router.get('/task_queues', response_model=TaskQueueListResponse, dependencies=[Depends(api_key_auth)])
    async def get_task_queues(db: AsyncSession = Depends(db)):
        try:
            data_list = await task_manager.get_task_queues(db=db)
            return TaskQueueListResponse(task_queues=data_list)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during get task queues {e}")
    
    @router.get('/get_first_task', response_model=FirstTaskQueueResponse, dependencies=[Depends(api_key_auth)])
    async def get_first_task(db: AsyncSession = Depends(db)):
        try:
            data = await task_manager.get_first_queue(db=db)
            return FirstTaskQueueResponse(task_queue=data)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during get first task queue {e}")
        
    @router.post('/save_task_history', response_model=SaveTaskHistoryResponse, dependencies=[Depends(api_key_auth)])
    async def save_task_history(data: SaveTaskHistoryRequest, db: AsyncSession = Depends(db)):
        try:
            data = await task_manager.save_task_history(data=data, db=db)
            return data
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during save task history {e}")

    @router.post('/save_task_queue', response_model=SaveTaskQueueResponse, dependencies=[Depends(api_key_auth)])
    async def save_task_history(data: SaveTaskQueueRequest, db: AsyncSession = Depends(db)):
        try:
            # retrieve order_mission_id & mission_id_list from the database
            if data.order_type:
                order_mission = await common_manager.get_order_mission(
                    db=db,
                    order_type=data.order_type,
                    line_id=data.line_id
                )
                mission_id_list = list()
                order_mission_id = None
                if order_mission:
                    order_mission_id = order_mission[0].order_mission_id
                    for i in order_mission[0].mission_id_list:
                        mission_id_list.append(i)
                data.order_mission_id = order_mission_id
                data.mission_id_list = mission_id_list
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during get mission id {e}")
        try:
            data = await task_manager.save_task_queue(data=data, db=db)
            return data
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during save task queue {e}")

    @router.post('/swap_task_queue', response_model=SwapTaskQueueResponse, dependencies=[Depends(api_key_auth)])
    async def save_task_history(data: SwapTaskQueueRequest, db: AsyncSession = Depends(db)):
        try:
            task_queue_list = await task_manager.swap_task_queue(task1Id=data.task1Id, task2Id=data.task2Id, db=db)
            return SwapTaskQueueResponse(task_queues=task_queue_list)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during save task queue {e}")
        
    @router.delete('/task_queue', response_model=DeleteTaskQueueResponse, dependencies=[Depends(api_key_auth)])
    async def delete_task_queue_by_id(task_queue_id: int, db: AsyncSession = Depends(db)):
        try:
            data = await task_manager.delete_task_queue_by_id(task_queue_id=task_queue_id, db=db)
            return DeleteTaskQueueResponse(result=True)
        except DBNotAvailableException as e:
            raise HTTPException(status_code=403, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error during delete task queue by id {e}")

    return router
