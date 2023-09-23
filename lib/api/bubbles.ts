import Request from "@/utils/request";
const request = new Request();

interface IBubbleData {
  name: string;
  position_x: number;
  position_y: number;
}

export const bubblesApi = {
  /**
   * 取得所有泡泡
   */
  getAllBubbles: (journeyId: string) => {
    request.fetch(`/journeys/${journeyId}/bubbles`, {
      method: "GET"
    });
  },
  /**
   * 新增泡泡
   */
  addBubble: (journeyId: string, data: IBubbleData) =>
    request.fetch(`/journeys/${journeyId}/bubbles`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  /**
   * 更新泡泡
   */
  updateBubble: (bubbleId: string, data: IBubbleData) => {
    request.fetch(`/bubbles/${bubbleId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  /**
   * 刪除泡泡
   */
  deleteBubble: (bubbleId: string) => {
    request.fetch(`/bubbles/${bubbleId}`, {
      method: "DELETE"
    });
  }
};

export default bubblesApi;
