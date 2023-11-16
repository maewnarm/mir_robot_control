from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound
from typing import List
from uuid import UUID
import datetime

from app.crud.task import TaskCRUD
from app.schema.task import (
    TaskHistory,
    TaskQueue
)

class TaskManager:
    def __init__(self) -> None:
        self.crud = TaskCRUD()

    async def _compute_estimate_time_to_finish(
        self,
        db: AsyncSession,
        status: str = None,
        robot_id:str=None,
        order_mission_id:str=None,
        started_at:str=None,
        finished_at:str=None
    ):
        if not status or status != 'executing':
            return None
        
        if not isinstance(started_at, datetime.datetime):
            started_at_dt = datetime.datetime.strptime(r[key_index['created_at']], '%Y-%m-%d %H:%M:%S.%f')
        else:
            started_at_dt = started_at

        res = await self.crud.get_task_history_by_robot_and_mission(
            db=db,
            robot_id=robot_id,
            order_mission_id=order_mission_id
        )

        num_row = 0
        total_duration = 0
        for r in res:
            key_index = r._key_to_index
            if r[key_index['duration']] is not None:
                num_row += 1
                total_duration += r[key_index['duration']].total_seconds()
        
        if num_row == 0:
            # 3 minutes is a magic number estimated for the target duration of a mission
            target_time =  started_at_dt + datetime.timedelta(seconds=180)
        else:
            avg_duration = total_duration / num_row
            target_time = started_at_dt + datetime.timedelta(seconds=avg_duration)
        current_time=datetime.datetime.now()
        target_time_utc = target_time.replace(tzinfo=datetime.timezone.utc) + datetime.timedelta(hours=7)
        current_time_utc = current_time.replace(tzinfo=datetime.timezone.utc) 

        return int((target_time_utc - current_time_utc).seconds * 1000)

    async def get_task_histories(
        self,
        db: AsyncSession,
        status:str=None,
        line_id:int=None,
        part_model:str=None,
        box_model:str=None,
        robot_id:str=None,
        sort_by:str='id',
        sort_type:str='asc'
    ):
        res = await self.crud.get_task_histories(
            db=db,
            status=status,
            line_id=line_id,
            part_model=part_model,
            box_model=box_model,
            robot_id=robot_id,
            sort_by=sort_by,
            sort_type=sort_type
        )
        return_list: List[TaskHistory]  = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(TaskHistory(
                id=r[key_index['id']],
                line_id=r[key_index['line_id']],
                part_model=r[key_index['part_model']],
                box_model=r[key_index['box_model']],
                mission_id_list=r[key_index['mission_id_list']],
                order_mission_id=UUID(r[key_index['order_mission_id']]) if r[key_index['order_mission_id']] else None,
                robot_id=r[key_index['robot_id']],
                status=r[key_index['status']],
                start=r[key_index['start']],
                finish=r[key_index['finish']],
                duration_ms=r[key_index['duration']].total_seconds() * 1000 if r[key_index['duration']] is not None else None,
                estimate_time_to_finish_ms=await self._compute_estimate_time_to_finish(
                    db=db, robot_id=r[key_index['robot_id']],
                    status=r[key_index['status']],
                    order_mission_id=r[key_index['order_mission_id']], 
                    started_at=r[key_index['start']],
                    finished_at=r[key_index['finish']]
                )
            ))
        return return_list
    
    async def get_task_queues(
        self,
        db: AsyncSession,
        line_id:int=None,
        part_model:str=None,
        box_model:str=None,
        sort_by:str='id',
        sort_type:str='asc'
    ):
        res = await self.crud.get_task_queues(
            db=db,
            line_id=line_id,
            part_model=part_model,
            box_model=box_model,
            sort_by=sort_by,
            sort_type=sort_type
        )
        return_list: List[TaskQueue]  = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(TaskQueue(
                id=r[key_index['id']],
                line_id=r[key_index['line_id']],
                part_model=r[key_index['part_model']],
                box_model=r[key_index['box_model']],
                mission_id_list=r[key_index['mission_id_list']],
                order_mission_id=UUID(r[key_index['order_mission_id']]) if r[key_index['order_mission_id']] else None
            ))
        return return_list
    
    async def get_first_queue(
        self,
        db: AsyncSession
    ):
        res = await self.crud.get_task_queues(
            db=db,
            sort_by='id',
            sort_type='asc',
            limit=1
        )
        r = res.fetchone()
        if r:
            key_index = r._key_to_index
            return TaskQueue(
                id=r[key_index['id']],
                line_id=r[key_index['line_id']],
                part_model=r[key_index['part_model']],
                box_model=r[key_index['box_model']],
                mission_id_list=r[key_index['mission_id_list']],
                order_mission_id=UUID(r[key_index['order_mission_id']]) if r[key_index['order_mission_id']] else None
            )
        return None
    
    async def save_task_history(
        self,
        data: TaskHistory,
        db: AsyncSession
    ):
        save_result = await self.crud.save_task_history(data=data, db=db)
        res = await self.crud.get_task_history_by_id(
            db=db,
            id=save_result[save_result._key_to_index['id']]
        )
        r = res.fetchone()
        key_index = r._key_to_index
        return TaskHistory(
            id=r[key_index['id']],
            line_id=r[key_index['line_id']],
            part_model=r[key_index['part_model']],
            box_model=r[key_index['box_model']],
            mission_id_list=r[key_index['mission_id_list']],
            order_mission_id=UUID(r[key_index['order_mission_id']]) if r[key_index['order_mission_id']] else None,
            robot_id=r[key_index['robot_id']],
            status=r[key_index['status']],
            start=r[key_index['start']],
            finish=r[key_index['finish']],
            duration_ms=r[key_index['duration']].total_seconds() * 1000 if r[key_index['duration']] is not None else None,
            estimate_time_to_finish_ms=await self._compute_estimate_time_to_finish(
                    db=db, robot_id=r[key_index['robot_id']],
                    status=r[key_index['status']],
                    order_mission_id=r[key_index['order_mission_id']], 
                    started_at=r[key_index['start']],
                    finished_at=r[key_index['finish']]
                )
        )
    
    async def save_task_queue(
        self,
        data: TaskQueue,
        db: AsyncSession
    ):
        save_result = await self.crud.save_task_queue(data=data, db=db)
        res = await self.crud.get_task_queue_by_id(
            db=db,
            id=save_result[save_result._key_to_index['id']]
        )
        r = res.fetchone()
        key_index = r._key_to_index
        return TaskQueue(
            id=r[key_index['id']],
            line_id=r[key_index['line_id']],
            part_model=r[key_index['part_model']],
            box_model=r[key_index['box_model']],
            mission_id_list=r[key_index['mission_id_list']],
            order_mission_id=UUID(r[key_index['order_mission_id']]) if r[key_index['order_mission_id']] else None
        )
    
    async def swap_task_queue(
        self,
        task1Id: int,
        task2Id: int,
        db: AsyncSession
    ):
        await self.crud.swap_task_queue(row_id1=task1Id, row_id2=task2Id, db=db)
        return await self.get_task_queues(db=db)
    
    async def delete_task_queue_by_id(
        self,
        task_queue_id: int,
        db: AsyncSession
    ):
        await self.crud.delete_task_queue_by_id(db=db, task_queue_id=task_queue_id)
        return True
    
