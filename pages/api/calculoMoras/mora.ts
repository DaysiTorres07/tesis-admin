import { NextApiRequest, NextApiResponse } from "next";
import { dataBase } from "../../../lib/config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return await getClient(req, res);
      case "GET":
        throw new Error("Metodo invalido");
    }
  } catch (error) {
    error;
    return res.status(500).json({
      message: new Error(error).message,
      success: false,
    });
  }
}

const getClient = async (req: NextApiRequest, res: NextApiResponse) => {
  const fecha = new Date();
  const formattedFecha = fecha.toISOString();
  dataBase.query(
    "SELECT facven.ven_nombre, SUBSTRING_INDEX(cxcmov.mov_compr1, ' ', 2) AS mov_compr1, invcli.cli_observ, invcli.cli_feccon, invcli.cli_mail2, invcli.cli_mail, invcli.cli_codven, invcli.cli_limcre, invcli.cli_tipcli, invcli.cli_telef1, invcli.cli_telef2, invcli.cli_atenci, invcli.cli_fecing, cxcmov.mov_codcli, cxcmov.mov_compr1, cxcmov.mov_compr2,  cxcmov.mov_fecemi,  cxcmov.mov_fecven,  cxcmov.mov_detmo1,  cxcmov.mov_detmo2,  SUM(cxcmov.mov_valdeb) AS total_valdeb,  SUM(cxcmov.mov_valcre) AS total_valcre, (SUM(cxcmov.mov_valdeb) - SUM(cxcmov.mov_valcre)) AS totalDebe,  cxcmov.mov_numsec,  cxcmov.mov_capita,  cxcmov.mov_intere,  cxcmov.mov_fecpag,  invcli.cli_codcli,  invcli.cli_nombre,  invcli.cli_promoc,  invcli.cli_feccon,  invcli.cli_status FROM invcli JOIN facven ON invcli.cli_codven = facven.ven_codven LEFT JOIN cxcmov ON cxcmov.mov_codcli = invcli.cli_codcli WHERE invcli.cli_codven = facven.ven_codven AND invcli.cli_status = 'A' AND invcli.cli_codcli <> 'CLIVAR' AND cxcmov.mov_fecven <= ? AND cxcmov.mov_compr1 NOT LIKE 'FC%' GROUP BY cxcmov.mov_codcli, cxcmov.mov_compr1, cxcmov.mov_numsec HAVING total_valdeb <> total_valcre AND totalDebe > 0 ORDER BY invcli.cli_promoc",
    [formattedFecha],
    function (err, rows, fields) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error al ejecutar la consulta",
          success: false,
        });
      }

      return res.status(200).json({
        message: "Clientes",
        data: rows,
        success: true,
      });
    }
  );
};

export const config = {
  api: {
    externalResolver: true,
  },
};