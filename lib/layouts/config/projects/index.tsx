import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingContainer from "../../../components/loading_container";
import TreeTable, { ColumnData } from "../../../components/tree_table";
import { FactureProject } from "../../../types";
import HttpClient from "../../../utils/http_client";
import { useAuth } from "../../../hooks/use_auth"

const ProjectsPanel = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<FactureProject>>([]);

  const loadData = async () => {
    setLoading(true)
    const response = await HttpClient("/api/project", 'GET', auth.userName, auth.role);
    const projects: Array<FactureProject> = response.data ?? [];
    setTableData(projects)
    setLoading(false)
  }

  const updateRow = async (data: any) => {
    const response = await HttpClient("/api/project", 'PUT', auth.userName, auth.role, data);
    if(response.success) toast.success('Proyecto Actualizado')
    else  toast.success('Error!')
    await loadData();
  }

  const removeRow = async (data: any) => {
    const response = await HttpClient("/api/project/" + data.id, 'DELETE', auth.userName, auth.role);
    if(response.success) toast.success('Proyecto Eliminado')
    else  toast.success('Error!')
    await loadData();
  }

  const insertRow = async (data: any) => {
    const response = await HttpClient("/api/project", 'POST', auth.userName, auth.role, data);
    if(response.success) toast.success('Nuevo Proyecto Insertado')
    else  toast.success('Error!')
    await loadData();
  }

  const columns: ColumnData[] = [
    {
      dataField: "name",
      caption: "Nombre del proyecto",
    },
  ];

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: '40px 0' }}>
    <LoadingContainer visible={loading} miniVersion>
      <TreeTable
        dataSource={tableData}
        columns={columns}
        defaultActions={{
          updating: true,
          deleting: true,
          adding: true
        }}
        onRow={{
          updated: updateRow,
          removed: removeRow,
          inserted: insertRow,
        }}
        searchPanel={true}
        colors={{ headerBackground: "#F8F9F9", headerColor: "#CD5C5C" }}
        paging
        showNavigationButtons
        showNavigationInfo
        pageSize={15}
        infoText={(actual, total, items) =>
          `Página ${actual} de ${total} (${items} Proyectos)`
        }
      />
    </LoadingContainer>
        </div>
  )
}

export default ProjectsPanel