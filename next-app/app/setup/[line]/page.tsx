"use client";
import {
  FreeRollerNode,
  GroupIdNode,
  MotorRollerNode,
  RobotNode,
} from "@/components/FlowComponent";
import axiosInstance from "@/lib/axios";
import { Datum, IconStore } from "@ant-design/charts";
import { SaveOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import {
  Button,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
} from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Flowchart = dynamic(
  async () => {
    IconStore.set("SaveOutlined", SaveOutlined);
    return await import("@ant-design/flowchart").then((d) => d.Flowchart);
  },
  { ssr: false }
);
const FormWrapper = dynamic(
  async () => await import("@ant-design/flowchart").then((d) => d.FormWrapper),
  { ssr: false }
);

interface IProps {
  params: {
    line: string;
  };
}

interface Attribute {
  item: string;
  type: string;
  image: string;
  label: string;
}

const robotIds = [
  { label: "MiR No.1", value: "192.168.10.120" },
  { label: "MiR No.2", value: "192.168.10.110" },
];

const InputComponent = (props: any) => {
  // useEffect(() => {
  //   try {
  //     const response = axiosInstance.get("/common/get_flow_chart");
  //     console.log("res", response);
  //   } catch (error) {
  //     console.error("Error retrieving line attribute:", error);
  //   }
  // }, []);
  const [lineAttributes, setLineAttributes] = useState<Attribute[]>([]);
  const { config, plugin = {} } = props;
  const { placeholder, disabled, name } = config;
  const { updateNode } = plugin;
  const type = (name as string).split("-").pop();
  const [label, setLabel] = useState(config?.label);
  const [transferDirection, setTransferDirection] = useState(
    config?.transferDirection || 1
  );
  const [chuteDirection, setChuteDirection] = useState(
    config?.chuteDirection || 1
  );
  const [markerId, setMarkerId] = useState(config?.markerId || 1);
  const [boxStack, setBoxStack] = useState(config?.boxStack || 1);
  const [groupId, setGroupId] = useState(config?.groupId || 2);
  const [motorId, setMotorId] = useState(config?.motorId || "");
  const [partModel, setPartModel] = useState(config?.partModel || "");
  const [boxModel, setBoxModel] = useState(config?.boxModel || "");
  const [chuteType, setChuteType] = useState(config?.chuteType || "");
  const [robotId, setRobotId] = useState<string[]>([]);

  const onLabelChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(value);
    updateNode({
      label: value,
    });
  };

  const onGroupIdChange = (value: any) => {
    setGroupId(value);
    updateNode({
      groupId: value,
    });
  };

  const onChuteDirectionChange = ({ target: { value } }: RadioChangeEvent) => {
    setChuteDirection(value);
    updateNode({
      chuteDirection: value,
    });
  };

  const onMarkerIdChange = (value: any) => {
    setMarkerId(value);
    updateNode({
      markerId: value,
    });
  };

  const onBoxStackChange = (value: any) => {
    setBoxStack(value);
    updateNode({
      boxStack: value,
    });
  };

  const onPartModelChange = (value: any) => {
    setPartModel(value);
    updateNode({
      partModel: value,
    });
  };

  const onBoxModelChange = (value: any) => {
    setBoxModel(value);
    updateNode({
      boxModel: value,
    });
  };
  const onChuteTypeChange = (value: any) => {
    setChuteType(value);
    updateNode({
      chuteType: value,
    });
  };

  const onMotorIdChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setMotorId(value);
    updateNode({
      motorId: value,
    });
  };

  const onRobotIdChange = (value: string[]) => {
    setRobotId(value);
    updateNode({
      robotId: value,
    });
  };

  useEffect(() => {
    setLabel(config?.label || "");
    setTransferDirection(config?.transferDirection || 1);
    setChuteDirection(config?.chuteDirection || 1);
    setMarkerId(config?.markerId || 1);
    setBoxStack(config?.boxStack || 1);
    setMotorId(config?.motorId || "");
    setRobotId(config?.robotId || []);
    setGroupId(config?.groupId || 2);
    setPartModel(config?.partModel || "");
    setBoxModel(config?.boxModel || "");
    setChuteType(config?.chuteType || "");
    updateNode({
      label,
      transferDirection,
      chuteDirection,
      markerId,
      boxStack,
      motorId,
      robotId,
      groupId,
      chuteType,
      partModel,
      boxModel,
    });
  }, [config]);
  console.log(config);
  // TODO add cart node and fix amount = 1
  // TODO send cart direction to change chute direction
  // TODO map all data by line_id (create new table)

  return (
    <div className="node-setting-panel">
      <div>
        <label>Label: </label>
        <Input
          value={label}
          onChange={onLabelChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      {config.name === "custom-node-indicator-groupid" && (
        <div>
          <label>Group ID : </label>
          <InputNumber
            value={groupId}
            onChange={onGroupIdChange}
            placeholder={placeholder}
            disabled={config.name !== "custom-node-indicator-groupid"}
          />
        </div>
      )}
      {config.name === "custom-node-indicator-free" && (
        <>
          <div>
            <label>Chute Type : </label>
            <Select
              value={chuteType}
              onChange={onChuteTypeChange}
              placeholder={placeholder}
              disabled={type == "groupid"}
              options={[
                { value: "empty_receive", label: "empty_receive" },
                { value: "empty_send", label: "empty_send" },
                { value: "fg_receive", label: "fg_receive" },
                { value: "fg_send", label: "fg_send" },
              ]}
            />
          </div>
          {chuteType.startsWith("fg") && (
            <div>
              <label>Part Model : </label>
              <Select
                value={partModel}
                onChange={onPartModelChange}
                placeholder={placeholder}
                disabled={type == "groupid"}
                options={[
                  { value: "ROT1", label: "ROT1" },
                  { value: "ROT2", label: "ROT2" },
                  { value: "ROT3", label: "ROT3" },
                  { value: "REC1", label: "REC1" },
                  { value: "REC2", label: "REC2" },
                  { value: "REC3", label: "REC3" },
                ]}
              />
            </div>
          )}
          {chuteType.startsWith("em") && (
            <div>
              <label>Box Model : </label>
              <Select
                value={boxModel}
                onChange={onBoxModelChange}
                placeholder={placeholder}
                disabled={type == "groupid"}
                options={[
                  { value: "BOX1", label: "BOX1" },
                  { value: "BOX2", label: "BOX2" },
                  { value: "BOX3", label: "BOX3" },
                ]}
              />
            </div>
          )}
          <div>
            <label>Chute Direction: </label>
            <Radio.Group
              options={[
                { label: type == "robot" ? "Up" : "Left", value: 2 },
                { label: type == "robot" ? "Down" : "Right", value: 1 },
              ]}
              value={chuteDirection}
              onChange={onChuteDirectionChange}
              disabled={type !== "motor" && type == "groupid"}
            />
          </div>
          <div>
            <label>Marker ID: </label>
            <InputNumber
              value={markerId}
              onChange={onMarkerIdChange}
              disabled={type === "robot"}
              defaultValue={0}
              min={0}
              max={100}
            />
          </div>
          <div>
            <label>Box stack: </label>
            <InputNumber
              value={boxStack}
              onChange={onBoxStackChange}
              disabled={type === "robot"}
              defaultValue={1}
              min={1}
              max={10}
            />
          </div>
        </>
      )}
      {config.name === "custom-node-indicator-motor" && (
        <>
          <div>
            <label>Chute Type : </label>
            <Select
              value={chuteType}
              onChange={onChuteTypeChange}
              placeholder={placeholder}
              disabled={type == "groupid"}
              options={[
                { value: "empty_receive", label: "empty_receive" },
                { value: "empty_send", label: "empty_send" },
                { value: "fg_receive", label: "fg_receive" },
                { value: "fg_send", label: "fg_send" },
              ]}
            />
          </div>
          <div>
            <label>Chute Direction: </label>
            <Radio.Group
              options={[
                { label: type == "robot" ? "Up" : "Left", value: 1 },
                { label: type == "robot" ? "Down" : "Right", value: 2 },
              ]}
              value={chuteDirection}
              onChange={onChuteDirectionChange}
              disabled={type !== "motor" && type == "groupid"}
            />
          </div>
          <div>
            <label>Motor Id: </label>
            <Input
              value={motorId}
              onChange={onMotorIdChange}
              placeholder={"guid of I/O module"}
              disabled={type !== "motor"}
            />
          </div>
          {chuteType.startsWith("em") && (
            <div>
              <label>Box Model : </label>
              <Select
                value={boxModel}
                onChange={onBoxModelChange}
                placeholder={placeholder}
                disabled={type == "groupid"}
                options={[
                  { value: "BOX1", label: "BOX1" },
                  { value: "BOX2", label: "BOX2" },
                  { value: "BOX3", label: "BOX3" },
                ]}
              />
            </div>
          )}
          {chuteType.startsWith("fg") && (
            <div>
              <label>Part Model : </label>
              <Select
                value={partModel}
                onChange={onPartModelChange}
                placeholder={placeholder}
                disabled={type == "groupid"}
                options={[
                  { value: "ROT1", label: "ROT1" },
                  { value: "ROT2", label: "ROT2" },
                  { value: "ROT3", label: "ROT3" },
                  { value: "REC1", label: "REC1" },
                  { value: "REC2", label: "REC2" },
                  { value: "REC3", label: "REC3" },
                ]}
              />
            </div>
          )}
          <div>
            <label>Box stack: </label>
            <InputNumber
              value={boxStack}
              onChange={onBoxStackChange}
              disabled={type === "robot"}
              defaultValue={1}
              min={1}
              max={10}
            />
          </div>
          <div>
            <label>Marker ID: </label>
            <InputNumber
              value={markerId}
              onChange={onMarkerIdChange}
              disabled={type === "robot"}
              defaultValue={0}
              min={0}
              max={100}
            />
          </div>
        </>
      )}

      {config.name === "custom-node-indicator-robot" && (
        <div>
          <label>Robot Id: </label>
          <Select
            value={robotId}
            onChange={onRobotIdChange}
            disabled={type !== "robot"}
            mode="multiple"
            defaultActiveFirstOption
            options={robotIds}
          />
        </div>
      )}
    </div>
  );
};

