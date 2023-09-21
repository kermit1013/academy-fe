import Request from "@/utils/request";
const request = new Request();

export const authApi = {
  login: (data: any) =>
    request.fetch("/auth/login", {
      method: "POST",
      body: data
    })
};

export default authApi;
