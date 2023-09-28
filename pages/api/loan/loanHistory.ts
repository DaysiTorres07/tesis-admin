import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/middlewares/mongo";
import { LoanModel } from "../../../lib/mongo/schemas";
import { Loan } from "../../../lib/types";
import { Aprobado } from "../../../lib/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // @ts-ignore
  const loans = await LoanModel.find({ state: Aprobado });

  if (req.query.dates !== undefined) {
    const dates: Array<string> = (req.query.dates as string).split("¡");
    const date1 = new Date(dates[0]);
    const date2 = new Date(dates[1]);
    date2.setDate(date2.getDate() + 1);

    const filtered = [];

    loans.forEach((loa: Loan) => {
      const loaDates = loa.date.replace(",", "").split(" ")[0].split("/");
      const loaDate = new Date(
        loaDates[2] +
          "-" +
          (loaDates[1].length < 2 ? "0" + loaDates[1] : loaDates[1]) +
          "-" +
          (loaDates[1].length < 2 ? "0" + loaDates[0] : loaDates[0])
      );
      if (
        date1.getTime() <= loaDate.getTime() &&
        loaDate.getTime() < date2.getTime()
      ) {
        filtered.push(loa);
      }
    });
    return res.status(200).json({
      message: "Todos los prestamos",
      data: filtered as Array<Loan>,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "Todos los prestamos",
      data: loans as Array<Loan>,
      success: true,
    });
  }
}
