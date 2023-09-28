import { useState } from "react";
import Sidebar from "../lib/components/sidebar";
import Image from "next/image";

type Tab = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const Colaborators: React.FC = () => {
  const tabs: Tab[] = [
    {
      id: "gestion",
      title: "Gestión y Crédito",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            GESTIÓN Y CRÉDITO
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarTahis.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  CRUZ PEREZ THAIS STEPHANY
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Gestión y Crédito
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente de Cobranza
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  tcruz@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 96 207 0136</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarAlexandra.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  PEREZ SOLIS MARINA ALEXANDRA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                Gestión y Crédito
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Jefa de Gestion y Credito
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  aperez@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 680 0285</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarGaby.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  SOLIS PEREZ GABRIELA SABRINA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                Gestión y Crédito
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente de Cobranza
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  gsolis@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 980 9252</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarYara.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ZAPATA PINCAY YARA MADELEINE
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                Gestión y Crédito
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Asistente Legal</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  yzapata@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 97 929 5155</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "vendedores",
      title: "Vendedores",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            VENDEDORES
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      BM
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  BORJA MENDOZA MARCELO GEOVANNI
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Ventas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Impulsador de Ventas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  mborja@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 551 5172</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      RN
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  RINCON CESPEDES NAIRIN ALEJANDRA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Ventas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Impulsador de Ventas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  nrincon@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 258 0723</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      SC
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  SARMIENTO CESPEDES CLAUDIA ALEJANDRA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Ventas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Impulsadora de Ventas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  asarmiento@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 180 5502</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      ZL
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ZAMUDIO RODRIGUEZ LURALDY NATACHA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Ventas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Impulsadora de Ventas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  nzamudio@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 857 1415</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "sistemas",
      title: "Sistemas",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            ADMINISTRACIÓN DE TI
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      BA
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  BARCIA VELASCO MARCELO ANTHONY
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Sistemas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente de sistemas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  mbarcia@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 97 900 0690</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      PJ
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  PROAÑO ANDRADE JUAN CARLOS
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Sistemas</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Jefe de Area de TI
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  jproano@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 527 8622</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "contabilidad",
      title: "Contabilidad",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            CONTABILIDAD
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarPili.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  CATOTA PALLASCO MARCIA PILAR
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Contabilidad</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente Contable
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  pcatota@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 879 1469</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      NV
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  NAVAS CORDOVA VALERIA ALEJANDRA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Contabilidad</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente Contable
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  vnavas@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 876 4713</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "servicios",
      title: "Servicios",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            SERVICIOS GENERALES
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarVictor.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ALMACHI BALAREZO VICTOR ALFONSO
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Mensajeria</td>
                <td className="px-3 py-2 whitespace-nowrap">Mensajero</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  valmachi@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 667 6139</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Image
                    src="/avatarErikaCanadas.jpg"
                    alt="Rounded avatar"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  CAÑADAS CRUZ ERIKA SILVANA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Recepcion</td>
                <td className="px-3 py-2 whitespace-nowrap">Recepcionista</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ecanadas@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 399 7842</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      MM
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  MOLINA CULQUI MARIA DEL CARMEN
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Servicios Generales
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Servicios Generales
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  carmenmolinaculqui@hotmail.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 993 4645</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "produccion",
      title: "Produccion",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            PRODUCCIÓN
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      SD
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  SANDOVAL CANO DIEGO RUBEN
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Producción</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Arquitecto Proyectista
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  dsandoval@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                +593 99 974 5045
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "gerencia",
      title: "Gerencia",
      content: (
        <div className="tab-content">
          <h2 className="my-4 font-semibold text-center text-2xl bg-slate-200">
            GERENCIA
          </h2>
          <table className="bg-gray-900 w-full px-5 text-xs">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Correo Electrónico
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                  Telefono
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-xs">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      AJ
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ALCAZAR SANTOS JHOANNA ELIZABETH
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Gerencia Comercial
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Supervisora de Ventas
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  jalcazar@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 400 0051</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      AD
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ANDRADE CONTRERAS DANIELA PAOLA
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Gerencia Financiera</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Gerente Financiero
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  dpandrade@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+1 (505) 570-1438</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      AD
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ANDRADE CONTRERAS DIEGO ROBERTO
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Gerencia General</td>
                <td className="px-3 py-2 whitespace-nowrap">Gerente General</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  dandrade@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 400 0050</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      AM
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  ANDRADE CORDOVA MIRIAM GERALDINE
                </td>
                <td className="px-3 py-2 whitespace-nowrap">Gerencia Marketing</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Gerente Marketing
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  mgandrade@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 400 0054</td>
              </tr>
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      CI
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  CEVALLOS CONTRERAS IVAN ISMAEL
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistencia Gerencial
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  Asistente de Gerencia
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  icevallos@grupoancon.com
                </td>
                <td className="px-3 py-2 whitespace-nowrap">+593 99 429 2849</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState("gestion");

  const changeTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <>
      <title>Colaboradores | Grupo ANCON</title>
      <div className="flex h-screen">
        <div className="md:w-1/6 max-w-none ">
          <Sidebar />
        </div>
        <div className="w-12/12 md:w-5/6 bg-gray-100">
        <p
              className="md:text-4xl text-xl text-center m-6"
              style={{
                display: "inline-block",
                color: "#610d9a",
                padding: "12px",
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              <strong>COLABORADORES </strong> {" "}
              <em
                style={{
                  color: "#bb22dd",
                  fontStyle: "normal",
                  fontSize: "26px",
                }}
              >
                de Grupo ANCON
              </em>
              <hr
                className="mt-0 ml-0 "
                style={{
                  width: "100%",
                  height: "3px",
                  backgroundColor: "#fff",
                }}
              />
            </p>
          {/* <h1 className="md:text-4xl text-xl font-semibold text-center mt-12 mb-8">
            Colaboradores de Grupo ANCON
          </h1> */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ml-8 mr-4">
            <p className="mb-2  font-semibold font-serif">
              Empresa:{" "}                
              <em
                style={{
                  color: "#64748b",
                  fontStyle: "normal",
                  fontSize: "20px",
                }}
              >
              INMOCONSTRUCCIONES Cia. Ltda.
              </em>
            </p>
            <div className="tab-panel">
              <div className="tab-buttons">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-button ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => changeTab(tab.id)}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>

              <div className="tab-contents">
                <div className="overflow-x-auto w-full mx-auto mb-5">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab-content ${
                        activeTab === tab.id ? "active" : "hidden"
                      }`}
                    >
                      {tab.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mb-2  font-semibold font-serif">
              Empresa:{" "}                
              <em
                style={{
                  color: "#64748b",
                  fontStyle: "normal",
                  fontSize: "20px",
                }}
              >
              INMOGESTION
              </em>
            </p>
            <div className="tab-contents">
              <div className="overflow-x-auto w-full mx-auto pb-5">
                <table className="bg-gray-900 w-full px-5 text-xs">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Perfil
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Departamento
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Cargo
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Correo Electrónico
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-gray-200 uppercase tracking-wider">
                        Telefono
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-xs">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            CM
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        CUVI VAZQUES MARIBEL GUADALUPE
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        mcuvi@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 98 387 1488
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            MP
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        MAYORGA ORTIZ NANCY PATRICIA
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        pmayorga@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 99 989 9751
                      </td>
                    </tr>

                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            MJ
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        MORA BADILLO JORGE ALEXANDER
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        jmora@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 99 268 9254
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            MF
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        MORA FRANKLIN
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        XXXXXXXXX@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 98 565 9779
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            NM
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        NARANJO VALENCIA JENNY MARCELA
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        mnaranjo@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 99 586 6763
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            NP
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        NARANJO YASIG VERONICA PATRICIA
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        pnaranjo@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 97 936 9635
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            QM
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        QUIMBAILA ANGULO MARIA GABRIELA
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        XXXXXXXXX@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 98 306 9675
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span className="font-medium text-gray-600 dark:text-gray-300">
                            RA
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        ROSERO YASIG ANA BEATRIZ
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">Comercial</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        Impulsador de Ventas
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        arosero@grupoancon.com
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                      +593 96 239 4999
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Colaborators;
