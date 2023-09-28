import { useAuth } from "../../../hooks/use_auth";
import { FormikComponentProps, Solicitude } from "../../../types";
import { CheckFinished } from "../../../utils/check_permissions";
import {
  Pendiente,
  Procesando,
  Aprobado,
  Elaborando,
} from "../../../utils/constants";
import { useEffect, useState } from "react";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const TreasuryPanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (formik.values?.soliciterState === Elaborando) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [formik.values?.soliciterState]);

  return (
    <>
      <label style={{ color: "black" }}>
        Estado de pago tesoreria
      </label>
      <select
        className={`border ${
          isDisabled ? "bg-gray-200" : "bg-white"
        } text-gray-900 text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        name="paymentTreasuryState"
        value={formik.values?.paymentTreasuryState}
        onChange={formik.handleChange}
        disabled={
          CheckFinished(
            auth,
            [3],
            formik.values?.paymentTreasuryState,
            Aprobado
          ) || isDisabled
        }
      >
        <option>Seleccione una opción</option>
        <option value={Procesando}>Procesando</option>
        <option value={Pendiente}>Pendiente</option>
        <option value={Aprobado}>Aprobado</option>
      </select>
    </>
  );
};

export default TreasuryPanel;
