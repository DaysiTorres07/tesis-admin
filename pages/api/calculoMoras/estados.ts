import { dataBase } from "../../../lib/config/db";

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return await getClient(req, res);
      default:
        throw new Error("Método inválido");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

const getClient = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 2000;

  const offset = (page - 1) * pageSize;

  const countQuery = `SELECT COUNT(*) AS total FROM invcli WHERE invcli.cli_status = 'A' AND invcli.cli_codcli <> 'CLIVAR'`;
  const dataQuery = `SELECT cxcmov.mov_valdeb, cxcmov.mov_valcre, cxcmov.mov_codcli, cxcmov.mov_compr1, CASE WHEN cxcmov.mov_compr2 LIKE 'ND%' THEN '' ELSE cxcmov.mov_compr2 END AS mov_compr2, cxcmov.mov_fecemi, cxcmov.mov_fecven, cxcmov.mov_detmo1, cxcmov.mov_detmo2, cxcmov.mov_numsec, cxcmov.mov_fecpag, invcli.cli_codcli, invcli.cli_nombre, invcli.cli_numruc, invcli.cli_promoc, invcli.cli_feccon, invcli.cli_status, invcli.cli_atenci, invcli.cli_direc1, invcli.cli_telef1, invcli.cli_telef2, invcli.cli_limcre FROM invcli INNER JOIN cxcmov ON cxcmov.mov_codcli = invcli.cli_codcli WHERE invcli.cli_status = 'A' AND invcli.cli_codcli <> 'CLIVAR' AND (cxcmov.mov_compr2 NOT LIKE 'AD%' OR cxcmov.mov_compr2 IS NULL) ORDER BY invcli.cli_promoc, cxcmov.mov_numsec LIMIT ${pageSize} OFFSET ${offset}`;
  const totalQuery = `SELECT COUNT(*) AS total FROM (${dataQuery}) AS subquery`;

  const countResult = await executeQuery(countQuery);
  const total = countResult[0].total;

  const dataResult = await executeQuery(dataQuery);

  return res.status(200).json({
    message: "Clientes",
    data: dataResult,
    success: true,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
};

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    dataBase.query(query, function (err, rows, fields) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(rows);
    });
  });
}
