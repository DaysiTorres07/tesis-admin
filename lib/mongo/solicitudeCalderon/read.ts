import { NextApiRequest, NextApiResponse } from "next";
import { SolicitudeCalderon } from "../../types";
import { SolicitudeCalderonModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const id = req.query.id as string;

    // fetch the posts
    const solicitudeCalderon = await SolicitudeCalderonModel.findById(id)

    return res.status(200).json({
      message: "una solicitud",
      data: solicitudeCalderon as SolicitudeCalderon,
      success: true,
    });
  }