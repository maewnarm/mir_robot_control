from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, Optional
from uuid import UUID
import json

from app.manager import CommonManager
from app.functions import api_key_auth
from app.schema.common import (
    LineChuteResponse,
    LMarkerGroupResponse,
    MissionActionResponse,
    OrderMissionResponse,
    LineAttributeResponse,
    NodeFlowChartRequest,
    LineIdResponse,
    LineChuteFlowChartResponse,
    NodeFlowChartData,
    NodeGetData,
    NodeFlowChartResponse,
)


def common_router(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    manager = CommonManager()

    @router.get(
        "/line_chute",
        response_model=LineChuteResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_line_chute(
        line_id: int,
        part_model: Optional[str] = None,
        box_model: Optional[str] = None,
        db: AsyncSession = Depends(db),
    ):
        try:
            data_list = await manager.get_line_chute(
                db=db, line_id=line_id, part_model=part_model, box_model=box_model
            )
            return LineChuteResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line chute : {e}"
            )

    @router.post("/line_chute", dependencies=[Depends(api_key_auth)])
    async def post_line_chute(
        line_id: int,
        part_model: str,
        chute_type: str,
        marker_id: int,
        db: AsyncSession = Depends(db),
    ):
        try:
            data_list = await manager.post_line_chute(
                db=db,
                line_id=line_id,
                part_model=part_model,
                chute_type=chute_type,
                marker_id=marker_id,
            )
            return LineChuteResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line chute : {e}"
            )

    @router.get(
        "/l_marker_group",
        response_model=LMarkerGroupResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_l_marker_group(
        line_id: int, group_id: int, db: AsyncSession = Depends(db)
    ):
        try:
            data_list = await manager.get_l_marker_group(
                db=db, line_id=line_id, group_id=group_id
            )
            return LMarkerGroupResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get l marker group : {e}"
            )

    @router.get(
        "/order_mission",
        response_model=OrderMissionResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_order_mission(
        line_id: int, order_type: int, db: AsyncSession = Depends(db)
    ):
        try:
            data_list = await manager.get_order_mission(
                db=db, line_id=line_id, order_type=order_type
            )
            return OrderMissionResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get order mission : {e}"
            )

    @router.get(
        "/mission_action",
        response_model=MissionActionResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_mission_action(
        line_id: int,
        mission_id: str,
        part_model: Optional[str] = None,
        box_model: Optional[str] = None,
        db: AsyncSession = Depends(db),
    ):
        try:
            data_list = await manager.get_mission_action(
                db=db,
                line_id=line_id,
                part_model=part_model,
                box_model=box_model,
                mission_id=mission_id,
            )
            return MissionActionResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get mission action : {e}"
            )

    @router.get(
        "/line_attribute",
        response_model=LineAttributeResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_line_attribute(line_id: int, db: AsyncSession = Depends(db)):
        try:
            data_list = await manager.get_line_attribute(line_id=line_id, db=db)
            return LineAttributeResponse(data=data_list)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line attribute : {e}"
            )

    @router.post("/flow_chart_param", dependencies=[Depends(api_key_auth)])
    async def filtered_data(
        nodes: NodeFlowChartRequest, line_id: str, db: AsyncSession = Depends(db)
    ):
        filtereddata = []
        for node in nodes.nodes:
            _type = node.name.split("-").pop()
            if _type == "motor":
                filtereddata.append(
                    {
                        # "name": _type,
                        # "label": node.label,
                        "chute_type": node.chuteType,
                        "chute_direction": node.chuteDirection,
                        "motor_chute_id": node.motorId,
                        "part_model": None if node.partModel == "" else node.partModel,
                        "box_model": None if node.boxModel == "" else node.boxModel,
                        # "box_stack": None,
                        "chute_marker_no": node.markerId,
                        # "robot_id": None,
                        "group_id": node.groupId,
                        "line_id": line_id,
                    }
                )
            elif _type == "free":
                filtereddata.append(
                    {
                        # "name": _type,
                        # "label": node.label,
                        "chute_type": node.chuteType,
                        "chute_direction": node.chuteDirection,
                        "motor_chute_id": None,
                        "part_model": None if node.partModel == "" else node.partModel,
                        "box_model": None if node.boxModel == "" else node.boxModel,
                        # "box_stack": node.boxStack,
                        "chute_marker_no": node.markerId,
                        # "robot_id": None,
                        "group_id": node.groupId,
                        "line_id": line_id,
                    }
                )
        try:
            await manager.post_line_chute_flow_chart(db=db, filterdata=filtereddata)
            # return LineChuteResponse(data=data_list)
            return {"result": "complete"}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line chute : {e}"
            )

    @router.post("/flow_chart", dependencies=[Depends(api_key_auth)])
    async def node_data(
        node: NodeFlowChartData, line_id: str, db: AsyncSession = Depends(db)
    ):
        # print(node.__dict__)

        try:
            await manager.post_flow_chart(
                db=db, node=json.dumps(node.__dict__), line_id=int(line_id)
            )
            # return LineChuteResponse(data=data_list)
            return {"result": "flow chart post complete"}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line chute : {e}"
            )

    @router.get(
        "/get_flow_chart",
        response_model=NodeFlowChartResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_node_data(line_id: str, db: AsyncSession = Depends(db)):
        try:
            data_node = await manager.get_flow_chart(db=db, line_id=int(line_id))
            print(data_node)
            return NodeFlowChartResponse(data=data_node)

        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get line chute : {e}"
            )

    return router
