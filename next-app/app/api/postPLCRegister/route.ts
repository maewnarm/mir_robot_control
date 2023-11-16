import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  console.log("in postPLC");
  const body = await req.json();
  const path_url = body.path_url;
  const data = body.data;
  console.log("data", data);
  const response = await axios.put(path_url, data, {
    headers: {
      Authorization:
        "Basic RGlzdHJpYnV0b3I6NjJmMmYwZjFlZmYxMGQzMTUyYzk1ZjZmMDU5NjU3NmU0ODJiYjhlNDQ4MDY0MzNmNGNmOTI5NzkyODM0YjAxNA==",
      Accept: "application/json",
      "User-Agent": "axios 0.27.2",
    },
  });
  return NextResponse.json(response.data);
}
