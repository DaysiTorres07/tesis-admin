import { NextApiRequest, NextApiResponse } from "next";
import FormatedDate from "../../utils/formated_date";
import { AuditoryModel, NominaModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const userName = req.headers.username as string;
  const resp = await NominaModel.deleteOne({ _id: id });

  const auditory = new AuditoryModel({
    date: FormatedDate(),
    user: userName,
    action: "Elimino nomina",
  });
  await auditory.save();

  if (resp.deletedCount === 1)
    return res.status(200).json({
      message: "Eliminado!",
      success: true,
    });

  return res.status(500).json({
    message: "Error inesperado",
    success: false,
  });
}
