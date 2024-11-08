import React, { useState, useEffect } from 'react';
import { Route, Routes, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ThongTinNgayKham from '../ThongTinNgayKham';
import NotFound from '../../../NotFound';


const tabMenu = [
  { id: '2', name: "Thứ hai" },
  { id: '3', name: "Thứ ba" },
  { id: '4', name: "Thứ tư" },
  { id: '5', name: "Thứ năm" },
  { id: '6', name: "Thứ sáu" },
  { id: '7', name: "Thứ bảy" },
  { id: 'CN', name: "Chủ nhật" },
]

const Menu = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();
  return (
    <div>
  <ul className="flex flex-wrap dark:border-gray-700 font-bold user-select-none bg-gray-100">
    {
      tabMenu.map((tab, index) => (
        <li
          className={`mr-4 inline-block ${
            tab.id === selectedTab
              ? 'bg-white text-blue-600 py-2 px-6 text-center border border-blue-600  dark:bg-gray-800 dark:text-blue-500'
              : 'text-gray-700 hover:text-gray-800 hover:bg-gray-50 py-2 px-6 text-center dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
          }`}
          key={index}
          onClick={() => {
            setSelectedTab(tab.id);
            navigate(`/lich-kham-benh/lich-kham/${tab.id}`);
          }}
        >
          {tab.name}
        </li>
      ))
    }
  </ul>
</div>
  )
}

const Content = () => {
  return (
    <div className='pt-2'>
      <Outlet />
    </div>
  )
}

export default function LichKham() {
  const [selectedTab, setSelectedTab] = useState('2');
  const location = useLocation();

  // Cập nhật selectedTab khi URL thay đổi
    useEffect(() => {
        const currentTab = tabMenu.find(tab => `/lich-kham-benh/lich-kham/${tab.id}` === location.pathname);
        if (currentTab) {
            setSelectedTab(currentTab.id);
        }
    }, [location]);
  return (
    <div className=" pb-4 pl-2 pr-2">
      <Menu selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      <Content />
    </div>
  )
}
