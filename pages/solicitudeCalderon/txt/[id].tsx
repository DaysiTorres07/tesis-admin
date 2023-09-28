import { saveAs } from "file-saver";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  FactureCalderon,
  ResponseData,
  SolicitudeCalderon,
} from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const SoliTxtPichinchaC = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [solicitudeC, setSolicitudeC] = useState<SolicitudeCalderon>(null);
  const [items, setItems] = useState("");

  const createFile = () => {
    // const html: string = document.getElementById("box").innerText;
    // const newText: string = convert(html,  { wordwrap: false });
    // const lines: Array<string> = newText.replaceAll(' PA ', ',PA ').split(',');
    // let txt = '';
    // lines.forEach((line: string, index: number) => {
    //   const aux: Array<string> = line.split(' ');
    //   for(let i = 0; i < 9; i++) {
    //     txt += aux[i] + '\t';
    //   }
    //   for(let j = 9; j < (aux.length - 1); j++) {
    //     txt += aux[j];
    //     if(j < (aux.length - 2)) {
    //       txt += ' ';
    //     }
    //   }
    //   txt += '\t' + aux[aux.length - 1];
    //   if(index !== (lines.length - 1)) {
    //     txt += '\n';
    //   }
    // });
    const blob = new Blob([items], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cash-pichincha-calderon.txt");
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const solicitudeId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/solicitudeCalderon/" + solicitudeId,
        "GET",
        auth.userName,
        auth.role
      );
      const solicitudeC: SolicitudeCalderon = response.data;
      const facturesC: Map<String, FactureCalderon> = new Map();
      solicitudeC.items.forEach((factureC: FactureCalderon) => {
        if (Array.from(facturesC.keys()).includes(factureC.beneficiary)) {
          const auxFact = facturesC.get(factureC.beneficiary);
          auxFact.valueNet += factureC.valueNet;
          facturesC.set(factureC.beneficiary, auxFact);
        } else {
          facturesC.set(factureC.beneficiary, factureC);
        }
      });
      setSolicitudeC({
        ...solicitudeC,
        items: Array.from(facturesC.values()),
      });
      setLoading(false);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <title>Calderon | Cash Pichincha</title>
      {solicitudeC === null ? (
        <div>Error al cargar los datos</div>
      ) : (
        <div className="bg-white md:w-2/3 w-11/12 mx-auto p-5">
          <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
            Descargar Cash Pichincha para Calderon
          </h3>
          <div className="mx-5">
            <table className="mb-5 border border-black">
              {(solicitudeC.items ?? []).map((item, index) => {
                let value: string | number;
                if (Number.isInteger(item.valueNet)) {
                  value = item.valueNet + ".00";
                } else {
                  value = item.valueNet.toFixed(2);
                }
                return (
                  <tr key={index}>
                    <td>PA</td>
                    <td>{item.typeProv}</td>
                    <td>USD</td>
                    <td>{value.toLocaleString().replace(/[$.,]/g, "")}</td>
                    <td>CTA</td>
                    <td>{item.accountType}</td>
                    <td>{item.accountBank}</td>
                    <td>PAGO</td>
                    <td>{item.typeCard}</td>
                    <td>{item.identificationCard}</td>
                    <td>{item.beneficiary}</td>
                    <td>{item.codBank}</td>
                  </tr>
                );
              })}
            </table>
            <textarea
              className="border border-black bg-gray-200 md:w-2/4"
              value={items}
              onChange={(e) => setItems(e.target.value)}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4 mx-5 mt-4">
            <div>
              <button
                className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                onClick={createFile}
              >
                Guardar Cash
              </button>
            </div>
            <div>
              <button
                className="text-center bg-transparent hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                onClick={() => Router.back()}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SoliTxtPichinchaC;
