import Request from "@/utils/request";
const request = new Request();

export const authApi = {
  /**
   * 使用者登入
   */
  login: (data: { username: string; password: string }) =>
    request.fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    })
};

export default authApi;
