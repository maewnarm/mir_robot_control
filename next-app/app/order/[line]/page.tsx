"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Space,
  Card,
  Row,
  Col,
  Form,
  notification,
  ConfigProvider,
  Typography,
  Steps,
} from "antd";
import axiosInstance from "@/lib/axios";
import { LoadingOutlined } from "@ant-design/icons";
import { AiFillClockCircle, AiFillRobot, AiOutlineLeft } from "react-icons/ai";
import Image from "next/image";
import mir_main from "../../../app/assets/mir/mir100_0008.png";
import map from "../../../app/assets/mir/map.png";
import mir_side from "../../../app/assets/mir/mir100_00013.png";
import mir_loading from "../../../app/assets/loading1.png";

interface Attribute {
  item: string;
  type: string;
  image: string;
  label: string;
}

interface LineAttributesResponse {
  line_id: number;
  attribute: Attribute[];
}

interface IProps {
  params: {
    line: string;
  };
}
interface OrderData {
  line_id: number;
  part_model: string | null;
  box_model: string | null;
  order_type: number;
}

interface IFilterMission {
  group_id: number;
  chute_marker_no: number;
  fifo_index: string;
}
interface IResponseNo2 extends IFilterMission {
  line_id: number;
  part_model: string;
  box_model: string;
  chute_direction: number;
  chute_type: string;
}

const dataSubmitted = [
  {
    line_id: 4,
    task_queue: "2 queues",
    status: "Moving to Slip ring 3rd",
    estimate_time_arrival: "3 minutes...",
    duration: "2023-08-10 15:36:20.523476+07",
  },
];

const dataMockRectifier = [
  {
    item: "PointA",
    type: "part",
    image: "",
    label: "Model A",
  },
  {
    item: "PointB",
    type: "part",
    image: "",
    label: "Model B",
  },
  {
    item: "PointC",
    type: "part",
    image: "",
    label: "Model C",
  },
  {
    item: "PointD",
    type: "part",
    image: "",
    label: "Model D",
  },
  {
    item: "10pcs",
    type: "box",
    image: "",
    label: "10 pcs.",
  },
  {
    item: "5pcs",
    type: "box",
    image: "",
    label: "5 pcs.",
  },
  {
    item: "2pcs",
    type: "box",
    image: "",
    label: "2 pcs.",
  },
  {
    item: "30pcs",
    type: "box",
    image: "",
    label: "30 pcs.",
  },
];

const dataMockAltAssy = [
  {
    item: "TG000000-125A",
    type: "part",
    image: "",
    label: "125A",
  },
  {
    item: "TG000000-159A",
    type: "part",
    image: "",
    label: "159A",
  },
  {
    item: "PointC",
    type: "part",
    image: "",
    label: "Point C",
  },
  {
    item: "Grey box 30 pcs.",
    type: "box",
    image: "",
    label: "30 pcs.",
  },
  {
    item: "Grey box 10 pcs.",
    type: "box",
    image: "",
    label: "10 pcs.",
  },
  {
    item: "2pcs",
    type: "box",
    image: "",
    label: "2 pcs.",
  },
];

