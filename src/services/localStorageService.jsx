export const KEY_TOKEN = "accessToken";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

// Tệp này quản lý việc lưu trữ token xác thực trong localStorage.

// Các chức năng chính bao gồm lưu token (setToken), lấy token (getToken), và xóa token (removeToken)​(localStorageService).