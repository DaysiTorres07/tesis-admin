import { Col, Row, Form } from "react-bootstrap"
import { useAuth } from "../../../hooks/use_auth"
import { FormikComponentProps, Solicitude } from "../../../types"
import { CheckFinished, CheckPermissions } from "../../../utils/check_permissions"
import { Pendiente, Procesando,  Aprobado } from "../../../utils/constants"

type Props = {
  formik: any
  sm?: number
  md?: number
  lg?: number
  xl?: number
  inTabs?: boolean
}

const ContabPanel = (props: Props) => {
  const { auth } = useAuth()
  const formik: FormikComponentProps<Solicitude> = props.formik
  const { sm, md, lg, xl, inTabs} = props

  return (
    <Row className={inTabs ? 'justify-content-center' : ''}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Group>
          <Form.Label className={inTabs ? 'ml-5 mt-3' : ''} style={{ color: 'black'}}>Estado de Contabilidad</Form.Label>
          <Form.Select
            name="contableState"
            value={formik.values?.contableState}
            onChange={formik.handleChange}
            disabled={CheckFinished(auth, [2], formik.values?.contableState, Aprobado)}
          >
            <option>Seleccione una opción</option>
            <option value={Procesando}>Procesando</option>
            <option value={Pendiente}>Pendiente</option>
            <option value={Aprobado}>Aprobado</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}

export default ContabPanel