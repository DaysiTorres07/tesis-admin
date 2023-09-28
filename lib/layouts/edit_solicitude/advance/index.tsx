import { Col, Row, Form } from "react-bootstrap"
import { useAuth } from "../../../hooks/use_auth"
import { Advance, FormikComponentProps, Solicitude} from "../../../types"
import { CheckFinished, CheckPermissions } from "../../../utils/check_permissions"
import { Abierto, Cerrado } from "../../../utils/constants"

type Props = {
  formik: any
  sm?: number
  md?: number
  lg?: number
  xl?: number
  inTabs?: boolean
}

const AdvancePanel = (props: Props) => {
  const { auth } = useAuth()
  const formik: FormikComponentProps<Solicitude> = props.formik
  const { sm, md, lg, xl, inTabs} = props

  return (
    <Row className={inTabs ? 'justify-content-center' : ''}>
      <Col sm={sm} md={md} lg={lg} xl={xl}>
        <Form.Group>
          <Form.Label className={inTabs ? 'ml-5 mt-3' : ''} style={{ color: 'black'}}>Estado de Cierre</Form.Label>
          <Form.Select
            name="advanceState"
            value={formik.values?.advanceState}
            onChange={formik.handleChange}
            disabled={CheckFinished(auth, [7], formik.values?.advanceState, Cerrado)}
          >
            <option>Seleccione una opción</option>
            <option value={Abierto}>Abierto</option>
            <option value={Cerrado}>Cerrado</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  )
}

export default AdvancePanel