const OrderPage: React.FC<IProps> = ({ params }) => {
  const router = useRouter();
  const { line } = params;
  const [lineAttributes, setLineAttributes] = useState<Attribute[]>([]);
  const [form] = Form.useForm<OrderData>();
  const [selectedModel, setSelectedModel] = useState<Attribute | null>(null);
  const [selectedBoxType, setSelectedBoxType] = useState<Attribute | null>(
    null
  );
  const [taskQueue, setTaskQueue] = useState("");
  const [status, setStatus] = useState("");
  const [estimateTime, setEstimateTime] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  //for static
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [fetchPLCRegister, setFetchPLCRegister] = useState<boolean>(false);
  const [fetchChangeAction, setFetchChangeAction] = useState<boolean>(false);
  const [fetchPostMission, setFetchPostMission] = useState<boolean>(false);
  const [changeToMapInterface, setChangeToMapInterface] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchLineAttributes = async () => {
      try {
        const response = await axiosInstance.get(`/common/line_attribute`, {
          params: { line_id: line },
        });
        // console.log("response data =", response.data.data[0].attribute);
        setLineAttributes(response.data.data[0].attribute);
      } catch (error) {
        console.error("Error retrieving line attribute:", error);
      }
    };

    fetchLineAttributes();
  }, [line]);

  const handleBackClick = () => {
    router.push("/");
  };

  const handleCardClick = (attr: Attribute) => {
    if (attr.type === "part") {
      setSelectedModel((prevSelected) => (prevSelected === attr ? null : attr));
    } else if (attr.type === "box") {
      setSelectedBoxType((prevSelected) =>
        prevSelected === attr ? null : attr
      );
    }
  };
  const handleOrderClick = async () => {
    setOrderSubmitted(true);
    setLoading(true); // Show loading state

    let orderType = 0; // Default order type (no selection)

    if (selectedModel && selectedBoxType) {
      orderType = 1; // Case 1: Both part model and box type selected
    } else if (selectedModel) {
      orderType = 2; // Case 2: Only part model selected
    } else if (selectedBoxType) {
      orderType = 3; // Case 3: Only box type selected
    }

    form.setFieldsValue({
      line_id: +line,
      part_model: selectedModel?.item ?? null,
      box_model: selectedBoxType?.item ?? null,
      order_type: orderType,
    });

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    try {
      setFetchPLCRegister(true);
      const response = await axiosInstance.post(`/task/save_task_queue`, {
        line_id: form.getFieldValue("line_id"),
        part_model: form.getFieldValue("part_model"),
        box_model: form.getFieldValue("box_model"),
        order_type: form.getFieldValue("order_type"),
      });
      setFetchChangeAction(true);
      setFetchPLCRegister(false);
    } catch (error) {
      // Handle any errors that may occur during the fetch requests
      console.error("Error:", error);
    } finally {
      // console.log("fetch promise done");
      setFetchPostMission(true);
      setFetchPLCRegister(false);
      setFetchChangeAction(false);

      setOrderSubmitted(false);
      setFetchPostMission(false);
      setFetchChangeAction(false);
      setFetchPLCRegister(false);

      setChangeToMapInterface(true);
    }

    const submittedData = dataSubmitted.find(
      (item) => item.line_id === parseInt(line)
    );

    if (submittedData) {
      setTaskQueue(submittedData.task_queue);
      setStatus(submittedData.status);
      setEstimateTime(submittedData.estimate_time_arrival);
    }
    form.submit(); // Submit the form

    if (changeToMapInterface) {
      // console.log("here");
      switch (orderType) {
        case 1:
          notification.success({
            message: "Order submitted successfully",
            description: (
              <div>
                You ordered to <strong>send finished goods</strong> to Delivery
                Area and <strong>request Emptybox</strong>
              </div>
            ),
            duration: 5, // Duration in seconds
            style: { border: "1px solid #B7EB8F", backgroundColor: "#F6FFED" },
          });
          break;
        case 2:
          notification.success({
            message: "Order submitted successfully",
            description: (
              <div>
                You ordered to <strong>send finished goods</strong> to Delivery
                Area
              </div>
            ),
            duration: 3, // Duration in seconds
            style: { border: "1px solid #B7EB8F", backgroundColor: "#F6FFED" },
          });
          break;
        case 3:
          notification.success({
            message: "Order submitted successfully",
            description: (
              <div>
                You ordered to <strong>request empty box</strong>
              </div>
            ),
            duration: 3, // Duration in seconds
            style: { border: "1px solid #B7EB8F", backgroundColor: "#F6FFED" },
          });
          break;
        default:
          break;
      }
    }

    console.log(form.getFieldsValue(true));
  };

  const stepsData = [
    {
      title: "Register",
      description: "PLC Registering.",
      icon: fetchPLCRegister ? <LoadingOutlined /> : "",
    },
    {
      title: "Action Parameters",
      description: "Action parameters is changing.",
      icon: fetchChangeAction ? <LoadingOutlined /> : "",
    },
    {
      title: "Mission Prepare",
      description: "Preparing to post mission.",
      icon: fetchPostMission ? <LoadingOutlined /> : "",
    },
  ];
  let currentStep = 0;
  if (fetchChangeAction) {
    currentStep = 1;
  } else if (fetchPostMission) {
    currentStep = 2;
  }

  return (
    <div style={{ display: "flex" }} className="box1">
      <Form
        form={form}
        // onFinish={(v) => {
        //   console.log("submitterd", v);
        // }}
        style={{ display: "flex" }}
      >
        {!orderSubmitted && (
          <>
            <div className="left-side">
              <div className="header">
                <div>
                  <Button
                    type="primary"
                    id="button-back"
                    onClick={handleBackClick}
                  >
                    <AiOutlineLeft size={15} />
                  </Button>
                </div>
                <Typography id="typo-mir-ordering">
                  &nbsp;MiR Ordering
                </Typography>
              </div>
              <div className="supply_empty_button">
                <div className="part-model-section">
                  <div className="supply-model-header">
                    <h1>Supply Model</h1>
                    <p>Please select your supply model that you want.</p>
                  </div>
                  <div className="supply-model-body">
                    <div className="card-model-container" id="style-1">
                      <Form.Item
                        name="part_model"
                        style={{ justifyContent: "center" }}
                      >
                        <Row gutter={[16, 16]} className="row-model">
                          {lineAttributes.length > 0 ? (
                            lineAttributes.map((attribute) => {
                              if (attribute.type === "part") {
                                return (
                                  <Col
                                    key={attribute.label}
                                    xs={24}
                                    sm={4}
                                    md={8}
                                    lg={8}
                                    xl={6}
                                  >
                                    <Card
                                      key={attribute.label}
                                      hoverable
                                      style={{
                                        backgroundColor:
                                          selectedModel &&
                                          selectedModel.label ===
                                            attribute.label
                                            ? "#003EB3"
                                            : "white",
                                      }}
                                      className={`card ${
                                        selectedModel &&
                                        selectedModel.label === attribute.label
                                          ? "selected"
                                          : ""
                                      }`}
                                      id="card-part-model"
                                      onClick={() => handleCardClick(attribute)}
                                    >
                                      <p
                                        id="text-incard"
                                        style={{
                                          color:
                                            selectedModel &&
                                            selectedModel.label ===
                                              attribute.label
                                              ? "white"
                                              : "#001D66",
                                        }}
                                      >
                                        {attribute.label}
                                      </p>
                                    </Card>
                                  </Col>
                                );
                              }
                              return null; // Skip attributes that don't have type "part"
                            })
                          ) : (
                            <p>No line attributes found for line {line}</p>
                          )}
                        </Row>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="empty-box-type-section">
                  <div className="emptybox-header">
                    <h1>Empty Box Type</h1>
                    <p>Please select your empty box type that you want.</p>
                  </div>
                  <div className="empty-box-body">
                    <div className="box-card-container" id="style-1">
                      <Form.Item name="box_model">
                        <Row
                          gutter={[16, 16]}
                          style={{
                            display: "flex",
                            height: "160px",
                            width: "100%",
                          }}
                          className="row-box"
                        >
                          {lineAttributes.length > 0 ? (
                            lineAttributes.map((attribute) => {
                              if (attribute.type === "box") {
                                return (
                                  <Col
                                    key={attribute.label}
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={8}
                                    xl={6}
                                  >
                                    <Card
                                      key={attribute.label}
                                      hoverable
                                      className={`card ${
                                        selectedBoxType &&
                                        selectedBoxType.label ===
                                          attribute.label
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() => handleCardClick(attribute)}
                                      style={{
                                        backgroundColor:
                                          selectedBoxType &&
                                          selectedBoxType.label ===
                                            attribute.label
                                            ? "#003EB3"
                                            : "white",
                                      }}
                                      id="card-box"
                                    >
                                      <p
                                        id="text-incard-box"
                                        style={{
                                          color:
                                            selectedBoxType &&
                                            selectedBoxType.label ===
                                              attribute.label
                                              ? "white"
                                              : "#001D66",
                                        }}
                                      >
                                        {attribute.label}
                                      </p>
                                    </Card>
                                  </Col>
                                );
                              }
                              return null; // Skip attributes that don't have type "part"
                            })
                          ) : (
                            <p>No line attributes found for line {line}</p>
                          )}
                        </Row>
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
              <div className="button-div">
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: "#003EB3",
                      },
                    },
                  }}
                >
                  <Space wrap>
                    <Button
                      id="button-order"
                      size="large"
                      type="primary"
                      disabled={!(selectedModel || selectedBoxType)}
                      onClick={handleOrderClick}
                    >
                      Order
                    </Button>
                  </Space>
                </ConfigProvider>
              </div>
            </div>
            <div className="right-side">
              {!orderSubmitted && !changeToMapInterface && (
                <>
                  <div className="image-cover">
                    <div className="blob"></div>
                    <Image
                      src={mir_main}
                      layout="responsive"
                      height={500}
                      width={900}
                      quality={100}
                      alt="MiR Robot"
                      priority={true}
                      className="mir_main_image"
                    />
                  </div>
                  <div className="mir-ready">
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <div className="mir-please">
                      <Typography id="text-mir-ready">MiR Ready</Typography>
                      <Typography id="typo-sent-order">
                        Please sent order to MiR
                      </Typography>
                    </div>
                    <div style={{ marginBottom: "5.5rem" }}>
                      <Button type="primary" id="btn-qty-q">
                        5 Queues
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {changeToMapInterface && (
                <>
                  <div className="right-top">
                    <div className="mission-head">
                      <div className="mission-title">
                        <Typography id="mission-header">
                          Mission ID : <b>Empty Roller 3d Box</b>
                        </Typography>
                      </div>
                      <div className="cancel-button">
                        <Button type="primary" id="btn-cancel-order">
                          Cancel Order
                        </Button>
                      </div>
                    </div>
                    <div className="navigation-map">
                      <Image
                        src={map}
                        alt="map"
                        layout="responsive"
                        quality={100}
                        height={400}
                        width={900}
                      />
                    </div>
                  </div>
                  <div className="right-bottom">
                    <div className="order-status-text">Order Status :</div>
                    <div className="status-card">
                      <div className="mir-move">
                        <div className="mir-car">
                          <Image
                            src={mir_side}
                            layout="responsive"
                            alt="mir_side"
                            quality={100}
                            style={{ objectFit: "cover" }}
                            width={260}
                            height={200}
                          />
                        </div>
                      </div>
                      <div className="mir-status">
                        <div className="estimate">
                          <div className="estimate-left">
                            <div className="icon-block">
                              <AiFillClockCircle id="icons" />
                            </div>
                          </div>
                          <div className="estimate-right">
                            <Typography id="typo-estimation-time">
                              Estimating Time
                            </Typography>
                            <div className="est-time-min">
                              <Typography id="typo-time-est">
                                05:12<span id="typo-min">min</span>
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div className="queue-remain">
                          <div className="queue-left">
                            <div className="icon-block">
                              <Typography id="qty-q">3</Typography>
                            </div>
                          </div>
                          <div className="queue-right">
                            <Typography id="typo-queue-remain">
                              Queue Remain
                            </Typography>
                          </div>
                        </div>
                        <div className="mir-status-text">
                          <div className="mir-left">
                            <div className="icon-block">
                              <AiFillRobot id="icons" />
                            </div>
                          </div>
                          <div className="mir-right">
                            <Typography id="typo-mir-status">
                              MiR Status
                            </Typography>
                            <Typography id="typo-status-bottom">
                              Moving to Slip Ring 3rd
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {orderSubmitted && (
          <>
            <div
              style={{
                height: "100dvh",
                width: "100dvw",
                // border: "1px solid red",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="top-loading"
                style={{
                  height: "35%",
                  width: "100%",
                  // border: "1px solid blue",
                }}
              >
                {/* <Button onClick={mapChange}>as</Button> */}
                <div style={{ padding: "1rem", paddingTop: "3rem" }}>
                  <Typography
                    style={{
                      fontWeight: "700",
                      fontSize: "2.5rem",
                      lineHeight: "1",
                      textAlign: "center",
                      fontFamily: "Inter",
                    }}
                  >
                    You are Ordering from Rotor Rectifier
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: "700",
                      fontSize: "2.5rem",
                      color: "#0958d9",
                      textAlign: "center",
                      fontFamily: "Inter",
                    }}
                  >
                    to Point A!
                  </Typography>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Steps
                    style={{ width: "70%", fontFamily: "Inter" }}
                    current={currentStep}
                    items={stepsData}
                  />
                </div>
              </div>
              <div
                className="bottom-loading"
                style={{
                  height: "65%",
                  maxWidth: "100%",
                  // border: "1px solid green",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                <Image src={mir_loading} quality={100} alt="mir" width={900} />
                <div
                  style={{ position: "absolute", top: "6rem", right: "5rem " }}
                >
                  <Typography
                    style={{
                      fontSize: "2rem",
                      fontWeight: "400",
                      lineHeight: "1",
                      fontFamily: "Inter",
                      textAlign: "right",
                      color: "#262626",
                    }}
                  >
                    Denmaru is Planning
                  </Typography>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "700",
                      lineHeight: "1.2",
                      fontFamily: "Inter",
                      color: "#8c8c8c",
                    }}
                    className="waviy"
                  >
                    <span>T</span>
                    <span>h</span>
                    <span>e</span>
                    <span>&nbsp;F</span>
                    <span>a</span>
                    <span>s</span>
                    <span>t</span>
                    <span>e</span>
                    <span>s</span>
                    <span>t</span>
                    <span>&nbsp;r</span>
                    <span>o</span>
                    <span>u</span>
                    <span>t</span>
                    <span>e</span>
                  </div>
                  <Typography
                    style={{
                      textAlign: "right",
                      fontFamily: "Inter",
                      color: "#262626",
                      fontSize: "1rem",
                    }}
                  >
                    This could take a few seconds.
                  </Typography>
                  <span className="loader"></span>
                </div>
              </div>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default OrderPage;
