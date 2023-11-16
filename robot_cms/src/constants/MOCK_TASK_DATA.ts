interface DataType {
  key: React.Key;
  id: number;
  taskName: string;
  operatorId?: number;
  status: "finished" | "waiting" | "doing" | "queuing"; 
}

const mockProducts: DataType[] = [
  {
    id: 1,
    taskName: "Product 1",
    key: 0,
    status: "finished",
    operatorId: 1
  },
  {
    id: 2,
    taskName: "Product 2",
    key: 1,
    status: "waiting",
    operatorId: 1
  },
  {
    id: 3,
    taskName: "Product 3",
    key: 2,
    status: "queuing",
  },
  {
    id: 4,
    taskName: "Product 4",
    key: 3,
    status: "queuing",
  },
  {
    id: 5,
    taskName: "Product 5",
    key: 4,
    status: "queuing",
  },
  {
    id: 6,
    taskName: "Product 6",
    key: 5,
    status: "queuing",
  },
  {
    id: 7,
    taskName: "Product 7",
    key: 6,
    status: "queuing",
  },
  {
    id: 8,
    taskName: "Product 8",
    key: 7,
    status: "queuing",
  },
  {
    id: 9,
    taskName: "Product 9",
    key: 8,
    status: "queuing",
  },
  {
    id: 10,
    taskName: "Product 10",
    key: 9,
    status: "doing",
    operatorId: 1
  }
]

export default mockProducts
