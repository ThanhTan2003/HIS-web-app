import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import NotFound from '../NotFound'
import BacSi from '../menu/giamDocDieuHanh/BacSi';
import BenhNhan from '../menu/giamDocDieuHanh/BenhNhan';
import DichVu from '../menu/giamDocDieuHanh/DichVu';
import HoSoBenhAn from '../menu/giamDocDieuHanh/HoSoBenhAn';
import KetQuaKhamBenh from '../KetQuaKhamBenh/KetQuaKhamBenh';
import PhongKham from '../menu/giamDocDieuHanh/PhongKham';
import TrangChu from '../menu/giamDocDieuHanh/TrangChu';
import ChiTietLichKham from '../KetQuaKhamBenh/ChiTietLichKham';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../services/authenticationService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faHospitalUser, faSuitcaseMedical, faFileMedical, faCalendarDays, faFolderOpen, faUserGear, faUserNurse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const menuItems = [
  { id: 'BacSi', label: 'Bác sĩ', icon: faUserNurse, path: 'bac-si' },
  { id: 'PhongKham', label: 'Phòng khám', icon: faSuitcaseMedical, path: 'phong-kham' },
  { id: 'DichVu', label: 'Dịch vụ', icon: faFileMedical, path: 'dich-vu' },
  { id: 'KetQuaKhamBenh', label: 'Kết quả khám bệnh', icon: faCalendarDays, path: 'ket-qua-kham-benh' },
  { id: 'BenhNhan', label: 'Bệnh nhân', icon: faHospitalUser, path: 'benh-nhan' },
];

// Sidebar Component
const Sidebar = ({ selectedPage, setSelectedPage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white p-5 shadow h-screen fixed">
      <div className="logo flex justify-center items-center">
        <img src="/logo.PNG" alt="Logo" className="w-full" />
      </div>
      <hr className="my-5" />
      <div>
        <h3 className="text-blue-800 mt-5 text-lg font-bold">THANH TÂN</h3>
        <p className="text-gray-800">Giám đốc điều hành</p>
      </div>
      <hr className="my-5" />
      <ul className="menu space-y-1">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`cursor-pointer font-bold p-3 rounded ${selectedPage === item.id ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
            onClick={() => {
              setSelectedPage(item.id);
              navigate(`/${item.path}`);
            }}
          >
            <FontAwesomeIcon icon={item.icon} /> &nbsp; {item.label}
          </li>
        ))}
      </ul>
      <div className="logo mt-10">
        <button
          className="bg-blue-500 text-white py-2 px-4 w-full rounded"
          onClick={handleLogout}
        >
          <b>Đăng xuất</b> &nbsp;<FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  return (
    <div className="ml-64 w-full px-5 pb-5">
      <Routes>
        <Route index element={<TrangChu />} />
        <Route path="/bac-si/*" element={<BacSi />} />
        <Route path="/phong-kham/*" element={<PhongKham />} />
        <Route path="/dich-vu/*" element={<DichVu />} />
        <Route path="/ket-qua-kham-benh" element={<KetQuaKhamBenh />}>
          <Route path="chi-tiet/:appointmentId" element={<ChiTietLichKham />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/benh-nhan/*" element={<BenhNhan />} />
        <Route path="/ho-so-benh-an/*" element={<HoSoBenhAn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Outlet />
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("TrangChu");

  const location = useLocation();

  // Cập nhật selectedPage khi URL thay đổi
  useEffect(() => {
    const currentPage = menuItems.find(item => `/${item.path}` === location.pathname);
    if (currentPage) {
      setSelectedPage(currentPage.id);
    }
  }, [location]);

  return (
    <div className="flex bg-[#f4f5f7] min-h-screen">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <MainContent />
    </div>
  );
};


export default Dashboard;
