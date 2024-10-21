import React, { useState } from 'react';
import {Routes, Route} from 'react-router-dom'
import BacSi from '../menu/quanTriVien/BacSi';
import BenhNhan from '../menu/quanTriVien/BenhNhan';
import DichVu from '../menu/quanTriVien/DichVu';
import HoSoBenhAn from '../menu/quanTriVien/HoSoBenhAn';
import LichKhamBenh from '../menu/quanTriVien/LichKhamBenh';
import PhongKham from '../menu/quanTriVien/PhongKham';
import QuanLyTaiKhoan from '../menu/quanTriVien/QuanLyTaiKhoan';
import TrangChu from '../menu/quanTriVien/TrangChu';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../services/authenticationService'; // Nhập hàm đăng xuất

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faHospitalUser, faSuitcaseMedical, faFileMedical, faCalendarDays, faFolderOpen, faUserGear, faUserNurse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

// Sidebar Component
const Sidebar = ({ selectedPage, setSelectedPage }) => {
  const navigate = useNavigate();

  // Hàm đăng xuất
  const handleLogout = () => {
    logOut(); // Gọi hàm logOut để đăng xuất
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="w-64 bg-white p-5 shadow h-screen fixed">
      <div className="logo flex justify-center items-center">
        <img src="logo.PNG" alt="Logo" className="w-full" />
      </div>
      <hr className="my-5" />
      <div>
        <h3 className="text-blue-800 mt-5 text-lg font-bold">THANH TÂN</h3>
        <p className="text-gray-800">Quản trị viên hệ thống</p>
      </div>
      <hr className="my-5" />
      <ul className="menu space-y-1">
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "TrangChu" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("TrangChu")}
        >
          <FontAwesomeIcon icon={faHouse} />&nbsp;
          Trang chủ
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "BacSi" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("BacSi")}
        >
          <FontAwesomeIcon icon={faUserNurse} />&nbsp;
          Bác sĩ
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "PhongKham" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("PhongKham")}
        >
          <FontAwesomeIcon icon={faSuitcaseMedical} />&nbsp;
          Phòng khám
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "DichVu" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("DichVu")}
        >
          <FontAwesomeIcon icon={faFileMedical} /> &nbsp;
          Dịch vụ
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "LichKhamBenh" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("LichKhamBenh")}
        >
          <FontAwesomeIcon icon={faCalendarDays} />&nbsp;
          Lịch khám bệnh
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "BenhNhan" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("BenhNhan")}
        >
          <FontAwesomeIcon icon={faHospitalUser} />&nbsp;
          Bệnh nhân
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "HoSoBenhAn" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("HoSoBenhAn")}
        >
          <FontAwesomeIcon icon={faFolderOpen} />&nbsp;
          Hồ sơ bệnh án
        </li>
        <li
          className={`cursor-pointer font-bold p-3 rounded ${selectedPage === "QuanLyTaiKhoan" ? 'bg-blue-50 text-blue-800' : 'text-blue-900 hover:bg-blue-100 hover:text-blue-500'}`}
          onClick={() => setSelectedPage("QuanLyTaiKhoan")}
        >
          <FontAwesomeIcon icon={faUserGear} />&nbsp;
          Quản lý tài khoản
        </li>
      </ul>
      <div className="logo mt-10">
        <button
          className="bg-blue-500 text-white py-2 px-4 w-full rounded"
          onClick={handleLogout} // Thêm sự kiện đăng xuất vào nút
        >
          <b>Đăng xuất</b> &nbsp;<FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = ({ selectedPage }) => {
  return (
    <div className="ml-64 w-full p-5">
      {/* Hiển thị nội dung dựa trên lựa chọn menu */}
      {selectedPage === "TrangChu" && <TrangChu />}
      {selectedPage === "BacSi" && <BacSi />}
      {selectedPage === "PhongKham" && <PhongKham />}
      {selectedPage === "DichVu" && <DichVu />}
      {selectedPage === "LichKhamBenh" && <LichKhamBenh />}
      {selectedPage === "BenhNhan" && <BenhNhan />}
      {selectedPage === "HoSoBenhAn" && <HoSoBenhAn />}
      {selectedPage === "QuanLyTaiKhoan" && <QuanLyTaiKhoan />}
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("TrangChu"); // Mặc định hiển thị Trang Chủ

  return (
    <div className="flex bg-[#f4f5f7] min-h-screen">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <MainContent selectedPage={selectedPage} />
    </div>
  );
};

export default Dashboard;
