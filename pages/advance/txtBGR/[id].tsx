import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import { ResponseData, Advance, FactureAdvance } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import { saveAs } from "file-saver";
import { Button, Container, Row, Table } from "react-bootstrap";

const SoliTxtBGR = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advance, setAdvance] = useState<Advance>(null);
  const [items, setItems] = useState("");

  const createFile = () => {
    const blob = new Blob([items], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cash-bgr.txt");
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advance/" + advanceId,
        "GET",
        auth.userName,
        auth.role
      );
      const advance: Advance = response.data;
      const facturesAdv: Map<String, FactureAdvance> = new Map();
      advance.items.forEach((factureAdv: FactureAdvance) => {
        if (Array.from(facturesAdv.keys()).includes(factureAdv.beneficiary)) {
          const auxFact = facturesAdv.get(factureAdv.beneficiary);
          auxFact.valueNet += factureAdv.valueNet;
          facturesAdv.set(factureAdv.beneficiary, auxFact);
        } else {
          facturesAdv.set(factureAdv.beneficiary, factureAdv);
        }
      });
      setAdvance({
        ...advance,
        items: Array.from(facturesAdv.values()),
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
      <title>IC | Cash BGR de Anticipo</title>
      {advance === null ? (
        <div>Error al cargar los datos</div>
      ) : (
        <div className="bg-white md:w-2/3 w-11/12 mx-auto p-5">
          <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
            Descargar Cash BGR
          </h3>
          <div className="mx-5">
            <table className="mb-5 border border-black">
              {(advance.items ?? []).map((item, index) => {
                let value: string | number;
                if (Number.isInteger(item.valueNet)) {
                  value = item.valueNet + ".00";
                } else {
                  value = item.valueNet.toFixed(2);
                }
                let typebank: string;
                if (item.accountType === "CC") {
                  typebank = "CTE";
                } else {
                  typebank = "AHO";
                }
                return (
                  <tr key={index}>
                    <td>PA</td>
                    <td>{item.identificationCard ?? ""}</td>
                    <td>USD</td>
                    <td>{value.toLocaleString().replace(/[$.,]/g, "")}</td>
                    <td>CTA</td>
                    <td>{typebank ?? ""}</td>
                    <td>{item.accountBank ?? ""}</td>
                    <td>{(item.details ?? "").toLocaleUpperCase()}</td>
                    <td>{item.typeCard ?? ""}</td>
                    <td>{item.identificationCard ?? ""}</td>
                    <td>{(item.beneficiary ?? "").toLocaleUpperCase()}</td>
                    <td>{item.codBank ?? ""}</td>
                  </tr>
                );
              })}
            </table>

            <textarea
              className="border border-black bg-gray-200 md:w-4/5"
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

export default SoliTxtBGR;
