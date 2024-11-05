import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../services/localStorageService';
import { CONFIG } from '../../../configurations/configuration';
import { faXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const ThongTinTaiKhoanHeThong = ({ isOpen, onClose, userName }) => {

  console.log(userName)

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doctor, setDoctor] = useState(null);

  const getDoctorDetails = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/doctor/id/${user.doctorId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        console.error('Unauthorized: Token invalid or expired');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setDoctor(data);
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      
    }
  };

  const getUserDetails = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/identity/user/user-name/${userName}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUser(data || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // useEffect(() => {
  //   const accessToken = getToken();
  //   if (!accessToken) {
  //     navigate('/login');
  //   } else {
  //     getUserDetails(accessToken);
  //     getDoctorDetails(accessToken);
  //     window.scrollTo(0, 0);
  //   }
  // }, [user]); // Lỗi

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate('/login');
    } else {
      getUserDetails(accessToken);  // Chỉ gọi một lần cho `user`
      window.scrollTo(0, 0);
    }
  }, [userName]);
  
  useEffect(() => {
    if (user?.roleId === 'BacSi' && user?.doctorId) {
      const accessToken = getToken();
      getDoctorDetails(accessToken);
    }
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 backdrop-blur-none transition-opacity duration-300 ease-in-out opacity-100">
      <div className="bg-white rounded-lg shadow-lg w-2/5">
        {/* Tiêu đề với nền xanh */}
        <div className="bg-sky-600 text-white p-3 px-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold"> <FontAwesomeIcon icon={faCircleInfo} /> &nbsp; Thông tin tài khoản</h2>
          <button
            onClick={onClose}
            className="text-sky-600 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition duration-200 ease-in-out"
            title='Đóng'
            style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6">
          <div className="grid grid-cols-[40%,60%] gap-y-4">
            <p className="text-gray-700 font-bold user-select-none">Tên tài khoản:</p>
            <p className="text-gray-900">{user?.userName || ''}</p>

            <p className="font-bold text-gray-700 user-select-none">Tên người dùng:</p>
            <p className="text-gray-900">{user?.accountName || ''}</p>

            {user?.roleId === 'BacSi' && (
              <>
                <p className="font-bold text-gray-700 user-select-none">Mã BS:</p>
                <p className="text-gray-900">{doctor?.id || '...'}</p>
              </>
            )}

            <p className="font-bold text-gray-700 user-select-none">Loại tài khoản:</p>
            <p className="text-gray-900">{user?.roleName || ''}</p>

            <p className="font-bold text-gray-700 user-select-none">Tình trạng:</p>
            <p className="text-gray-900">{user?.status || ''}</p>

            <p className="font-bold text-gray-700 user-select-none">Truy cập gần nhất:</p>
            <p className="text-gray-900">{user?.lastAccessTime || '...'}</p>
          </div>
        </div>

        {/* Nút OK */}
        <div className="flex justify-end p-4 border-t">
          <button onClick={onClose} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            <p className='font-bold'>OK</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThongTinTaiKhoanHeThong;
