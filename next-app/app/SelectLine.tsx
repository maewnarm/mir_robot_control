"use client";
import axiosInstance from "@/lib/axios";
import { Button, Select } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineWifi } from "react-icons/ai";

interface Organizes {
  line_id: number;
  line_name_with_work_center_code: string;
}

const SelectLine: React.FC = () => {
  const router = useRouter();
  const [options, setOptions] = useState<Organizes[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get<Organizes[]>(`/mir/organizes`);
  //       setOptions(response.data);
  //     } catch (error) {
  //       console.error('Error retrieving lines:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const onChange = (value: number | null) => {
    setSelectedLineId(value);
  };

  const handleButtonClick = () => {
    if (selectedLineId) {
      // console.log(selectedLineId);
      router.push(`/order/${selectedLineId}`);
      // Make use of the selectedLineId here or pass it to another component as needed
    }
  };

  const navigateSetup = () => {
    if (selectedLineId) {
      router.push(`/setup/${selectedLineId}`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>MiR Ordering Service</h1>
      <p style={{ padding: "10px", textAlign: "center" }}>
        Please select your line name that corresponds to the job you are
        responsible for .
      </p>
      <Select
        placeholder="Select line"
        optionFilterProp="children"
        onChange={onChange}
        options={[
          {
            value: "1",
            label: "Rotor Line",
          },
          {
            value: "2",
            label: "Rectifier Line",
          },
          {
            value: "3",
            label: "Alternator Assy Line",
          },
        ]}
        style={{ width: "500px" }}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          onClick={handleButtonClick}
          style={{
            height: "4rem",
            marginTop: "1rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          GO TO ORDER
        </Button>
        <Button
          onClick={navigateSetup}
          style={{
            height: "4rem",
            marginTop: "1rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          Go to Setup page
        </Button>
      </div>
    </div>
  );
};

export default SelectLine;
