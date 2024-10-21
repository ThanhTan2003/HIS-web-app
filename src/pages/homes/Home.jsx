import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import TrangChu_QuanTriVien from "./TrangChu_QuanTriVien"; // Import trang chủ của quản trị viên
import TrangChu_BacSi from "./TrangChu_BacSi"; // Import trang chủ của bác sĩ

function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null); // Bắt đầu với giá trị null để tránh lỗi undefined
  const [loading, setLoading] = useState(true); // Trạng thái loading để chờ lấy thông tin người dùng
  const [error, setError] = useState(null); // Trạng thái để xử lý lỗi nếu có

  // Hàm để lấy thông tin người dùng từ API
  const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/identity/user/get-info",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Gửi token trong header
          },
        }
      );

      if (!response.ok) {
        throw new Error("Tài khoản không hợp lệ. Vui lòng kiểm tra lại");
      }

      const data = await response.json();
      setUserDetails(data); // Cập nhật thông tin người dùng
    } catch (err) {
      setError(err.message); // Cập nhật lỗi nếu có
    } finally {
      setLoading(false); // Dừng trạng thái loading sau khi hoàn thành
    }
  };

  // Hook để kiểm tra token và lấy thông tin người dùng
  useEffect(() => {
    const accessToken = getToken();

    if (!accessToken) {
      navigate("/login"); // Nếu không có token, điều hướng về trang đăng nhập
    } else {
      getUserDetails(accessToken); // Gọi hàm lấy thông tin người dùng nếu có token
    }
  }, [navigate]);

  // Nếu đang trong quá trình loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu có lỗi xảy ra trong quá trình lấy thông tin người dùng
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Nếu đã có thông tin người dùng, điều hướng dựa trên roleId
  if (userDetails) {
    if (userDetails.roleId === "QuanTriVien") {
      // Nếu là quản trị viên, hiển thị giao diện quản trị viên
      return <TrangChu_QuanTriVien />;
    } else if (userDetails.roleId === "BacSi") {
      // Nếu là bác sĩ, hiển thị giao diện bác sĩ
      return <TrangChu_BacSi />;
    } else {
      // Nếu roleId không phù hợp, có thể điều hướng hoặc hiển thị thông báo lỗi
      return <div>Role không hợp lệ!</div>;
    }
  }

  return null; // Phòng ngừa trường hợp userDetails là null, không nên render gì
}

export default Home;
