from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from uuid import UUID
import datetime

@dataclass
class MissionInformation:
    """ Class for keeping mission information """
    mission_id: UUID
    mission_name: Optional[str]
    body_list: List[Dict[UUID,List[Dict[str, Any]]]]

@dataclass
class TaskInformation:
    """ Class for keeping task information """
    task_id: input
    line_id: int
    part_model: str
    box_model: str
    params_value: List[Dict[str, Any]]
    order_mission_id: str
    mission_list: List[MissionInformation]
    begin: Optional[datetime.datetime]
    end: Optional[datetime.datetime]
    status: str

@dataclass
class Position:
    """Class for keeping position"""
    orientation: Optional[float]
    x: Optional[float]
    y: Optional[float]

@dataclass
class RobotInformation:
    """ Class for keeping the robot information """
    robot_id: str
    name: str
    is_available: bool
    current_mission: Optional[str]
    pending_mission: Optional[str]
    current_position: Optional[Position]
    current_task_id: Optional[str]
    current_task_status: Optional[str]
    mission_list: Optional[List[MissionInformation]]
