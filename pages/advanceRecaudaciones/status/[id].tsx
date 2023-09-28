import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import LoadingContainer from "../../../lib/components/loading_container";
import { useAuth } from "../../../lib/hooks/use_auth";
import {
  AdvanceRecaudaciones,
  ModalProps,
  ResponseData,
} from "../../../lib/types";
import HttpClient from "../../../lib/utils/http_client";

interface Props extends ModalProps<AdvanceRecaudaciones> {
  initialData?: AdvanceRecaudaciones;
}

const StatusAdvanceR = (props: Props) => {
  const { auth } = useAuth();
  const [initialValues, setInitialValues] =
    useState<AdvanceRecaudaciones>(null);

  const loadData = async () => {
    const solicitudeId = Router.query.id as string;
    const response: ResponseData = await HttpClient(
      "/api/advance/" + solicitudeId,
      "GET",
      auth.userName,
      auth.role
    );
    setInitialValues(response.data ?? []);
  };

  const handleClose = () => {
    props.close();
  };

  const formik = useFormik<AdvanceRecaudaciones>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (FormData: AdvanceRecaudaciones) => {},
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
      formik.values.contableAdvanceDate = "";
    } else {
      formik.values?.contableAdvanceDate;
    }
    if (formik.values?.contableAdvanceState === "Abierto") {
      formik.values.accountantDate = "";
    } else {
      formik.values?.accountantDate;
    }
    if (formik.values?.advanceState === "Abierto") {
      formik.values.imageTreasuryDate = "";
    } else {
      formik.values?.imageTreasuryDate;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values?.applicantDate,
    formik.values?.soliciterState,
    formik.values?.accountantDate,
    formik.values?.paymentTreasuryState,
    formik.values?.treasuryDate,
    formik.values?.financialState,
    formik.values?.financialDate,
    formik.values?.imageTreasuryDate,
    formik.values?.imageTreasuryState,
    formik.values?.advanceState,
    formik.values?.contableAdvanceState,
    formik.values?.contableAdvanceDate,
  ]);

  return (
    <>
      <Modal show={props.visible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Estado de anticipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table width="100%">
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Solicitante: </strong>
              </td>

              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.soliciterState} {formik.values?.applicantDate}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Tesoreria: </strong>
              </td>
              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.paymentTreasuryState}{" "}
                {formik.values?.treasuryDate}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Financiera: </strong>
              </td>
              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.financialState} {formik.values?.financialDate}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Pagos: </strong>
              </td>
              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.imageTreasuryState}{" "}
                {formik.values?.contableAdvanceDate}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Contabilidad: </strong>
              </td>
              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.contableAdvanceState}{" "}
                {formik.values?.accountantDate}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", width: "25%" }}>
                <strong>Anticipo: </strong>
              </td>
              <td style={{ textAlign: "center", width: "25%" }}>
                {formik.values?.advanceState} {formik.values?.imageTreasuryDate}
              </td>
            </tr>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StatusAdvanceR;
