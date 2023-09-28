import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import { PermissionModel } from "../../../lib/mongo/schemas";
import { Permission } from "../../../lib/types";
import { Rechazado } from "../../../lib/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // @ts-ignore
  const permissions = await PermissionModel.find({ state: Rechazado });

  return res.status(200).json({
    message: "Todos los permisos Rechazados",
    data: permissions as Array<Permission>,
    success: true,
  });
}
