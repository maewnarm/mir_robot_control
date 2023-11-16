import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

type ResponseData = {
  data: any;
};

export async function GET() {
  const { data } = await axios.get(
    "http://192.168.10.120/api/v2.0.0/missions",
    {
      headers: {
        Authorization: `Basic RGlzdHJpYnV0b3I6NjJmMmYwZjFlZmYxMGQzMTUyYzk1ZjZmMDU5NjU3NmU0ODJiYjhlNDQ4MDY0MzNmNGNmOTI5NzkyODM0YjAxNA==`,
        Accept: "application/json",
        "User-Agent": "axios 0.27.2",
      },
    }
  );

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("postmiss", body);
  const { data } = await axios.post(
    "http://192.168.10.120/api/v2.0.0/mission_queue",
    {
      mission_id: body["id"],
    },
    {
      headers: {
        Authorization:
          "Basic RGlzdHJpYnV0b3I6NjJmMmYwZjFlZmYxMGQzMTUyYzk1ZjZmMDU5NjU3NmU0ODJiYjhlNDQ4MDY0MzNmNGNmOTI5NzkyODM0YjAxNA==",
        Accept: "application/json",
        "User-Agent": "axios 0.27.2",
      },
    }
  );

  return NextResponse.json(data);
}
