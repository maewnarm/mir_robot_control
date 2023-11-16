from uuid import UUID
from app.crud import CommonCRUD
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.common import (
    LineChute,
    LMarkerGroup,
    MissionAction,
    OrderMission,
    LineAttribute,
    LineChuteFlowChart,
)


class CommonManager:
    def __init__(self) -> None:
        self.crud = CommonCRUD()

    async def get_line_chute(
        self,
        db: AsyncSession,
        line_id: int,
        part_model: str = None,
        box_model: str = None,
    ):
        if line_id is None:
            return []

        res = await self.crud.get_line_chute(
            db=db, line_id=line_id, part_model=part_model, box_model=box_model
        )
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                LineChute(
                    id=r[key_index["id"]],
                    line_id=r[key_index["line_id"]],
                    part_model=r[key_index["part_model"]],
                    box_model=r[key_index["box_model"]],
                    group_id=r[key_index["group_id"]],
                    chute_marker_no=r[key_index["chute_marker_no"]],
                    chute_direction=r[key_index["chute_direction"]],
                    chute_type=r[key_index["chute_type"]],
                    fifo_index=r[key_index["fifo_index"]],
                    motor_chute_id=r[key_index["motor_chute_id"]],
                )
            )
        return return_list

    async def post_line_chute(
        self,
        db: AsyncSession,
        line_id: int,
        part_model: str,
        chute_type: str,
        marker_id: int,
    ):
        res = await self.crud.post_line_chute(
            db=db, line_id=line_id, part_model=part_model, chute_type=chute_type
        )
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                LineChute(
                    id=r[key_index["id"]],
                    line_id=r[key_index["line_id"]],
                    part_model=r[key_index["part_model"]],
                    box_model=r[key_index["box_model"]],
                    group_id=r[key_index["group_id"]],
                    chute_marker_no=r[key_index["chute_marker_no"]],
                    chute_direction=r[key_index["chute_direction"]],
                    chute_type=r[key_index["chute_type"]],
                    fifo_index=r[key_index["fifo_index"]],
                    motor_chute_id=r[key_index["motor_chute_id"]],
                )
            )
        return return_list

    async def post_line_chute_flow_chart(self, db: AsyncSession, filterdata: list):
        await self.crud.post_line_chute_flow_chart(db=db, filterdata=filterdata)

    async def post_flow_chart(self, db: AsyncSession, node: dict, line_id: int):
        await self.crud.post_flow_chart(db=db, node=node, line_id=line_id)

    async def get_flow_chart(self, db: AsyncSession, line_id: int):
        res = await self.crud.get_flow_chart(db=db, line_id=line_id)
        for r in res:
            key_index = r._key_to_index
            flow_chart_data = r[key_index["flow_chart_data"]]
        return flow_chart_data

    async def get_l_marker_group(
        self, db: AsyncSession, group_id: int = None, line_id: int = None
    ):
        res = await self.crud.get_l_marker_group(
            db=db, group_id=group_id, line_id=line_id
        )
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                LMarkerGroup(
                    id=r[key_index["id"]],
                    line_id=r[key_index["line_id"]],
                    group_id=r[key_index["group_id"]],
                    l_marker_id=UUID(r[key_index["l_marker_id"]]),
                )
            )
        return return_list

    async def get_order_mission(
        self, db: AsyncSession, order_type: int = None, line_id: int = None
    ):
        res = await self.crud.get_order_mission(
            db=db, order_type=order_type, line_id=line_id
        )
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                OrderMission(
                    id=r[key_index["id"]],
                    line_id=r[key_index["line_id"]],
                    order_type=r[key_index["order_type"]],
                    mission_id_list=r[key_index["mission_id_list"]],
                    order_mission_id=r[key_index["order_mission_id"]],
                )
            )
        return return_list

    async def get_mission_action(
        self,
        db: AsyncSession,
        line_id: int = None,
        part_model: str = None,
        box_model: str = None,
        mission_id: str = None,
    ):
        res = await self.crud.get_mission_action(
            db=db,
            line_id=line_id,
            part_model=part_model,
            box_model=box_model,
            mission_id=mission_id,
        )
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                MissionAction(
                    id=r[key_index["id"]],
                    line_id=line_id,
                    part_model=r[key_index["part_model"]],
                    box_model=r[key_index["box_model"]],
                    mission_id=mission_id,
                    action_parameter=r[key_index["action_parameter"]],
                    action_parameter_endpoint=r[key_index["action_parameter_endpoint"]],
                )
            )
        # print("print return_list", return_list)
        return return_list

    async def get_line_attribute(self, line_id: int, db: AsyncSession):
        res = await self.crud.get_line_attribute(line_id=line_id, db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                LineAttribute(
                    id=r[key_index["id"]],
                    line_id=line_id,
                    attribute=r[key_index["attribute"]],
                )
            )
        return return_list
