import Request from "@/utils/request";
const request = new Request();

interface IUserData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const usersApi = {
  /**
   * 取得當前用戶資訊
   */
  getUserInfo: () => {
    request.fetch(`/users/me`, {
      method: "GET"
    });
  },
  /**
   * 新增用戶
   */
  addUser: (data: IUserData) =>
    request.fetch(`/users`, {
      method: "POST",
      body: JSON.stringify(data)
    }),
  /**
   * 更新用戶
   */
  updateUser: (userId: string, data: IUserData) => {
    request.fetch(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },
  /**
   * 刪除用戶
   */
  deleteUser: (userId: string) => {
    request.fetch(`/users/${userId}`, {
      method: "DELETE"
    });
  }
};

export default usersApi;
