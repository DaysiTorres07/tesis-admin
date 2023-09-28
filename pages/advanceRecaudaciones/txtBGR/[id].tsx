import { saveAs } from "file-saver";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Button, Container, Row, Table } from "react-bootstrap";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  AdvanceRecaudaciones,
  FactureAdvanceRecaudaciones,
  ResponseData,
} from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const SoliTxtBGR = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [advanceR, setAdvanceR] = useState<AdvanceRecaudaciones>(null);
  const [items, setItems] = useState("");
  const createFile = () => {
    const blob = new Blob([items], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "cash-bgr-anticipo-recaudaciones.txt");
  };

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      setLoading(true);
      const advanceRecaudacionesId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/advanceRecaudaciones/" + advanceRecaudacionesId,
        "GET",
        auth.userName,
        auth.role
      );
      const advanceR: AdvanceRecaudaciones = response.data;
      const facturesAdvR: Map<String, FactureAdvanceRecaudaciones> = new Map();
      advanceR.items.forEach((factureAdvR: FactureAdvanceRecaudaciones) => {
        if (Array.from(facturesAdvR.keys()).includes(factureAdvR.beneficiary)) {
          const auxFact = facturesAdvR.get(factureAdvR.beneficiary);
          auxFact.valueNet += factureAdvR.valueNet;
          facturesAdvR.set(factureAdvR.beneficiary, auxFact);
        } else {
          facturesAdvR.set(factureAdvR.beneficiary, factureAdvR);
        }
      });
      setAdvanceR({
        ...advanceR,
        items: Array.from(facturesAdvR.values()),
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
      <title>Recaudaciones | Cash BGR de Anticipo</title>
      
      {advanceR === null ? (
        <div>Error al cargar los datos</div>
      ) : (
        <div>
          <h3 className="mt-2 text-center">Descargar Csh BGR Recaudaciones</h3>
          <Container>
            <Row>
              <Table responsive>
                {(advanceR.items ?? []).map((item, index) => {
                  let value: string | number;
                  if (Number.isInteger(item.valueNet)) {
                    value = item.valueNet + ".00";
                  } else {
                    value = item.valueNet.toFixed(2);
                  }
                  let typebank: string;
                  if (item.accountType === "CC") {
                    typebank = "CTE";
                  } else typebank = "AHO";
                  return (
                    <tr key={index}>
                      <td>PA</td>
                      <td>{item.identificationCard ?? ""}</td>
                      <td>USD</td>
                      <td>{value.toLocaleString().replace(/[$,.]/g, "")}</td>
                      <td>CTA</td>
                      <td>{typebank}</td>
                      <td>{item.accountBank ?? ""}</td>
                      <td>{item.details ?? ""}</td>
                      <td>{item.typeCard ?? ""}</td>
                      <td>{item.identificationCard ?? ""}</td>
                      <td>{item.beneficiary ?? ""}</td>
                      <td>{item.codBank ?? ""}</td>
                    </tr>
                  );
                })}
              </Table>
            </Row>
            <textarea
              style={{ width: "60%", marginTop: "8%" }}
              value={items}
              onChange={(e) => setItems(e.target.value)}
            ></textarea>
          </Container>
          <Button
            style={{ marginLeft: "50%", marginTop: "2%" }}
            onClick={createFile}
          >
            Guardar Cash
          </Button>
          <br />
          <br />
          <Button
            style={{ marginLeft: "50%", marginBottom: "3%" }}
            onClick={() => Router.back()}
          >
            Volver
          </Button>
        </div>
      )}
    </>
  );
};
export default SoliTxtBGR;
