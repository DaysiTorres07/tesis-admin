import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import create from "../../../lib/mongo/loan/create";
import list from "../../../lib/mongo/loan/list";
import update from "../../../lib/mongo/loan/update";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    switch (req.method) {
      case "GET":
        return await list(req, res);
      case "POST":
        return await create(req, res);
      case "PUT":
        return await update(req, res);
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    (error);

    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}