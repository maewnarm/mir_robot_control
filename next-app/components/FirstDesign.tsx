"use client";
import React from "react";
import { useRouter } from 'next/router'


import {
  Divider,
  Button,
  Space,
  Watermark,
  Card,
  Row,
  Col,
  Form,
  Spin
} from "antd";
import { useState } from "react";


interface LineData {
  line_id: number;
  part_model: string | null;
  empty_box_type: string | null;
}

const data =[
  {
    line_id: 4,
    attribute: [
      {
        type: "part",
        image: "http://localhost:8000/api/get_file/random_file_name_1.jpg",
        label: "125A",
        item: "TG000000-125A"
      },
      {
        type: "part",
        image: "http://localhost:8000/api/get_file/random_file_name_2.jpg",
        label: "159A",
        item: "TG000000-159A"
      },
      {
        type: "part",
        image: "http://localhost:8000/api/get_file/random_file_name_1.jpg",
        label: "4420",
        item: "TG000000-4420"
      },
      {
        type: "part",
        image: "http://localhost:8000/api/get_file/random_file_name_2.jpg",
        label: "1330",
        item: "TG000000-1330"
      },
      {
        type: "part",
        image: "http://localhost:8000/api/get_file/random_file_name_3.jpg",
        label: "122X",
        item: "TG000000-112X"
      },
      {
        type: "box",
        image: "http://localhost:8000/api/get_file/random_file_name_4.jpg",
        label: "30 pcs.",
        item :"Grey box 30 pcs."
      },
      {
        type: "box",
        image: "http://localhost:8000/api/get_file/random_file_name_4.jpg",
        label: "10 pcs.",
        item: "Grey box 10 pcs."
      },
      {
        type: "box",
        image: "http://localhost:8000/api/get_file/random_file_name_5.jpg",
        label: "5 pcs.",
        item: "Green box 5 pcs."
      },
      {
        type: "box",
        image: "http://localhost:8000/api/get_file/random_file_name_5.jpg",
        label: "2 pcs.",
        item: "Green box 2 pcs."
      }
    ]
  }
]



const dataSubmitted = [
  {
    line_id: 1,
    task_queue: "2 queues",
    status: "Moving to Slip ring 3rd",
    estimate_time_arrival:"3 minutes...",
    duration: "2023-08-10 15:36:20.523476+07"
  }
]

const dataSource = [
  {
    line_id: 1,
    part_model: ["1120", "1240", "3540"],
    empty_box_type: ["10 pcs.", "5 pcs."],
    
  },
  {
    line_id: 2,
    part_model: ["1120", "1240", "3540"],
    empty_box_type: ["10 pcs.", "5 pcs."],
  },
  {
    line_id: 3,
    part_model: ["1120", "1160", "1570"],
    empty_box_type: ["2 pcs.", "5 pcs."],
  },
  {
    line_id: 4,
    part_model: ["125A", "159A", "4420"],
    empty_box_type: ["2 pcs.", "5 pcs.", "10 pcs.", "30 pcs."],
  },
];
const line1Data = dataSource.find((item) => item.line_id === 1);

