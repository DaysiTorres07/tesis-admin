import React from "react";
import { useAuth } from "../lib/hooks/use_auth";
import { CheckPermissions } from "../lib/utils/check_permissions";
import Router from "next/router";
import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";
import { FaChild, FaClipboardList } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa";
import Sidebar from "../lib/components/sidebar";

// Inicio de la app
const HolidaysHome = () => {
  const { auth } = useAuth();
  return (
    <>
      <title>ANCON | Permisos y Vacaciones</title>
      <div className="md:flex md:h-full">
        <div className="md:w-1/6 max-w-none">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 ">
          <div>
            <div className={styles.limiter}>
              <p className="p-2 text-sm">
                Bienvenido/a :<strong>{` ${auth?.name}`}</strong>
              </p>
              <p className="p-2 text-sm">
                DÍAS DE VACACIONES :{" "}
                <strong>
                  <span className="ml-2 fs-4">{` ${auth?.holidays}`}</span>
                </strong>
              </p>
              <br />
              <h2
                className="mx-2 flex items-center justify-center xl:text-2xl text-base font-bold leading-normal mt-2"
                style={{ color: "#465959" }}
              >
                <span>
                  SISTEMA DE SOLICITUDES DE
                  <br />
                  Permisos, Vacaciones y Prestamos
                </span>
                <FaAddressBook size={48} style={{ marginLeft: "0.8rem" }} />
              </h2>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  className="rounded overflow-hidden shadow-lg"
                  style={{ backgroundColor: "rgb(241, 241, 241)" }}
                >
                  <h3
                    className="my-3 mx-5 xl:text-xl text-base text-sky-800"
                    style={{
                      color: "#ff9915",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaChild size={32} style={{ marginRight: "0.5rem" }} />
                    <strong>TRAMITES / SERVICIOS</strong>
                  </h3>
                  <hr className="border-t bg-gray-800" />
                  <p className="m-0 text-center block my-2 xl:text-lg text-sm">
                    <button
                      className="hover:bg-gray-300 p-1"
                      style={{ color: "#003f72" }}
                      onClick={() => Router.push({ pathname: "/holidays/new" })}
                    >
                      Crear Solicitud de <strong>Vacaciones</strong>
                    </button>
                  </p>
                  <hr className="border-t bg-gray-800" />
                  <p className="m-0 text-center block my-2 xl:text-lg text-sm">
                    <button
                      className="hover:bg-gray-300 p-1"
                      style={{ color: "#003f72" }}
                      onClick={() =>
                        Router.push({ pathname: "/permission/new" })
                      }
                    >
                      Crear Solicitud de <strong>Permiso</strong>
                    </button>
                  </p>
                  <hr className="border-t bg-gray-800" />
                  <p className="m-0 text-center block my-2 xl:text-lg text-sm">
                    <button
                      className="hover:bg-gray-300 p-1"
                      style={{ cursor: "pointer", color: "#003f72" }}
                      onClick={() => Router.push({ pathname: "/loan/new" })}
                    >
                      Crear Solicitud de <strong> Prestamos</strong>
                    </button>
                  </p>
                </div>
                <div
                  className="rounded overflow-hidden shadow-lg md:h-3/5"
                  style={{ backgroundColor: "rgb(241, 241, 241)" }}
                >
                  <h3
                    className="my-3 mx-5 xl:text-xl text-base text-sky-800"
                    style={{
                      color: "#ff9915",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaClipboardList
                      size={32}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <strong>HISTORIAL</strong>
                  </h3>
                  <hr className="border-t bg-gray-800" />
                  <p className="m-0 text-center block my-2 xl:text-lg text-sm">
                    <button
                      className="hover:bg-gray-300 p-1"
                      style={{ color: "#003f72", cursor: "pointer" }}
                      onClick={() => Router.push({ pathname: "/requests" })}
                    >
                      Ver Mis <strong>Vacaciones/Permisos/Prestamos</strong>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HolidaysHome;
