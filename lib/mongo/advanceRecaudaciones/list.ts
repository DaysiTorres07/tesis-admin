import { NextApiRequest, NextApiResponse } from "next";
import { AdvanceRecaudaciones } from "../../types";
import { Cerrado } from "../../utils/constants";
import { AdvanceRecaudacionesModel } from "../schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // fetch the posts
  const advancesRecaudaciones = await AdvanceRecaudacionesModel.find({
    contableAdvanceState: { $ne: Cerrado },
  });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    const filtered = [];

    advancesRecaudaciones.forEach((soli: AdvanceRecaudaciones) => {
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
      data: filtered as Array<AdvanceRecaudaciones>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "todas los anticipos",
      data: advancesRecaudaciones as Array<AdvanceRecaudaciones>,
      success: true,
    });
  }
}
