from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Dict, Any


class LineChute(BaseModel):
    id: int
    line_id: int
    part_model: Optional[str]
    box_model: Optional[str]
    group_id: int
    chute_marker_no: int
    chute_direction: Optional[int]
    chute_type: Optional[str]
    fifo_index: Optional[int]
    motor_chute_id: Optional[str]


class LineChuteResponse(BaseModel):
    data: List[LineChute]


class LineChuteFlowChart(BaseModel):
    line_id: int
    part_model: Optional[str]
    box_model: Optional[str]
    group_id: int
    chute_marker_no: int
    chute_direction: Optional[int]
    chute_type: Optional[str]
    motor_chute_id: Optional[str]


class LineChuteFlowChartResponse(BaseModel):
    data: List[LineChute]


class LMarkerGroup(BaseModel):
    id: int
    line_id: int
    group_id: int
    l_marker_id: UUID


class LMarkerGroupResponse(BaseModel):
    data: List[LMarkerGroup]


class MissionAction(BaseModel):
    id: int
    line_id: int
    part_model: Optional[str]
    box_model: Optional[str]
    mission_id: str
    action_parameter: List[Dict[Any, Any]]
    action_parameter_endpoint: Optional[List[str]]


class MissionActionResponse(BaseModel):
    data: List[MissionAction]


class NodeFlowChartResponse(BaseModel):
    data: dict


class DataInput(BaseModel):
    line_id: str


class OrderMission(BaseModel):
    id: int
    line_id: int
    order_type: int
    mission_id_list: List[str]
    order_mission_id: str


class OrderMissionResponse(BaseModel):
    data: List[OrderMission]


class LineAttribute(BaseModel):
    id: int
    line_id: int
    attribute: List[Dict[Any, Any]]


class LineAttributeResponse(BaseModel):
    data: List[LineAttribute]


# class FlowChartResponse( BaseModel):


class NodeFlowChart(BaseModel):
    id: str
    renderKey: str
    name: str
    label: str
    width: int
    height: int
    ports: dict
    originData: dict
    isCustom: bool
    x: int
    y: int
    zIndex: int
    transferDirection: int
    chuteDirection: int
    markerId: int
    boxStack: int
    motorId: str
    robotId: list
    groupId: int
    chuteType: str
    partModel: str
    boxModel: str


class NodeFlowChartRequest(BaseModel):
    nodes: List[NodeFlowChart]


class LineIdResponse(BaseModel):
    line: str


class NodeFlowChartData(BaseModel):
    nodes: list
    edges: list


class NodeGetData(BaseModel):
    flow_chart_data: dict