const RenameService = (props: any) => {
  return (
    <FormWrapper {...props}>
      {(config, plugin) => (
        <InputComponent {...props} plugin={plugin} config={config} />
      )}
    </FormWrapper>
  );
};

const CanvasService = (props: any) => {
  return <p style={{ textAlign: "center" }}>Chute layout adjust</p>;
};

export const controlMapService = (controlMap: any) => {
  controlMap.set("rename-service", RenameService);
  controlMap.set("canvas-service", CanvasService);
  return controlMap;
};

const formSchemaService = async (args: any) => {
  const { targetType } = args;
  const isGroup = args.targetData?.isGroup;
  const nodeSchema = {
    tabs: [
      {
        name: "tab name",
        groups: [
          {
            name: "groupName",
            controls: [
              {
                label: "node",
                name: "nodeForm",
                shape: "rename-service",
                placeholder: "node placeholder",
              },
            ],
          },
        ],
      },
    ],
  };

  if (isGroup) {
    // to do something
  }

  if (targetType === "node") {
    return nodeSchema;
  }

  if (targetType === "edge") {
    // to do something
  }

  return {
    tabs: [
      {
        name: "Setting panel",
        groups: [
          {
            name: "groupName",
            controls: [
              {
                label: "",
                name: "canvas-service",
                shape: "canvas-service",
              },
            ],
          },
        ],
      },
    ],
  };
};

