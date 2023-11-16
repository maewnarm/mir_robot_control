import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '@/lib/axios';
import { Card } from 'antd';

interface Attribute {
  item: string;
  type: string;
  image: string;
  label: string;
}

const LineAttributesPage: React.FC = () => {
  const router = useRouter();
  const [lineAttributes, setLineAttributes] = useState<Attribute[]>([]);
  const { query } = router;

  useEffect(() => {
    const fetchLineAttributes = async () => {
      const lineId = query.lineId as string; // Get the lineId from the query parameter
      if (lineId) {
        try {
          const response = await axiosInstance.get<Attribute[]>(`/mir/line_attribute/${lineId}`); // Replace with your API endpoint
          setLineAttributes(response.data);
        } catch (error) {
          console.error('Error retrieving line attributes:', error);
        }
      }
    };

    fetchLineAttributes();
  }, [query]);

  return (
    <div>
      {lineAttributes.map((attribute) => (
        attribute.type === 'part' && (
          <Card key={attribute.label} title={`Card${attribute.label}`}>
            <p>{attribute.label}</p>
            <p>{attribute.item}</p>
          </Card>
        )
      ))}
    </div>
  );
};

export default LineAttributesPage;
