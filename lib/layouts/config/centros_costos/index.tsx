import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { useAuth } from "../../../hooks/use_auth";
import { FactureCenter } from "../../../types";
import HttpClient from "../../../utils/http_client";

const CentersPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<FactureCenter>>([]);

  const loadData = async () => {
    setLoading(true);
    const response = await HttpClient(
      "/api/centro_costos",
      "GET",
      auth.userName,
      auth.role
    );
    const centers: Array<FactureCenter> = response.data ?? [];
    setTableData(centers);
    setLoading(false);
  };

  const updateRow = async (data: any) => {
    const response = await HttpClient(
      "/api/centro_costos",
      "PUT",
      auth.userName,
      auth.role,
      data
    );
    if (response.success) toast.success("Centro de Costos Actualizado");
    else toast.success("Error!");
    await loadData();
  };

  const removeRow = async (data: any) => {
    const response = await HttpClient(
      "/api/centro_costos/" + data.id,
      "DELETE",
      auth.userName,
      auth.role
    );
    if (response.success) toast.success("Centro de Costos Eliminado");
    else toast.success("Centro de Costos Eliminado");
    await loadData();
  };

  const insertRow = async (data: any) => {
    const response = await HttpClient(
      "/api/centro_costos",
      "POST",
      auth.userName,
      auth.role,
      data
    );
    if (response.success) toast.success("Nuevo Centro de Costos Insertado");
    else toast.success("Error!");
    await loadData();
  };

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del Centro de Costos",
    },
    {
      dataField: "projectId",
      caption: "Proyecto",
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "40px 0" }}>
      <LoadingContainer visible={loading} miniVersion>
        <TreeTable
          dataSource={tableData}
          columns={columns}
          defaultActions={{
            updating: true,
            deleting: true,
            adding: true,
          }}
          onRow={{
            updated: updateRow,
            removed: removeRow,
            inserted: insertRow,
          }}
          searchPanel={true}
          paging
          showNavigationButtons
          showNavigationInfo
          pageSize={15}
          infoText={(actual, total, items) =>
            `Página ${actual} de ${total} (${items} centros de costos)`
          }
          colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
        />
      </LoadingContainer>
    </div>
  );
};

export default CentersPanel;
