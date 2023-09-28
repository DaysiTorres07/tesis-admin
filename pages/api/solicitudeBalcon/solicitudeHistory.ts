import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import { SolicitudeBalconModel } from "../../../lib/mongo/schemas";
import { SolicitudeBalcon } from "../../../lib/types";
import { Aprobado } from "../../../lib/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const solicitudesBalcon = await SolicitudeBalconModel.find({
    imageTreasuryState: Aprobado,
  });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    // console.log('si', [date1, date2])

    const filtered = [];

    solicitudesBalcon.forEach((soli: SolicitudeBalcon) => {
      const soliDates = soli.date.replace(",", "").split(" ")[0].split("/");
      const soliDate = new Date(
        soliDates[2] +
          "-" +
          (soliDates[1].length < 2 ? "0" + soliDates[1] : soliDates[1]) +
          "-" +
          (soliDates[1].length < 2 ? "0" + soliDates[0] : soliDates[0])
      );
      if (
        date1.getTime() <= soliDate.getTime() &&
        soliDate.getTime() < date2.getTime()
      ) {
        filtered.push(soli);
      }
    });

    return res.status(200).json({
      message: "todas las solicitudes",
      data: filtered as Array<SolicitudeBalcon>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todas las solicitudes",
      data: solicitudesBalcon as Array<SolicitudeBalcon>,
      success: true,
    });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
