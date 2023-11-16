import React, { useEffect } from "react"
import { Button, Checkbox, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import { BsFillEyeFill } from "react-icons/bs"
import { RobotInfo } from "@/constants/interface"
import { useRobotStore } from "@/store/robot.store"


interface TableProps {
  onEdit: (value: any) => void
}

const RobotListTable: React.FC<TableProps> = ({ onEdit }) => {
  const robotInfo = useRobotStore().robotInfo
  const fetchRobot = useRobotStore().fetchRobot

  function transformRobotInfoArray(robotInfoArray: RobotInfo[]): RobotInfo[] {
    return robotInfoArray.map((robotInfo) => ({
      ...robotInfo,
      is_available: robotInfo.is_available.toString(),
      name: robotInfo.name == null ? "Anonymous" : robotInfo.name
    }))
  }

  const newRobotInfos = transformRobotInfoArray(robotInfo)

  const columns: ColumnsType<RobotInfo> = [
    { title: "ID", dataIndex: "id", key: "id", width: "auto" },
    { title: "Name", dataIndex: "name", key: "name", width: "auto" },
    { title: "IP", dataIndex: "ip", key: "ip", width: "auto" },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      width: "8rem",
      render: (value) =>
        value === "true" ?
          <Checkbox defaultChecked={true} disabled className="flex justify-center" /> :
          <Checkbox disabled className="flex justify-center" />
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      width: "8rem",
      render: (value) => (
        <div className="flex justify-center">
          <Button shape="circle" icon={<BsFillEyeFill />} onClick={() => onEdit(value)} />
        </div>
      ),
    },
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRobot()
    }, 5000)

    fetchRobot()

    return () => clearInterval(intervalId)
  }, [])

  const openScroll = robotInfo.length > 11

  return (
    <>
      <h1 className="mb-4 font-bold text-lg">Active Robots</h1>
      {!!robotInfo ? (
        <Table
          columns={columns}
          dataSource={newRobotInfos}
          className="w-full"
          scroll={openScroll ? { y: 600 } : undefined}
          bordered={true}
          pagination={false}
        />
      ) : (
        <Table
          columns={columns}
          className="w-full"
          bordered={true}
          pagination={false}
        />
      )}
    </>
  )
}

export default RobotListTable
