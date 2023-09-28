import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import listOfOne from "../../../lib/mongo/loan/listOfOne";
import read from "../../../lib/mongo/loan/read";
import remove from "../../../lib/mongo/loan/delete";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    switch (req.method) {
      case "GET":
        return await read(req, res);
      case "POST":
        return await listOfOne(req, res);
      case "DELETE":
        return await remove(req, res);
      default:
        throw new Error("Invalid method");
    }
  } catch (error) {
    (error);
    //retun the error
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}
