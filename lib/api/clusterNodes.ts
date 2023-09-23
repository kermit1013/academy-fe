import Request from "@/utils/request";
const request = new Request();

interface IClusterNodeData {
  name: string;
  is_solid: boolean;
}

export const clusterNodesApi = {
  /**
   * 取得叢集所有節點
   */
  getAllClusterNodes: (clusterCode: string) =>
    request.fetch(`/clusters/${clusterCode}/nodes`, {
      method: "GET"
    }),
  /**
   * 新增叢集節點
   */
  addClusterNode: (clusterCode: string, data: IClusterNodeData) =>
    request.fetch(`/clusters/${clusterCode}/nodes`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  /**
   * 更新叢集節點
   */
  updateClusterNode: (nodeId: string, data: IClusterNodeData) =>
    request.fetch(`/nodes/${nodeId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
  /**
   * 刪除叢集節點
   */
  deleteClusterNode: (nodeId: string) =>
    request.fetch(`/nodes/${nodeId}`, {
      method: "DELETE"
    })
};

export default clusterNodesApi;
