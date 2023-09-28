import { saveAs } from "file-saver";
import Router from "next/router";
import { useEffect, useState } from "react";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { FactureEmployees, Nomina, ResponseData } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const TxtNomina = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [nomina, setNomina] = useState<Nomina>(null);
  const [items, setItems] = useState("");

  const createFile = () => {
    const blob = new Blob([items], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cash-nomina-pichincha.txt");
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const nominaId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/nomina/" + nominaId,
        "GET",
        auth.userName,
        auth.role
      );
      const nomina: Nomina = response.data;
      const factures: Map<String, FactureEmployees> = new Map();
      nomina.items.forEach((facture: FactureEmployees) => {
        if (Array.from(factures.keys()).includes(facture.beneficiary)) {
          const auxFact = factures.get(facture.beneficiary);
          auxFact.value += facture.value;
          factures.set(facture.beneficiary, auxFact);
        } else {
          factures.set(facture.beneficiary, facture);
        }
      });
      setNomina({
        ...nomina,
        items: Array.from(factures.values()),
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
      <title>IC | Cash Pichincha</title>

      <LoadingContainer visible={loading}>
        {nomina === null ? (
          <div>Error al cargar los datos</div>
        ) : (
          <div className="bg-white md:w-2/3 w-11/12 mx-auto p-5">
            <h3 className="text-center my-4 mb-4 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
              Cash Pichincha
            </h3>
            <div className="mx-5">
              <table className="mb-5 border border-black">
                <thead>
                  {(nomina.items ?? []).map((item, index) => {
                    const valueDecimal = item.value;
                    let value: string | number;
                    if (Number.isInteger(parseFloat(valueDecimal))) {
                      value = valueDecimal;
                    } else {
                      value = parseFloat(valueDecimal).toFixed(2);
                    }
                    return (
                      <tr key={index}>
                        <td>PA</td>
                        <td>{item.typeProv}</td>
                        <td>USD</td>
                        <td>
                          {(value ?? "").toLocaleString().replace(/[$.,]/g, "")}
                        </td>
                        <td>CTA</td>
                        <td>{item.accountType}</td>
                        <td>{item.accountBank}</td>
                        <td>PAGO</td>
                        <td>{item.typeCard ?? ""}</td>
                        <td>{item.identificationCard ?? ""}</td>
                        <td>{item.beneficiary ?? ""}</td>
                        <td>{item.codBank ?? ""}</td>
                      </tr>
                    );
                  })}
                </thead>
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
      </LoadingContainer>
    </>
  );
};
export default TxtNomina;
