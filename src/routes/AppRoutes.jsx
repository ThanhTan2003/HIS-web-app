import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/homes/Home";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* <Route index element={<Login />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

// Đây có thể là tệp điều hướng (routing) của ứng dụng, định nghĩa các đường dẫn (routes) để di chuyển giữa các trang khác nhau trong ứng dụng React.

// Nó có thể chứa các thành phần như Login, TrangChu_QuanTriVien, và TrangChu_NVTV để quản lý điều hướng giữa các trang này dựa trên quyền của người dùng.