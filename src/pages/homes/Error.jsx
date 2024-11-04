import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-blue-600">Lỗi</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-4">Trang không tồn tại!</p>
      <p className="text-gray-600 mt-2 mb-8">
        Rất tiếc, trang bạn đang truy cập không tồn tại hoặc đã bị thay đổi. Vui lòng kiểm tra lại!
      </p>

      <button
        onClick={() => navigate('/login')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 flex items-center"
      >
        Quay lại đăng nhập
      </button>
      
      <br /><br /><br /><br /><br /><br />
    </div>
  );
}