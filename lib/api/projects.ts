import Request from "@/utils/request";
const request = new Request();

interface ITagData {
  name: string;
  color: string;
}

interface IProjectData {
  name: string;
  tags: ITagData[];
}

export const projectsApi = {
  /**
   * 取得所有專案
   */
  getAllProjects: () => {
    request.fetch(`/projects`, {
      method: "GET"
    });
  },
  /**
   * 建立專案
   */
  addProject: (data: IProjectData) =>
    request.fetch(`/projects`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  /**
   * 更新專案
   */
  updateProject: (projectId: string, data: IProjectData) =>
    request.fetch(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),
  /**
   * 籼除專案
   */
  deleteProject: (projectId: string) =>
    request.fetch(`/projects/${projectId}`, {
      method: "DELETE"
    }),
  /**
   * 新增專案標籤
   */
  addProjectTag: (projectId: string, data: ITagData) => {
    request.fetch(`/projects/${projectId}/tags`, {
      method: "POST",
      body: JSON.stringify(data)
    });
  },
  /**
   * 取得專案規劃所有時程
   */
  getProjectSchedules: (projectId: string) => {
    request.fetch(`/projects/${projectId}/schedules`, {
      method: "GET"
    });
  }
};

export default projectsApi;
