import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import EmployeeModal from "../../../components/modals/employees";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { Employees, ResponseData } from "../../../types";
import HttpClient from "../../../utils/http_client";

const EmployeesPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Employees>>([]);
  const [editEmployee, setEditEmployee] = useState<Employees | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/employees",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const employe: Array<Employees> = response.data;
      setTableData(employe);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  const columns: ColumnData[] = [
    {
      dataField: "beneficiary",
      caption: "Beneficiario",
    },
    {
      dataField: "identificationCard",
      caption: "# Cédula o RUC",
    },
    {
      dataField: "department",
      caption: "Departamento",
    },
    {
      dataField: "position",
      caption: "Cargo",
    },
    {
      dataField: "bank",
      caption: "Banco",
    },
    {
      dataField: "accountBank",
      caption: "# Cuenta",
    },
    {
      dataField: "accountType",
      caption: "Tipo Cuenta",
      width: 80,
      alignment: "center",
    },
    {
      dataField: "codBank",
      caption: "Cod Banco",
      width: 80,
      alignment: "center",
    },
    {
      dataField: "typeCard",
      caption: "Tipo de identificacion",
      width: 80,
      alignment: "center",
    },
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editEmployee != null) setEditEmployee(null);
    setModalVisible(false);
    await loadData();
  };
  return (
    <>
      <title>Empleados</title>
      <Container>
        <h3 className="text-danger mb-4 mt-4 text-center">Empleados</h3>
        <LoadingContainer visible={loading} miniVersion>
          <Button variant="outline-danger" className="mb-4" onClick={showModal}>
            Crear Usuario
          </Button>
          <TreeTable
            dataSource={tableData}
            columns={columns}
            buttonsFirst
            searchPanel={true}
            colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
            paging
            showNavigationButtons
            showNavigationInfo
            pageSize={15}
            infoText={(actual, total, items) =>
              `Página ${actual} de ${total} (${items} empleados)`
            }
          />
        </LoadingContainer>
        <EmployeeModal
          visible={modalVisible}
          close={hideModal}
          initialData={editEmployee}
          onDone={async (newUser: Employees) => {
            const response: ResponseData =
              editEmployee == null
                ? await HttpClient(
                    "/api/employees",
                    "POST",
                    auth.userName,
                    auth.role,
                    newUser
                  )
                : await HttpClient(
                    "/api/employees",
                    "PUT",
                    auth.userName,
                    auth.role,
                    newUser
                  );
            if (response.success) {
              toast.success(
                editEmployee == null
                  ? "Empleado creado!"
                  : "Empleado actualizado!"
              );
            } else {
              toast.warning(response.message);
            }
          }}
        />
      </Container>
    </>
  );
};
export default EmployeesPanel;