const Setup: React.FC<IProps> = ({ params }) => {
  const { line } = params;
  const [dataFlowChart, setDataFlowChart] = useState({});
  const [lineAttributes, setLineAttributes] = useState<Attribute[]>([]);

  const onSave = async (d: Datum) => {
    // const filteredNodes = d.nodes.map((node: any) => {
    //   if (node.name === "custom-node-indicator-motor") {
    //     return {
    //       name: node.name,
    //       label: node.label,
    //       chuteType: node.chuteType,
    //       transferDirection: node.transferDirection,
    //       chuteDirection: node.chuteDirection,
    //       motorId: node.motorId,
    //       line_id: line,
    //     };
    //   } else if (node.name === "custom-node-indicator-free") {
    //     return {
    //       name: node.name,
    //       label: node.label,
    //       partModel: node.partModel,
    //       boxModel: node.boxModel,
    //       boxStack: node.boxStack,
    //       chuteType: node.chuteType,
    //       markerId: node.markerId,
    //     };
    //   } else if (node.name === "custom-node-indicator-robot") {
    //     return {
    //       name: node.name,
    //       label: node.label,
    //       robotId: node.robotId,
    //       line_id: line,
    //     };
    //   } else if (node.name === "custom-node-indicator-groupid") {
    //     return {
    //       name: node.name,
    //       label: node.label,
    //       groupId: node.groupId,
    //       line_id: line,
    //     };
    //   }
    // });
    // console.log(filteredNodes);
    console.log(d);
    try {
      const response1 = await axiosInstance.post(
        `/common/flow_chart_param?line_id=${line}`,
        {
          nodes: d.nodes,
        }
      );
      const response2 = await axiosInstance.post(
        `/common/flow_chart?line_id=${line}`,
        d
      );
    } catch (error) {
      console.error("Error retrieving line attribute:", error);
    }
  };

  useEffect(() => {
    (async (async) => {
      try {
        const response1 = await axiosInstance.get(
          `/common/get_flow_chart?line_id=${line}`
        );
        setDataFlowChart(response1.data.data);

        const response = await axiosInstance.get(
          `/common/line_attribute?line_id=${line}`
        );
        console.log("response data =", response.data.data[0].attribute);
        setLineAttributes(response.data.data[0].attribute);
      } catch (error) {
        console.error("Error retrieving line attribute:", error);
      }
    })();
  }, [line]);

  return (
    <div className="flow-chart">
      <Flowchart
        data={dataFlowChart}
        onSave={onSave}
        toolbarPanelProps={{
          position: {
            top: 0,
            left: 0,
            right: 0,
          },
          commands: [
            {
              command: "undo-cmd",
              tooltip: "undo",
              iconName: "UndoOutlined",
            },
            {
              command: "redo-cmd",
              tooltip: "redo",
              iconName: "RedoOutlined",
            },
            {
              command: "graph-toggle-multi-select",
              tooltip: "multiple select",
              iconName: "GatewayOutlined",
            },
            {
              command: "graph-copy-selection",
              tooltip: "copy",
              iconName: "CopyOutlined",
            },
            {
              command: "save-graph-data",
              tooltip: "save",
              iconName: "SaveOutlined",
            },
          ],
          show: true,
        }}
        scaleToolbarPanelProps={{
          layout: "horizontal",
          position: {
            right: 0,
            top: -40,
          },
          style: {
            width: 150,
            height: 39,
            left: "auto",
            background: "transparent",
          },
        }}
        canvasProps={{
          position: {
            top: 40,
            left: 0,
            right: 0,
            bottom: 0,
          },
          config: {
            snapline: {
              enabled: true,
              sharp: true,
            },
          },
        }}
        nodePanelProps={{
          position: { width: 220, top: 40, bottom: 0, left: 0 },
          defaultActiveKey: ["custom"], // ['custom', 'official']
          showHeader: false,
          showOfficial: false,
          // @ts-expect-error
          registerNode: {
            title: "Chute components",
            nodes: [
              {
                component: FreeRollerNode,
                popover: () => <div>Free roller</div>,
                name: "custom-node-indicator-free",
                width: 160,
                height: 60,

                // label: "FG chute",
                ports: [],
              },
              {
                component: MotorRollerNode,
                popover: () => <div>Motor roller</div>,
                name: "custom-node-indicator-motor",
                width: 160,
                height: 60,
                // label: "Empty box chute",
                ports: [],
              },
              {
                component: (props) => RobotNode(props),
                popover: () => <div>AGV Robot</div>,
                name: "custom-node-indicator-robot",
                width: 55,
                height: 80,
                // label: "Empty box chute",
                ports: [],
              },
              {
                component: (props) => GroupIdNode(props),
                popover: () => <div>Group ID</div>,
                name: "custom-node-indicator-groupid",
                width: 55,
                height: 80,
                // label: "Empty box chute",
                ports: [],
              },
            ],
          },
        }}
        detailPanelProps={{
          position: { width: 200, top: 40, bottom: 0, right: 0 },
          controlMapService,
          formSchemaService,
        }}
      />
    </div>
  );
};

export default Setup;
