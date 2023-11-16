"use client";
import axiosInstance from "@/lib/axios";
import { Button, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";

interface IProps {
  params: {
    line: string;
  };
}

const Setup: React.FC<IProps> = ({ params }) => {
  const { line } = params;
  const [isModalOpenRec, setIsModalOpenRec] = useState(false);
  const [isModalOpenRotor, setIsModalOpenRotor] = useState(false);
  const [isModalOpenAssy, setIsModalOpenAssy] = useState(false);
  const [assyForm] = Form.useForm();

  const showModalRec = () => {
    setIsModalOpenRec(true);
  };

  const showModalRotor = () => {
    setIsModalOpenRotor(true);
  };

  const showModalAssy = () => {
    setIsModalOpenAssy(true);
  };

  const handleOkRec = () => {
    setIsModalOpenRec(false);
  };

  const handleOkRotor = () => {
    setIsModalOpenRotor(false);
  };

  const handleCancel = () => {
    setIsModalOpenRec(false);
    setIsModalOpenRotor(false);
    setIsModalOpenAssy(false);
  };

  const handleSelectChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onFinish = async (data: any) => {
    const { chuteType, partModel, markerId } = data;
    console.log(data);
    // modify existed row
    await modifyChute(chuteType, partModel, markerId);
    // setIsModalOpenAssy(false);
  };

  const modifyChute = async (
    chuteType: string,
    partModel: string,
    markerId: number
  ) => {
    // try {
    //   const response = await axiosInstance.get(`/common/line_attribute`, {
    //     params: { line_id: line },
    //   });
    // } catch (error) {
    //   console.error("Error retrieving line attribute:", error);
    // }
  };

  return (
    <div style={{ height: "100dvh", width: "100%", padding: "3rem" }}>
      <div style={{ height: "100%", display: "flex", gap: "15rem" }}>
        <div
          className="left"
          style={{ width: "50%", padding: "1rem 1rem 1rem 1rem" }}
        >
          <div
            className="top"
            style={{
              height: "50%",
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <h1 style={{ position: "absolute" }}>
              Rectifier<span style={{ fontSize: "1rem" }}> line id : 1</span>
            </h1>
            <div
              className="top-left"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="rectifier-1"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRec}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rectifier-2"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRec}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
            <div
              className="top-right"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="rectifier-3"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRec}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rectifier-4"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRec}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rectifier-5"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRec}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
          </div>
          <div
            className="bottom"
            style={{
              height: "50%",
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <h1 style={{ position: "absolute" }}>
              Rotor<span style={{ fontSize: "1rem" }}> line id : 2</span>
            </h1>
            <div
              className="bottom-left"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                className="rotor-1"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRotor}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rotor-2"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRotor}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
            <div
              className="bottom-right"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              <div
                className="rotor-3"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRotor}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rotor-4"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRotor}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="rotor-5"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalRotor}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
          </div>
        </div>
        <div className="right" style={{ width: "50%" }}>
          <div
            className="top"
            style={{
              height: "50%",
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            <h1 style={{ position: "absolute" }}>
              Assy<span style={{ fontSize: "1rem" }}> line id : 3</span>
            </h1>
            <div
              className="top-left"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="assy-1"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalAssy}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="assy-2"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalAssy}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
            <div
              className="top-right"
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="assy-3"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalAssy}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="assy-4"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalAssy}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
              <div
                className="assy-5"
                style={{
                  height: "25%",
                  border: "1px solid",
                  cursor: "pointer",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={showModalAssy}
              >
                <span>Chute Type : </span>
                <span>Chute marker ID : </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Rectfier line : 1"
        open={isModalOpenRec}
        onOk={handleOkRec}
        onCancel={handleCancel}
        centered
      >
        <h3>Chute Type</h3>
        <Select
          style={{ width: 300 }}
          options={[
            { value: "rec1", label: "Rectifier Part no.1" },
            { value: "rec2", label: "Rectifier Part no.2" },
            { value: "rec3", label: "Rectifier Part no.3" },
            { value: "rec4", label: "Rectifier BOX Model 1" },
            { value: "rec5", label: "Rectifier BOX Model 2" },
            { value: "rec6", label: "Rectifier BOX Model 3" },
          ]}
          onChange={handleSelectChange}
        />
        <h3>Chute marker ID</h3>
        <Input />
      </Modal>
      <Modal
        title="Rotor line : 2"
        open={isModalOpenRotor}
        onOk={handleOkRotor}
        onCancel={handleCancel}
        centered
      >
        <h3>Chute Type</h3>
        <Select
          style={{ width: 300 }}
          options={[
            { value: "rotor1", label: "Rotor Part no.1" },
            { value: "rotor2", label: "Rotor Part no.2" },
            { value: "rotor3", label: "Rotor Part no.3" },
            { value: "rotor4", label: "Rotor BOX Model 1" },
            { value: "rotor5", label: "Rotor BOX Model 2" },
            { value: "rotor6", label: "Rotor BOX Model 3" },
          ]}
          onChange={handleSelectChange}
        />
        <h3>Chute marker ID</h3>
        <Input />
      </Modal>
      <Modal
        title="Assy line : 3"
        open={isModalOpenAssy}
        centered
        closeIcon={false}
        footer={false}
      >
        <Form onFinish={onFinish} form={assyForm}>
          <Form.Item
            label="Chute type"
            name="chuteType"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 300 }}
              options={[
                { value: "empty_receive", label: "Empty box: Receive lane" },
                { value: "empty_send", label: "Empty box: Send lane" },
                { value: "fg_receive", label: "Finish good: Receive lane" },
                { value: "fg_send", label: "Finish good: Send lane" },
              ]}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item
            label="Part model"
            name="partModel"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: 300 }}
              options={[
                { value: "ASSY1", label: "Alt. Assy Part no.1" },
                { value: "ASSY2", label: "Alt. Assy Part no.2" },
                { value: "ASSY3", label: "Alt. Assy Part no.3" },
              ]}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item
            label="Marker ID"
            name="markerId"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <div style={{ display: "flex", gap: "4px" }}>
            <Button htmlType="submit" type="primary">
              Save
            </Button>
            <Button onClick={handleCancel} type="primary" danger>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Setup;
