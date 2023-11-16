from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from uuid import UUID


class CommonCRUD:
    def __init__(self):
        pass

    async def get_line_chute(
        self,
        db: AsyncSession,
        line_id: int,
        part_model: str = None,
        box_model: str = None,
    ):
        stmt = f"select * from line_chute where line_id = :line_id"

        if part_model and not box_model:
            stmt += " and part_model = :part_model"
        elif box_model and not part_model:
            stmt += " and box_model = :box_model"
        elif box_model and part_model:
            stmt += " and (part_model = :part_model or box_model = :box_model)"
        stmt += " order by group_id, fifo_index, chute_marker_no"

        rs = await db.execute(
            text(stmt),
            params={
                "line_id": line_id,
                "part_model": part_model,
                "box_model": box_model,
            },
        )
        return rs

    async def post_line_chute(
        self,
        db: AsyncSession,
        line_id: int,
        part_model: str,
        chute_type: str,
        marker_id: int,
    ):
        stmt = """UPDATE line_chute 
            SET chute_type = :chute_type, chute_marker_no = :marker_id, part_model = :part_model, box_model = :box_model
            WHERE line_id = :line_id AND 
            """
        rs = await db.execute(
            text(stmt),
            params={
                "line_id": line_id,
                "part_model": part_model,
                "chute_type": chute_type,
                "marker_id": marker_id,
            },
        )

    async def post_line_chute_flow_chart(self, db: AsyncSession, filterdata: list):
        delete_stmt = """
            DELETE FROM line_chute
            WHERE line_id = :line_id
            """
        await db.execute(
            text(delete_stmt),
            params={
                "line_id": int(
                    filterdata[0]["line_id"]
                ),  # Assuming line_id is the same for all items
            },
        )
        for data in filterdata:
            insert_stmt = """
            INSERT INTO line_chute (line_id, chute_type, chute_marker_no, part_model, box_model, chute_direction, group_id, motor_chute_id )
            VALUES (:line_id, :chute_type, :chute_marker_no, :part_model, :box_model, :chute_direction, :group_id, :motor_chute_id)
            """
            await db.execute(
                text(insert_stmt),
                params={
                    "line_id": int(data["line_id"]),
                    "part_model": data["part_model"],
                    "chute_type": data["chute_type"],
                    "chute_marker_no": data["chute_marker_no"],
                    "box_model": data["box_model"],
                    "chute_direction": data["chute_direction"],
                    "group_id": data["group_id"],
                    "motor_chute_id": data["motor_chute_id"],
                },
            )
            await db.commit()

    async def post_flow_chart(self, db: AsyncSession, node=dict, line_id=int):
        stmt = """
            INSERT INTO flow_chart (line_id,flow_chart_data)
            VALUES (:line_id, cast(:flow_chart_data AS jsonb))
            ON CONFLICT (line_id) DO UPDATE SET flow_chart_data = cast(:flow_chart_data AS jsonb)
            """
        await db.execute(
            text(stmt),
            params={"line_id": line_id, "flow_chart_data": node},
        )
        await db.commit()

    async def get_flow_chart(self, db: AsyncSession, line_id=int):
        stmt = """
            SELECT flow_chart_data from flow_chart WHERE line_id = :line_id
            """
        rs = await db.execute(
            text(stmt),
            params={"line_id": line_id},
        )
        return rs

    # async def post_line_chute_flow_chart(self, db: AsyncSession, filterdata: list):
    # for data in filterdata:
    #     stmt = """UPDATE line_chute
    #         SET chute_type = :chute_type, chute_marker_no = :chute_marker_no, part_model = :part_model, box_model = :box_model, chute_direction = :chute_direction, group_id = :group_id, motor_chute_id = :motor_chute_id
    #         WHERE line_id = :line_id
    #         """
    #     await db.execute(
    #         text(stmt),
    #         params={
    #             "line_id": int(data["line_id"]),
    #             "part_model": data["part_model"],
    #             "chute_type": data["chute_type"],
    #             "chute_marker_no": data["chute_marker_no"],
    #             "box_model": data["box_model"],
    #             "chute_direction": data["chute_direction"],
    #             "group_id": data["group_id"],
    #             "motor_chute_id": data["motor_chute_id"],
    #             "chute_type": data["chute_type"],
    #         },
    #     )
    #     # await db.commit()

    async def get_l_marker_group(
        self, db: AsyncSession, group_id: int = None, line_id: int = None
    ):
        stmt = f"select * from l_marker_group"
        contain_where = False
        if line_id:
            stmt += " where line_id = :line_id"
            contain_where = True

        if group_id:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
            stmt += " group_id = :group_id"

        stmt += " order by group_id, line_id"

        rs = await db.execute(
            text(stmt), params={"line_id": line_id, "group_id": group_id}
        )
        return rs

    async def get_order_mission(
        self, db: AsyncSession, order_type: int = None, line_id: int = None
    ):
        stmt = f"select * from order_mission"
        contain_where = False
        if line_id:
            stmt += " where line_id = :line_id"
            contain_where = True

        if order_type:
            if contain_where:
                stmt += " and"
            else:
                stmt += " where"
            stmt += " order_type = :order_type"

        rs = await db.execute(
            text(stmt), params={"line_id": line_id, "order_type": order_type}
        )
        return rs

    async def get_mission_action(
        self,
        db: AsyncSession,
        line_id: int,
        mission_id: str,
        part_model: str = None,
        box_model: str = None,
    ):
        stmt = f"select * from mission_action where line_id = :line_id and mission_id = :mission_id"

        if part_model and not box_model:
            stmt += " and part_model = :part_model"
        elif box_model and not part_model:
            stmt += " and box_model = :box_model"
        elif box_model and part_model:
            stmt += " and (part_model = :part_model or box_model = :box_model)"
        # print("print stmt", stmt)

        rs = await db.execute(
            text(stmt),
            params={
                "line_id": line_id,
                "part_model": part_model,
                "box_model": box_model,
                "mission_id": mission_id,
            },
        )
        # print("print rs of get_mission_action", rs)
        return rs

    async def get_line_attribute(self, line_id: int, db: AsyncSession):
        stmt = f"select * from agv_line_attribute where line_id = :line_id"

        rs = await db.execute(text(stmt), params={"line_id": line_id})
        return rs
