import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { introspect } from "../../services/authenticationService";
import TrangChu_GiamDocDieuHanh from "./TrangChu_GiamDocDieuHanh";
import TrangChu_BacSi from "./TrangChu_BacSi";
import { CONFIG, API } from "../../configurations/configuration";
import Error from "./Error";

const Home = () => {

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {

      const isTokenValid = await introspect();
      if (!isTokenValid)
        return navigate("/login");

      const accessToken = getToken();
      if (!accessToken) return navigate("/login");

      try {
        const response = await fetch(`${CONFIG.API_GATEWAY}/identity/user/get-info`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Tài khoản không hợp lệ. Vui lòng kiểm tra lại");

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return userDetails?.roleId === "GiamDoc" ? (
    <TrangChu_GiamDocDieuHanh />
  ) : userDetails?.roleId === "BacSi" ? (
    <TrangChu_BacSi />
  ) : (
    <Error />
  );
};

export default Home;
