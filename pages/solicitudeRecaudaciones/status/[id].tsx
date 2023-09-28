import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  ModalProps,
  ResponseData,
  SolicitudeRecaudaciones,
} from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";
import theme from "../../../lib/styles/theme";

interface Props extends ModalProps<SolicitudeRecaudaciones> {
  initialData?: SolicitudeRecaudaciones;
}

const StatusSolicitudeRecaudaciones = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] =
    useState<SolicitudeRecaudaciones>(null);

  const loadData = async () => {
    const solicitudeId = Router.query.id as string;
    const response: ResponseData = await HttpClient(
      "/api/solicitudeRecaudaciones/" + solicitudeId,
      "GET",
      auth.userName,
      auth.role
    );
    setInitialValues(response.data ?? []);
  };

  const handleClose = () => {
    props.close();
  };

  const formik = useFormik<SolicitudeRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: SolicitudeRecaudaciones) => {},
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values?.soliciterState === "Elaborando") {
      formik.values.applicantDate = "";
    } else {
      formik.values?.applicantDate;
    }

    if (formik.values?.contableState === "Pendiente") {
      formik.values.accountantDate = "";
    } else {
      formik.values?.accountantDate;
    }

    if (formik.values?.paymentTreasuryState === "Pendiente") {
      formik.values.treasuryDate = "";
    } else {
      formik.values?.treasuryDate;
    }

    if (formik.values?.financialState === "Pendiente") {
      formik.values.financialDate = "";
    } else {
      formik.values?.financialDate;
    }

    if (formik.values?.imageTreasuryState === "Pendiente") {
      formik.values.imageTreasuryDate = "";
    } else {
      formik.values?.imageTreasuryDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values?.soliciterState,
    formik.values?.applicantDate,
    formik.values?.contableState,
    formik.values?.accountantDate,
    formik.values?.paymentTreasuryState,
    formik.values?.treasuryDate,
    formik.values?.financialState,
    formik.values?.financialDate,
    formik.values?.imageTreasuryState,
    formik.values?.imageTreasuryDate,
  ]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          props.visible ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white p-6 rounded shadow-lg z-10 md:w-2/3 w-5/6 h-2/6 overflow-y-auto">
          <div
            style={{ color: theme.colors.red }}
            className="text-center text-xl mb-2 font-semibold"
          >
            Estado de solicitud
          </div>
          <hr />
          <div className="grid grid-cols-2 my-4">
            <strong>Solicitante: </strong>
            {formik.values?.soliciterState} {formik.values?.applicantDate}
            <strong>Contabilidad: </strong>
            {formik.values?.contableState} {formik.values?.accountantDate}
            <strong>Tesorería: </strong>
            {formik.values?.paymentTreasuryState} {formik.values?.treasuryDate}
            <strong>Financiera: </strong>
            {formik.values?.financialState} {formik.values?.financialDate}
            <strong>Pagos: </strong>
            {formik.values?.imageTreasuryState}{" "}
            {formik.values?.imageTreasuryDate}
          </div>
          <hr />
          <div className="relative items-end justify-end mt-4">
            <button
              className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default StatusSolicitudeRecaudaciones;
