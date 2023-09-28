import { Col, Row, Form } from "react-bootstrap";
import { useAuth } from "../../../hooks/use_auth";
import { Advance, FormikComponentProps, Solicitude } from "../../../types";
import {
  CheckFinished,
  CheckPermissions,
} from "../../../utils/check_permissions";
import { Abierto, Cerrado, Pendiente } from "../../../utils/constants";
import { useEffect, useState } from "react";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const ContabAdvancePanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (formik.values?.imageTreasuryState === Pendiente) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [formik.values?.imageTreasuryState]);

  return (
    <Row className={inTabs ? "justify-content-center" : ""}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Group>
          <Form.Label
            className={inTabs ? "ml-5 mt-3" : ""}
            style={{ color: "black" }}
          >
            Estado de Contabilidad
          </Form.Label>
          <Form.Select
            className={`border ${
              isDisabled ? "bg-gray-200" : "bg-white"
            } text-gray-900 text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            name="contableAdvanceState"
            value={formik.values?.contableAdvanceState}
            onChange={formik.handleChange}
            disabled={
              CheckFinished(
                auth,
                [2],
                formik.values?.contableAdvanceState,
                Cerrado
              ) || isDisabled
            }
          >
            <option>Seleccione una opción</option>
            <option value={Abierto}>Abierto</option>
            <option value={Cerrado}>Cerrado</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default ContabAdvancePanel;
