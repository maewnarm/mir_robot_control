from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from typing import List

from app.exceptions.task import DBNotAvailableException
from app.schema.task import (
    TaskHistory,
    TaskQueue
)

class TaskCRUD:
    def __init__(self) -> None:
        self.available = True

    async def get_task_history_by_robot_and_mission(
        self,
        db: AsyncSession,
        robot_id: str,
        order_mission_id: str
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        rs = await db.execute(
            text(f'select * from agv_task_history where robot_id = :robot_id and order_mission_id = :order_mission_id'),
            params={
                'robot_id': robot_id,
                'order_mission_id': order_mission_id
            })
        return rs
    
    async def get_task_history_by_id(
        self,
        db: AsyncSession,
        id: int
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        rs = await db.execute(
            text(f'select * from agv_task_history where id = :id'),
            params={
                'id': id
            })
        return rs

    async def get_task_histories(
        self,
        db: AsyncSession,
        status:str=None,
        line_id:int=None,
        part_model:str=None,
        box_model:str=None,
        robot_id:str=None,
        sort_by:str='id',
        sort_type:str='asc',
        limit:int=None
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        
        stmt = f"select * from agv_task_history"
        contain_where = False
        if line_id:
            stmt += " where line_id = :line_id"
            contain_where = True
        if part_model:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
                contain_where = True
            stmt += " part_model = :part_model"
        if box_model:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
                contain_where = True
            stmt += " box_model = :box_model"
        if robot_id:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
                contain_where = True
            stmt += " robot_id = :robot_id"
        if status:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
            stmt += " status = :status"
        stmt += f" order by {sort_by} {sort_type}"
        if limit:
            stmt += f"limit {limit}"
        rs = await db.execute(
            text(stmt),
            params={
                'status': status,
                'line_id': line_id,
                'part_model': part_model,
                'box_model': box_model,
                "robot_id": robot_id,
                'sort_by': sort_by,
            }
        )
        return rs

    async def get_task_queue_by_id(
        self,
        db: AsyncSession,
        id: int
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        rs = await db.execute(
            text(f'select * from agv_task_queue where id = :id'),
            params={
                'id': id
            }
        )
        return rs

    async def get_task_queues(
        self,
        db: AsyncSession,
        line_id:str=None,
        part_model:str=None,
        box_model:str=None,
        sort_by:str='id',
        sort_type:str='asc',
        limit:int=None
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        
        stmt = f"select * from agv_task_queue"
        contain_where = False
        if line_id:
            stmt += " where line_id = :line_id"
            contain_where = True
        if part_model:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
                contain_where = True
            stmt += " part_model = :part_model"
        if box_model:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
                contain_where = True
            stmt += " box_where = :box_model"
        stmt += f" order by {sort_by} {sort_type}"
        if limit:
            stmt += f" limit {limit}"
        rs = await db.execute(
            text(stmt),
            params={
                'line_id': line_id,
                'part_model': part_model,
                'box_model': box_model,
                'sort_by': sort_by,
                'sort_type': sort_type,
            }
        )
        return rs
    
    async def save_task_history(
        self,
        db: AsyncSession,
        data: TaskHistory
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")

        line_id = f"'{data.line_id}'"
        status = f"'{data.status}'"
        robot_id = f"'{data.robot_id}'" if data.robot_id is not None else 'NULL'
        part_model = f"'{data.part_model}'" if data.part_model is not None else 'NULL'
        box_model = f"'{data.box_model}'" if data.box_model is not None else 'NULL'
        mission_id_list = f"'{{{','.join([str(i) for i in data.mission_id_list])}}}'" if data.mission_id_list is not None else 'NULL'
        order_mission_id = f"'{data.order_mission_id}'" if data.order_mission_id is not None else 'NULL'
        start = f"'{data.start}'" if data.start is not None else 'NULL'
        finish = f"'{data.finish}'" if data.finish is not None else 'NULL'

        if data.duration_ms is not None:
            duration = f"'{str(timedelta(milliseconds=data.duration_ms))}'"
        else:
            duration = data.finish - data.start if data.start and data.finish else 'NULL'
            duration = f"'{str(duration)}'" if duration != 'NULL' else duration

        if not data.id:
            stmt = f'''
                INSERT INTO agv_task_history (line_id, part_model, box_model, mission_id_list, order_mission_id, robot_id, status, start, finish, duration)
                VALUES ({line_id}, {part_model}, {box_model}, {mission_id_list}, {order_mission_id}, {robot_id}, {status}, {start}, {finish}, {duration})
                RETURNING id
            '''
        else:
            stmt = f'''
                UPDATE agv_task_history set line_id = {line_id}, part_model = {part_model}, box_model = {box_model}, mission_id_list = {mission_id_list}, order_mission_id = {order_mission_id}, robot_id = {robot_id}, status = {status}, start = {start}, finish = {finish}, duration = {duration}
                WHERE id = {data.id}
                RETURNING id
            '''
        
        rs = await db.execute(text(stmt))
        await db.commit()
        return rs.fetchone()
    
    async def save_task_queue(
        self,
        db: AsyncSession,
        data: TaskQueue
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")

        self.available = False

        try:
            line_id = f"'{data.line_id}'"
            part_model = f"'{data.part_model}'" if data.part_model is not None else 'NULL'
            box_model = f"'{data.box_model}'" if data.box_model is not None else 'NULL'
            mission_id_list = f"'{{{','.join([str(i) for i in data.mission_id_list])}}}'" if data.mission_id_list is not None else 'NULL'
            order_mission_id = f"'{data.order_mission_id}'" if data.order_mission_id is not None else 'NULL'

            if not data.id:
                stmt = f'''
                    INSERT INTO agv_task_queue (line_id, part_model, box_model, mission_id_list, order_mission_id)
                    VALUES ({line_id}, {part_model}, {box_model}, {mission_id_list}, {order_mission_id})
                    RETURNING id
                '''
            else:
                stmt = f'''
                    UPDATE agv_task_queue set line_id = {line_id}, part_model = {part_model}, box_model = {box_model}, mission_id_list = {mission_id_list}, order_mission_id = {order_mission_id}
                    WHERE id = {data.id}
                    RETURNING id
                '''
            rs = await db.execute(text(stmt))
            await db.commit()
            return rs.fetchone()
        finally:
            self.available = True
    
    async def swap_task_queue(
        self,
        db: AsyncSession,
        row_id1: int,
        row_id2: int
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")
        
        self.available = False
        try:
            swap_query = f'update agv_task_queue set id = :id where id = :id_target'
            res = await db.execute(text(f'select max(id) from agv_task_queue'))
            result_max_id = res.fetchone()
            max_id = result_max_id[0]
            await db.execute(
                text(swap_query),
                params={
                    'id': max_id + 1,
                    'id_target': row_id1
            })
            await db.execute(
                text(swap_query),
                params={
                    'id': row_id1,
                    'id_target': row_id2
                }
            )
            await db.execute(
                text(swap_query),
                params={
                    'id': row_id2,
                    'id_target': max_id + 1
                }
            )
            await db.commit()
        finally:
            self.available = True

    async def delete_task_queue_by_id(
        self,
        db: AsyncSession,
        task_queue_id: int
    ):
        if not self.available:
            raise DBNotAvailableException("Task service is not available")

        self.available = False
        try:
            stmt = f'''
                DELETE from agv_task_queue
                WHERE id = {task_queue_id}
            '''

            await db.execute(text(stmt))
            await db.commit()
        finally:
            self.available = True
