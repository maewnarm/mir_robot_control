'use client'
import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

// const { Option } = Select;

// interface Attribute {
//   item: string;
//   type: string;
//   image: string;
//   label: string;
// }

interface Line {
  line_id: number;
  line_name_with_work_center_code: string;
}

const Attributes: React.FC = () => {
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>([]);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<Line[]>(`/mir/organizes`); // Replace with your API endpoint
        setLines(response.data);
      } catch (error) {
        console.error('Error retrieving lines:', error);
      }
    };
    fetchData();
  }, []);

  const handleLineChange = (value: number | null) => {
    setSelectedLineId(value);
  };
  const onSearch = (value: any) => {
    console.log('search:', value);
  };

  const handleButtonClick = () => {
    if (selectedLineId) {
      console.log(selectedLineId);
      router.push(`/order/${selectedLineId}`)
      // Make use of the selectedLineId here or pass it to another component as needed
    }
  };
  

  return (
    <div>
      <Select
        showSearch
        placeholder="Select Line"
        onSearch={onSearch}
        onChange={handleLineChange}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={lines.map((line) => ({
          value: line.line_id,
          label: line.line_name_with_work_center_code,
        }))}
        style={{width:"500px"}}
      />
      <Button onClick={handleButtonClick}>Get Line Attributes</Button>
    </div>
  );
};

export default Attributes;