const FirstDesign: React.FC = () => {
  const [form] = Form.useForm<LineData>();
  const { empty_box_type } = line1Data || { empty_box_type: [] };
  const [selectedModel, setSelectedModel] = useState<{ line_id: number, model: string } | null>(null);
  const [selectedBoxType, setSelectedBoxType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskQueue, setTaskQueue] = useState('');
  const [status, setStatus] = useState('');
  const [estimateTime, setEstimateTime] = useState('');

  const handleCardClick = (line_id: number, model: string) => {
    if (selectedModel && selectedModel.line_id === line_id && selectedModel.model === model) {
      // If the clicked card is already selected, deselect it
      setSelectedModel(null);
    } else {
      // Otherwise, select the clicked card
      setSelectedModel({ line_id, model });
    }
  };

  const handleBoxTypeClick = (boxType: string) => {
    setSelectedBoxType(boxType);
  };

  const handleOrderClick = () => {
    if (selectedModel && selectedBoxType) {
      form.setFieldsValue({
        line_id: selectedModel.line_id,
        part_model: selectedModel.model,
        empty_box_type: selectedBoxType,
      });
  
      setLoading(true); // Show loading state
  
      setTimeout(() => {
        // Simulating API request delay
        const submittedData = dataSubmitted.find(item => item.line_id === selectedModel.line_id);
  
        if (submittedData) {
          setTaskQueue(submittedData.task_queue);
          setStatus(submittedData.status);
          setEstimateTime(submittedData.estimate_time_arrival);
          setLoading(false); // Hide loading state
          form.submit(); // Submit the form after fetching the data
        }
      }, 2000); // Set delay time in milliseconds
    }
  };

  
  if (!line1Data) {
    return null; // Handle case when line_id 1 is not found in the JSON data
  }

  return (
    <div style={{ /*border: "solid 5px blue",*/ display: "flex" }} className="box1">
      <Form
        form={form}
        onFinish={(v) => {
          console.log(v);
        }}
      >
        <div
          /*Left side */ style={{
            // border: "solid 1px red",
            display: "flex",
            flexDirection: "column",
            width: "50vw",
          }}
        >
          <div
            /*Supply Model Div */ style={{
              height: "45vh",
              // border: "1px solid orange",
            }}
            className="part-model-section"
          >
            <div
              style={{ padding: "1rem", marginTop: "20px", marginLeft: "30px" }}
            >
              <h1>Supply Model</h1>
              <p>Please select your supply model that you want.</p>
            </div>
            <div /*Box Components */ style={{ paddingBottom:"2rem",paddingLeft:"5rem",display:"felx",justifyContent:"center"}}>
              <Form.Item name="line_id"className="formid" style={{height:0}}/>
              <Form.Item name="part_model">
              <Row gutter={[16, 16]}>
                  {line1Data?.part_model.map((model) => (
                    <Col key={model} xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Card
                        hoverable
                        className={`card ${selectedModel && selectedModel.line_id === 1 && selectedModel.model === model ? "selected" : ""}`}
                        onClick={() => handleCardClick(1, model)}
                        style={{borderRadius:"7px",height:"150px"}}
                      >
                        {model}
                      </Card>
                    </Col>
                  ))}
                  {line1Data?.line_id && (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                      <Card
                        hoverable
                        className={`card ${selectedModel && selectedModel.line_id === 1 && selectedModel.model === 'Other' ? "selected" : ""}`}
                        onClick={() => handleCardClick(1, 'Other')}
                        style={{borderRadius:"7px"}}
                      >
                        Other
                      </Card>
                    </Col>
                  )}
                </Row>
              </Form.Item>
            </div>
          </div>
          <div
            /*Empty Box Type Div */ style={{
              height: "40vh",
              // border: "1px solid green",
            }}
            className="empty-box-type-section"
          >
            <div style={{ padding: "1rem", marginLeft: "30px" }}>
              <h1>Empty Box Type</h1>
              <p>Please select your empty box type that you want.</p>
            </div>
            <div /*Box Components */ style={{ padding: "2rem",paddingLeft:"5rem"}} >
              <Form.Item name="empty_box_type">
                <Row gutter={[16, 16]}>
                  {empty_box_type.map((boxType) => (
                    <Col key={boxType} xs={24} sm={12} md={8} lg={6} xl={6}>
                      <Card
                        hoverable
                        className={`card ${
                          selectedBoxType === boxType ? "selected" : ""
                        }`}
                        onClick={() => handleBoxTypeClick(boxType)}
                        style={{borderRadius:"7px",height:"150px"}}
                      >
                        {boxType}
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </div>
          </div>
          <div
            /*button */ style={{
              // border: "1px solid red",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "3rem",
            }}
          >
            <Space wrap>
              <Button
                size="large"
                type="primary"
                disabled={!selectedModel || !selectedBoxType}
                onClick={handleOrderClick}
                style={{width:"150px",height:"80px"}}
              >
                Order
              </Button>
            </Space>
          </div>
        </div>
      </Form>
      <Divider type="vertical" style={{height:"100%",borderWidth:3}} />
      <div
        /*Right side */ style={{
          // border: "solid 1px green",
          width: "50vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          /*Status - TaskQ,Status,Estimate */ style={{
            // border: "1px solid red",
            height: "20vh",
            padding:"2rem",
            marginLeft:"20px"
          }}
        >
          <p style={{fontSize:"25px"}}>Task Queue :<strong>{loading ? <Spin /> : taskQueue}</strong></p>
          <p style={{fontSize:"25px"}}>Status :<strong>{loading ? <Spin /> : status}</strong></p>
          <p style={{fontSize:"25px"}}>Estimate Time Arrive : <strong>{loading ? <Spin /> : estimateTime}</strong></p>
        </div>
        <div
          /*Path */ style={{
            /*border: "1px solid cyan",*/ height: "63vh",
            position: "relative",
          }}
        >
          <div
            style={{
              top: "50px",
              right: "50px",
              left: "50px",
              bottom: "10px",
              border: "1px dashed #c0c7d1",
              position: "absolute",
            }}
          >
            <Watermark content={["PE-DX", "Tech Innovation"]} gap={[23, 23]}>
              <div style={{ height: 410 }} />
            </Watermark>
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <p>MiR API Path</p>
        </div>
      </div>
    </div>
  );
};

export default FirstDesign;
