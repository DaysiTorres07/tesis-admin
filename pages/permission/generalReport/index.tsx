import React, { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import LoadingContainer from "../../../lib/components/loading_container";
import Router from "next/router";
import HttpClient from "../../../lib/utils/http_client";
import { Permission } from "../../../lib/types";
const ReporteFechas = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState("");
  const [permission, setPermission] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showTable, setShowTable] = useState(false);

  const loadData = async () => {
    setLoading(true);
    var permissions: Array<Permission> =
      (await HttpClient("/api/permission", "GET", auth.userName, auth.role))
        .data ?? [];

    var permissionsAp: Array<Permission> =
      (
        await HttpClient(
          "/api/permission/permissionHistory",
          "GET",
          auth.userName,
          auth.role
        )
      ).data ?? [];

    var permissionsRe: Array<Permission> =
      (
        await HttpClient(
          "/api/permission/permissionHistoryRe",
          "GET",
          auth.userName,
          auth.role
        )
      ).data ?? [];
    const permisos = [].concat(permissions, permissionsAp, permissionsRe);
    setPermission(permisos);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleShowTable = () => {
    setShowTable(true);
  };

  const filteredPermissions = permission.filter((item) => {
    const date = item.dateS ?? "";
    return date >= startDate && date <= endDate;
  });

  const filteredPermissionsSearch = filteredPermissions.filter(
    (item) =>
      item.soliciter.toLowerCase() === busqueda.toLowerCase() ||
      item.soliciter.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.deparmentSoliciter.toLowerCase() === busqueda.toLowerCase() ||
      item.deparmentSoliciter.toLowerCase().includes(busqueda.toLowerCase())
  );

  const sortedPermissions = filteredPermissionsSearch.sort((a, b) => {
    const nameA = a.soliciter.toLowerCase();
    const nameB = b.soliciter.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const handlePrint = () => {
    window.print();
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
      <LoadingContainer visible={!loading} miniVersion>
        <div>
          <div
            style={{
              width: "297mm",
              height: "210mm",
              position: "relative",
              margin: "0 auto",
            }}
          >
            <div className="clase-a-ocultar p-3 bg-sky-100">
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
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="my-4">
                  <label htmlFor="startDate" className="mr-2 font-medium">
                    Fecha de inicio:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="my-4">
                  <label htmlFor="endDate" className="mr-2 font-medium">
                    Fecha de fin:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={handleShowTable}
                  className="block mx-auto my-4 px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Mostrar Tabla
                </button>
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
            </div>
            <div>
              <h1 className="text-center mb-3 font-bold">
                REPORTE GENERAL DE PERMISOS
              </h1>
              {showTable && (
                <div>
                  <table
                    className="border-collapse border border-gray-300 w-full"
                    style={{
                      fontSize: "11px",
                      marginTop: "1em",
                    }}
                  >
                    <thead style={{ textAlign: "center" }}>
                      <tr>
                        <th className="border px-2 py-2">CODIGO</th>
                        <th className="border px-2 py-2">COLABORADOR</th>
                        <th className="border px-2 py-2">DEPARTAMENTO</th>
                        <th className="border px-2 py-2">ESTADO</th>
                        <th className="border px-2 py-2">FECHA</th>
                        <th className="border py-2">HORA INICIAL</th>
                        <th className="border py-2">HORA FINAL</th>
                        <th className="border px-2 py-2"># HORAS</th>
                        <th className="border px-2 py-2">OPCION</th>
                        <th className="border px-2 py-2">DETALLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(sortedPermissions ?? []).map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="border px-2 py-2 text-center">
                              {item.number ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center whitespace-nowrap">
                              {item.soliciter ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center">
                              {item.deparmentSoliciter ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center">
                              {item.state ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center whitespace-nowrap">
                              {item.dateS ?? ""}
                            </td>
                            <td className="border py-2 text-center">
                              {item.startTime ?? ""}
                            </td>
                            <td className="border py-2 text-center">
                              {item.finalTime ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center">
                              {item.requestedHour ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-center">
                              {item.typePermissions ?? ""}
                            </td>
                            <td className="border px-2 py-2 text-justify">
                              {item.details ?? ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <br />
          </div>
        </div>
      </LoadingContainer>
    </>
  );
};

export default ReporteFechas;
