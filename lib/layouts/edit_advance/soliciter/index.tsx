import { useAuth } from "../../../hooks/use_auth";
import { FormikComponentProps, Solicitude } from "../../../types";
import { CheckFinished } from "../../../utils/check_permissions";
import { Elaborando, Aprobado } from "../../../utils/constants";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const SoliciterPanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Solicitude> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  return (
    <>
      <label style={{ color: "black" }}>Estado de Solicitante</label>
      <select
        className="border border-gray-200 text-gray-900 text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name="soliciterState"
        value={formik.values?.soliciterState}
        onChange={formik.handleChange}
        disabled={CheckFinished(
          auth,
          [9],
          formik.values?.soliciterState,
          Aprobado
        )}
      >
        <option>Seleccione una opción</option>
        <option value={Elaborando}>Elaborando</option>
        <option value={Aprobado}>Aprobado</option>
      </select>
    </>
  );
};

export default SoliciterPanel;
