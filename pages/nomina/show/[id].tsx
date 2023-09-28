import { useFormik } from "formik";
import Router from "next/router";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useAuth } from "../../../lib/hooks/use_auth";
import RoleLayout from "../../../lib/layouts/role_layout";
import { FactureEmployees, Nomina, ResponseData } from "../../../lib/types";
import { Elaborando } from "../../../lib/utils/constants";
import FormatedDate from "../../../lib/utils/formated_date";
import HttpClient from "../../../lib/utils/http_client";
import NavBar from "../../../lib/components/navbar";
import LoadingContainer from "../../../lib/components/loading_container";
import { CheckPermissions } from "../../../lib/utils/check_permissions";

const ShowNomina = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Array<FactureEmployees>>([]);
  const [values, setValues] = useState<Map<string, number>>(new Map());
  const [initialValues, setInitialValues] = useState<Nomina>({
    number: 0,
    soliciter: "",
    date: FormatedDate(),
    details: "",
    soliciterState: "",
    state: Elaborando,
    items: [],
    month: "",
  });

  const loadData = async () => {
    if (Router.asPath !== Router.route) {
      let valueNomina = 0;
      setLoading(true);
      const nominaId = Router.query.id as string;
      const response: ResponseData = await HttpClient(
        "/api/nomina/" + nominaId,
        "GET",
        auth.userName,
        auth.role
      );
      setInitialValues(response.data);
      setItems(response.data.items);
      (response.data?.items ?? []).forEach((nomina: FactureEmployees) => {
        valueNomina += parseFloat(nomina.value);
      });
      setLoading(false);
      setValues(new Map([["valueNomina", valueNomina]]));
    } else {
      setTimeout(loadData, 1000);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik<Nomina>({
    enableReinitialize: true,
    validateOnMount: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues,
    onSubmit: async (formData: Nomina) => {},
  });

  const txtPichinca = () => {
    if (Router.asPath !== Router.route) {
      const nominaId = Router.query.id as string;
      Router.push({ pathname: "/nomina/txtPichincha/" + nominaId });
    } else {
      setTimeout(txtPichinca, 1000);
    }
  };

  const txtBGR = () => {
    if (Router.asPath !== Router.route) {
      const nominaId = Router.query.id as string;
      Router.push({ pathname: "/nomina/txtBGR/" + nominaId });
    } else {
      setTimeout(txtBGR, 1000);
    }
  };

  const totalValue = (items ?? []).reduce((acc, cur) => {
    return acc + (parseFloat(cur.value) ?? 0);
  }, 0)

  return (
    <>
      <RoleLayout permissions={[0, 3, 4, 5, 9]}>
        <title>Revisar Nomina</title>
        
        <NavBar />
        <Container>
          <h3 className="text-danger mb-4 mt-4 text-center">Revisar Nomina</h3>
          <LoadingContainer visible={loading} miniVersion>
            <Row className="mb-4">
              <Col lg={3} md={3}>
                <Form.Group>
                  <Form.Label>Solicitante</Form.Label>
                  <Form.Control
                    type="text"
                    name="soliciter"
                    placeholder="Solicitante"
                    value={formik.values?.soliciter ?? ""}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="text"
                    name="date"
                    value={formik.values?.date}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={3}>
                <Form.Group>
                  <Form.Label>Mes</Form.Label>
                  <Form.Control
                    value={formik.values?.month}
                    name="month"
                    onChange={formik.handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={3}>
                <Form.Group>
                  <Form.Label>Detalle</Form.Label>
                  <Form.Control
                    type="text"
                    value={formik.values?.details}
                    name="details"
                    onChange={formik.handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="mx-auto" lg={3} md={3}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    name="state"
                    value={formik.values?.state}
                    onChange={formik.handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg={3} md={3}>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!CheckPermissions(auth, [0, 3])}
                    variant="outline-danger"
                    id="dropdown-basic"
                  >
                    Generar Cash
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={txtPichinca}>
                      Pichincha
                    </Dropdown.Item>
                    <Dropdown.Item onClick={txtBGR}>BGR</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <Table responsive bordered className="text-center mt-4">
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Departamento</th>
                  <th>Cargo</th>
                  <th>Cedula o RUC</th>
                  <th>Tipo ID</th>
                  <th>Banco</th>
                  <th>Cuenta banco</th>
                  <th>Tipo de Cuenta</th>
                  <th>Codigo Banco</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {(items ?? []).map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>{row.beneficiary}</td>
                      <td>{row.department}</td>
                      <td>{row.position}</td>
                      <td>{row.identificationCard}</td>
                      <td>{row.typeCard}</td>
                      <td>{row.bank}</td>
                      <td>{row.accountBank}</td>
                      <td>{row.accountType}</td>
                      <td>{row.codBank}</td>
                      <td>{row.typeProv}</td>
                      <td>{row.value}</td>
                    </tr>
                  );
                })}
                <tr>
                  <th colSpan={10}>Valor Total</th>
                  <td>{totalValue}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant="outline-danger" onClick={() => Router.back()}>
              Volver
            </Button>
          </LoadingContainer>
        </Container>
      </RoleLayout>
    </>
  );
};
export default ShowNomina;
