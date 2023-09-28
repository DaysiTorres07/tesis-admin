import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import read from "../../../lib/mongo/solicitudeRecaudaciones/read";
import remove from "../../../lib/mongo/solicitudeRecaudaciones/delete";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    switch (req.method) {
      case "GET":
        return await read(req, res);
      case "DELETE":
        return await remove(req, res);
      default:
        throw new Error("Invalid method");
    }
  } catch {}
}

export const config = {
  api: {
    responseLimit: false,
  },
};
