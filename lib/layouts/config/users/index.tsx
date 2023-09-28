import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import UserModal from "../../../components/modals/user";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { ResponseData, User } from "../../../types";
import HttpClient from "../../../utils/http_client";

const UsersPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Array<User>>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/user",
      "GET",
      auth.userName,
      auth.role
    );
    if (response.success) {
      const users: Array<any> = response.data;
      setTableData(users);
    } else {
      toast.warning(response.message);
    }
    setLoading(false);
  };

  // ejecuta funcion al renderizar la vista
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => setModalVisible(true);
  const hideModal = async () => {
    if (editingUser != null) setEditingUser(null);
    setModalVisible(false);
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del empleado",
    },
    {
      dataField: "userName",
      caption: "Usuario",
    },
    {
      dataField: "email",
      caption: "E-mail",
    },
    {
      dataField: "identificationCard",
      caption: "Cedula o RUC",
    },
    {
      dataField: "cellphone",
      caption: "# celular",
    },
    {
      dataField: "countPermission",
      caption: "Permisos Disponibles",
    },
    {
      dataField: "dateAdmission",
      caption: "Fecha de Ingreso",
    },
    {
      dataField: "bussines",
      caption: "Empresa",
    },
    {
      dataField: "department",
      caption: "Departamento",
    },
    {
      dataField: "position",
      caption: "Cargo o Puesto",
    },
    {
      dataField: "holidays",
      caption: "Dias de vacaciones",
    },
    {
      dataField: "role",
      caption: "Rol",
      cellRender: ({ text }: any) => {
        switch (text) {
          case "0":
            return "Administrador";
          case "1":
            return "1";
          case "2":
            return "2";
          case "3":
            return "3";
          case "4":
            return "4";
          case "5":
            return "5";
          case "6":
            return "6";
          case "7":
            return "7";
          case "8":
            return "8";
          case "9":
            return "9";
          case "10":
            return "10";
          case "11":
            return "11";
          case "12":
            return "12";
          case "13":
            return "13";
          case "14":
            return "14";
          case "15":
            return "15";
          case "16":
            return "16";
          case "17":
            return "17";
          case "18":
            return "18";
          case "19":
            return "19";
          case "20":
            return "20";
          case "21":
            return "21";
          case "22":
            return "22";
          case "23":
            return "23";
          case "24":
            return "24";
          case "25":
            return "25";
          case "26":
            return "26";
          case "27":
            return "27";
          case "28":
            return "28";
          case "29":
            return "29";
          case "30":
            return "30";
          case "31":
            return "31";
          case "32":
            return "32";
          case "33":
            return "33";
          case "34":
            return "34";
          case "35":
            return "35";
          case "36":
            return "36";
          case "37":
            return "37";
          default:
            return "";
        }
      },
    },
  ];

  const buttons = {
    edit: (rowData: any) => {
      setEditingUser(rowData);
      showModal();
    },
    delete: async (rowData: any) => {
      await HttpClient(
        "/api/user/" + rowData.id,
        "DELETE",
        auth.userName,
        auth.role
      );
      await loadData();
    },
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <button
        className="text-center bg-transparent hover:bg-red-500 text-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
        onClick={showModal}
      >
        Crear Usuario
      </button>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          dataSource={tableData}
          columns={columns}
          buttons={buttons}
          searchPanel={true}
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} Usuarios)`
          }
        />
      </LoadingContainer>
      <UserModal
        visible={modalVisible}
        close={hideModal}
        initialData={editingUser}
        onDone={async (newUser: User) => {
          const response: ResponseData =
            editingUser == null
              ? await HttpClient(
                  "/api/user",
                  "POST",
                  auth.userName,
                  auth.role,
                  newUser
                )
              : await HttpClient(
                  "/api/user",
                  "PUT",
                  auth.userName,
                  auth.role,
                  newUser
                );
          if (response.success) {
            toast.success(
              editingUser == null ? "Usuario creado!" : "Usuario actualizado!"
            );
          } else {
            toast.warning(response.message);
          }
        }}
      />
    </div>
  );
};

export default UsersPanel;
