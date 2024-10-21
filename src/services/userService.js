import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getMyInfo = async () => {
  return await httpClient.get(API.MY_INFO, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

// Tệp này cung cấp chức năng lấy thông tin người dùng đã đăng nhập bằng cách gọi API MY_INFO.

// Nó gửi yêu cầu HTTP với token xác thực trong Authorization header để đảm bảo rằng chỉ người dùng đã đăng nhập mới có thể lấy thông tin này​(userService).