import Request from "@/utils/request";
const request = new Request();

interface IJourneyData {
  id: string;
  project_id: string;
}

export const journeysApi = {
  /**
   * 取得探索內容
   */
  getJourney: (journeyId: string) => {
    request.fetch(`/journeys/${journeyId}`, {
      method: "GET"
    });
  },
  /**
   * 新增探索
   */
  addJourney: (data: IJourneyData) =>
    request.fetch(`/journeys`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  /**
   * 更新探索
   */
  updateJourney: (journeyId: string, data: IJourneyData) => {
    request.fetch(`/journeys/${journeyId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }
};

export default journeysApi;
