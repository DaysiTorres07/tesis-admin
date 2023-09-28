import { NextApiRequest, NextApiResponse } from "next";
import { HolidaysModel } from "../../../lib/mongo/schemas";
import { Aprobado } from "../../../lib/utils/constants";
import dbConnect2 from "../../../lib/middlewares/mongo";
import { Holidays } from "../../../lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect2();

  // @ts-ignore
  const solicitudes = await HolidaysModel.find({ state: Aprobado });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    const filtered = [];

    solicitudes.forEach((soli: Holidays) => {
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
      data: filtered as Array<Holidays>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todas las solicitudes",
      data: solicitudes as Array<Holidays>,
      success: true,
    });
  }
}
