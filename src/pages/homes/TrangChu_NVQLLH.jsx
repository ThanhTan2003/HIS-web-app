import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white p-5 shadow h-screen fixed">
      <div className="logo flex justify-center items-center">
        <img src="logo.PNG" alt="Logo" className="w-full" />
      </div>
      <hr className="my-5" />
      <div>
      <h3 className="text-blue-800 mt-5 text-lg font-bold">THANH TÂN</h3>
      <p className="text-gray-800">Quản lý lịch khám bệnh</p>
      </div>
        <hr className="my-5" />      
        <ul className="menu space-y-1">
            <li className="text-blue-900 cursor-pointer font-bold bg-blue-50 p-3 rounded hover:bg-blue-100 hover:text-blue-800">Trang chủ</li>
            <li className="text-blue-900 cursor-pointer font-bold p-3 rounded hover:bg-blue-100 hover:text-blue-500">Lịch làm việc</li>
            <li className="text-blue-900 cursor-pointer font-bold p-3 rounded hover:bg-blue-100 hover:text-blue-500">Lịch hẹn</li>
            </ul>
      <div className="logo mt-10">
        <button className="bg-blue-500 text-white py-2 px-4 w-full rounded">Đăng xuất</button>
      </div>
    </div>
  );
};

const MainContent = () => {
  return (
    <div className="ml-72 p-5">
      {/* Nội dung chính sẽ ở đây */}
      <h1>XX</h1>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex  bg-[#f4f5f7] min-h-screen">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default Dashboard;