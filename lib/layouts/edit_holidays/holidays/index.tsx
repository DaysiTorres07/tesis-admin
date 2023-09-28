import { useAuth } from "../../../hooks/use_auth";
import { FormikComponentProps, Holidays } from "../../../types";
import { CheckFinished } from "../../../utils/check_permissions";
import { Aprobado, Pendiente, Rechazado } from "../../../utils/constants";

type Props = {
  formik: any;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  inTabs?: boolean;
};

const HolidaysPanel = (props: Props) => {
  const { auth } = useAuth();
  const formik: FormikComponentProps<Holidays> = props.formik;
  const { sm, md, lg, xl, inTabs } = props;
  return (
    <>
      <label className="text-gray-700 text-sm font-bold mb-2">
        Estado de Solicitante
      </label>
      <select
        className="border border-gray-200 text-gray-900 text-base rounded focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name="state"
        value={formik.values?.state}
        onChange={formik.handleChange}
        disabled={CheckFinished(auth, [2], formik.values?.state, Aprobado)}
      >
        <option>Seleccione una opción</option>
        <option value={Pendiente}>Pendiente</option>
        <option value={Aprobado}>Aprobado</option>
        <option value={Rechazado}>Rechazado</option>
      </select>
    </>
  );
};

export default HolidaysPanel;
