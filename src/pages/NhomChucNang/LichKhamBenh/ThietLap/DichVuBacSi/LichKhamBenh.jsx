import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from '../../../../../services/localStorageService';
import { CONFIG } from '../../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  } from '@fortawesome/free-solid-svg-icons';

function LichKhamBenh() {
    const tabMenu = [
        { id: '2', name: "Thứ hai" },
        { id: '3', name: "Thứ ba" },
        { id: '4', name: "Thứ tư" },
        { id: '5', name: "Thứ năm" },
        { id: '6', name: "Thứ sáu" },
        { id: '7', name: "Thứ bảy" },
        { id: 'CN', name: "Chủ nhật" },
    ]

    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [selectedTab, setSelectedTab] = useState('2');
    const location = useLocation();

    return (
        <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
            <h1 className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                LỊCH KHÁM BỆNH
            </h1>

            <div className='pt-4'>
                {/* <div className='pb-4 text-right'>
                    <button
                        type="button"
                        //   onClick={handleAddServiceSpecialty} // Hàm xử lý khi bấm vào "Thêm dịch vụ thuộc chuyên khoa"
                        className="bg-sky-700 text-white py-2 px-4 rounded hover:bg-sky-800 font-semibold"
                    >
                        Xuất tệp excel lịch khám &nbsp; <FontAwesomeIcon icon={faFileLines} />
                    </button>
                </div> */}
                <ul className="flex flex-wrap dark:border-gray-700 font-bold user-select-none bg-gray-100">
                    {
                        tabMenu.map((tab, index) => (
                            <li
                                className={`mr-4 inline-block ${tab.id === selectedTab
                                    ? 'bg-white text-blue-600 py-2 px-6 text-center border border-blue-600  dark:bg-gray-800 dark:text-blue-500'
                                    : 'text-gray-700 hover:text-gray-800 hover:bg-gray-50 py-2 px-6 text-center dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                                    }`}
                                key={index}
                                onClick={() => {
                                    setSelectedTab(tab.id);
                                    navigate(`/lich-kham-benh/thiet-lap/${doctorId}/${tab.id}`);
                                }}
                            >
                                {tab.name}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className='pt-2'>
                <Outlet />
            </div>
        </div>
    )
}

export default LichKhamBenh;