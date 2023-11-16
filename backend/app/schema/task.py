from datetime import datetime
from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class TaskHistory( BaseModel ):
    id: Optional[int] = None
    line_id: int
    part_model: Optional[str] = None
    box_model: Optional[str] = None
    mission_id_list: Optional[List[UUID]] = None
    order_mission_id: Optional[UUID] = None
    robot_id: Optional[str] = None

    status: str

    start: Optional[datetime] = None
    finish: Optional[datetime] = None
    duration_ms: Optional[int] = None
    estimate_time_to_finish_ms: Optional[int] = None

class TaskQueue( BaseModel ):
    id: Optional[int] = None
    line_id: int
    part_model: Optional[str] = None
    box_model: Optional[str] = None
    mission_id_list: Optional[List[UUID]] = None
    order_mission_id: Optional[UUID] = None

class SaveTaskQueueRequest( TaskQueue ):
    order_type: Optional[int] = None

class SaveTaskHistoryRequest( TaskHistory ):
    mission_id_list: Optional[List[str]] = None
    order_mission_id: Optional[str] = None

class SaveTaskHistoryResponse( TaskHistory ):
    pass

class SaveTaskQueueResponse( TaskQueue ):
    pass

class DeleteTaskQueueResponse( BaseModel ):
    result: bool

class SwapTaskQueueRequest( BaseModel ):
    task1Id: int
    task2Id: int

class FirstTaskQueueResponse( BaseModel ):
    task_queue: Optional[TaskQueue]

class TaskHistoryListResponse( BaseModel ):
    task_histories: List[TaskHistory]

class TaskQueueListResponse( BaseModel ):
    task_queues: List[TaskQueue]

class SwapTaskQueueResponse( TaskQueueListResponse ):
    pass
