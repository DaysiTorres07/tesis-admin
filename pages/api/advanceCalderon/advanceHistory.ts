import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import { AdvanceCalderonModel } from "../../../lib/mongo/schemas";
import { AdvanceCalderon } from "../../../lib/types";
import { Cerrado } from "../../../lib/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const advancesCalderon = await AdvanceCalderonModel.find({
    contableAdvanceState: Cerrado,
  });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    // console.log('si', [date1, date2])

    const filtered = [];

    advancesCalderon.forEach((soli: AdvanceCalderon) => {
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
      data: filtered as Array<AdvanceCalderon>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todos los anticipos",
      data: advancesCalderon as Array<AdvanceCalderon>,
      success: true,
    });
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
}