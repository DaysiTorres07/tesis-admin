import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import { Holidays } from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

const GeneralReportHolidays = () => {
  const { auth } = useAuth();
  const [solicitude, setSolicitude] = useState<Map<string, Array<Holidays>>>(
    new Map()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [holidaysBySoliciter, setHolidayBySoliciter] = useState<
    Map<String, Array<Holidays>>
  >(new Map());
  const [busqueda, setBusqueda] = useState("");
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      const dateString = Router.query.dateString as string;

      var solicitudes: Array<Holidays> =
        (
          await HttpClient(
            "/api/holidays?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      var solicitudesAp: Array<Holidays> =
        (
          await HttpClient(
            "/api/holidays/solicitudeHistory?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      var solicitudesRe: Array<Holidays> =
        (
          await HttpClient(
            "/api/holidays/solicitudeHistoryRe?dates=" + dateString,
            "GET",
            auth.userName,
            auth.role
          )
        ).data ?? [];

      const holidays = [].concat(solicitudes, solicitudesAp, solicitudesRe);
      setSolicitude(new Map([["holi", holidays]]));

      let auxHolidaysBySoliciter: Map<String, Array<Holidays>> = new Map();
      holidays.forEach((holi: Holidays) => {
        if (
          !Array.from(auxHolidaysBySoliciter.keys()).includes(holi.soliciter)
        ) {
          auxHolidaysBySoliciter.set(holi.soliciter, [holi]);
        } else {
          auxHolidaysBySoliciter.set(holi.soliciter, [
            ...auxHolidaysBySoliciter.get(holi.soliciter),
            holi,
          ]);
        }
      });
      setHolidayBySoliciter(auxHolidaysBySoliciter);

      setLoading(true);
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterByProvider = (
    solicitudes: Map<String, Array<Holidays>>
  ): Map<String, Array<Holidays>> => {
    const filtered: Map<String, Array<Holidays>> = new Map();
    solicitudes.forEach((facture: Array<Holidays>, project: string) => {
      const filteredFactures: Array<Holidays> = facture.filter(
        (item) =>
          item.soliciter.toLowerCase() === busqueda.toLowerCase() ||
          item.soliciter.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.deparmentSoliciter.toLowerCase() === busqueda.toLowerCase() ||
          item.deparmentSoliciter.toLowerCase().includes(busqueda.toLowerCase())
      );
      if (filteredFactures.length > 0) {
        filtered.set(project, filteredFactures);
      }
    });
    return filtered;
  };

  const getUserBySoliciter = (
    arraySolicitude: Array<Holidays>,
    arraybySoliciter: Map<String, Holidays[]>
  ): Array<JSX.Element> => {
    const jsxArray: Array<JSX.Element> = [];
    arraybySoliciter.forEach((holidays: Array<Holidays>, soliciter: string) => {
      jsxArray.push(
        <>
          <tbody key={soliciter}>
            {(holidays ?? []).map((item: Holidays, index: number) => {
              return (
                <tr key={index}>
                  <td className="border px-2 py-2">{item.number ?? ""}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">{item.soliciter ?? ""}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">{item.deparmentSoliciter ?? ""}</td>
                  <td className="border px-2 py-2">{item.state}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">{item.dateS ?? ""}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">{item.dateE ?? ""}</td>
                  <td className="border px-2 py-2">{item.requestedDays ?? ""}</td>
                  <td className="border px-2 py-2 whitespace-nowrap">{item.typePermissions ?? ""}</td>
                  <td className="border px-2 py-2">{item.details ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </>
      );
    });
    return jsxArray;
  };

  return (
    <>
      <title>Reporte General</title>
      <style>
        {`
            body {
              background-color: white !important;
            }
            @media print {
              .clase-a-ocultar {
                display: none !important;
              }
              
            }
         `}
      </style>
      <LoadingContainer visible={!loading}>
        <div>
          <div
            style={{
              width: "297mm",
              height: "210mm",
              position: "relative",
              margin: "0 auto",
            }}
          >
            <div className="grid grid-cols-8">
              <div className="col-start-4">
                <button
                  className="block mx-auto my-4 px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={handlePrint}
                >
                  Imprimir PDF
                </button>
              </div>
              <div>
                <button
                  className="block mx-auto my-4 px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-600 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => Router.back()}
                >
                  Volver
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative flex items-center w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search text-gray-400"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full rounded-lg border focus:ring focus:ring-blue-300 focus:border-blue-300"
                  value={busqueda}
                  placeholder="Buscar aquí..."
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div ref={componentRef}>
              <h1 className="text-center mb-3 font-bold">
                REPORTE GENERAL DE VACACIONES
              </h1>
              {(solicitude.get("holi") ?? []).length !== 0 && (
                <>
                  <div id="holi" className="m-2">
                    <table
                      className="border-collapse border border-gray-300 w-full"
                      style={{
                        fontSize: "11px",
                        marginTop: "1em",
                      }}
                    >
                      <thead>
                        <tr className="text-center">
                          <th className="border px-2 py-2">CODIGO</th>
                          <th className="border px-2 py-2">COLABORADOR</th>
                          <th className="border px-2 py-2">DEPARTAMENTO</th>
                          <th className="border px-2 py-2">ESTADO</th>
                          <th className="border px-2 py-2">FECHA INICIO</th>
                          <th className="border px-2 py-2">FECHA FINAL</th>
                          <th className="border px-2 py-2">DIAS</th>
                          <th className="border px-2 py-2">OPCION</th>
                          <th className="border px-2 py-2">DETALLE</th>
                        </tr>
                      </thead>
                      {getUserBySoliciter(
                        solicitude.get("holi"),
                        busqueda.length > 0
                          ? filterByProvider(holidaysBySoliciter)
                          : holidaysBySoliciter
                      )}
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </LoadingContainer>
    </>
  );
};
export default GeneralReportHolidays;
