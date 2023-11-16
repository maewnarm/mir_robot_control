from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

class Position(BaseModel):
    """Class for keeping position"""
    x: Optional[float]
    y: Optional[float]
    orientation: Optional[float]

class RobotInfomation(BaseModel):
    id: Optional[str]
    ip: str
    token: str
    name: Optional[str]
    is_available: bool
    current_position: Optional[Position]
    current_mission: Optional[str]
    pending_mission: Optional[List[str]]
    mission_list: Optional[List[Dict[str, Any]]]
    current_task_id: Optional[int]
    current_task_status: Optional[str]

class Robot(RobotInfomation):
    pass

class RobotListResponse(BaseModel):
    robot_list: List[Robot]
    
