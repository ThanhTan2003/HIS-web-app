import React, { useState } from 'react';
import DanhSach from '../../BacSi/DanhSach';
import ThongKe from '../../BacSi/ThongKe';
import ChuyenKhoa from '../../BacSi/ChuyenKhoa';
import NghiPhep from '../../BacSi/NghiPhep';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faUsers, faDna, faUserDoctor } from '@fortawesome/free-solid-svg-icons'

const tab = ['ThongKe', 'DanhSach', 'ChuyenKhoa', 'NghiPhep']
const name = ['Thống kê', 'Danh sách', 'Chuyên khoa', 'Nghỉ phép']
const icons = [faChartSimple, faUsers, faDna, faUserDoctor];
const components = {
    ThongKe: ThongKe,
    DanhSach: DanhSach,
    ChuyenKhoa: ChuyenKhoa,
    NghiPhep: NghiPhep
  };
function BacSi() {
    const [type, setType] = useState('ThongKe')
    const SelectedComponent = components[type];

    console.log(SelectedComponent)

    return (
        <div className="w-full min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-2 px-3 py-3 w-full rounded text-left font-bold">
                <h1>QUẢN LÝ THÔNG TIN BÁC SĨ</h1>
            </div>

            {/* Tab menu */}
            <div className="bg-white flex justify-start space-x-4 mt-4 w-full rounded text-gray-700">
                {
                    tab.map((tab, index) =>(
                        <button 
                            onClick={() => setType(tab)}
                            key={index} 
                            className={`py-2 px-4 font-bold rounded ${tab === type ? 'text-blue-600 border border-blue-600 hover:bg-slate-100' : 'hover:bg-blue-700 hover:text-white'}`}>
                            <FontAwesomeIcon icon={icons[index]} /> &nbsp;&nbsp;
                            {name[index]}
                        </button>
                    ))
                }
                
            </div>

            {/* <div className="bg-white flex justify-start space-x-4 mt-4 w-full rounded">
                <button 
                    onClick={() => setType('ThongKe')}
                    key='ThongKe' 
                    className={`py-2 px-4 font-bold rounded ${'ThongKe' === type ? 'text-blue-600 border border-blue-600 hover:bg-slate-100' : 'hover:bg-blue-700 hover:text-white'}`}
                >
                    Thống kê
                </button>
                <button 
                    onClick={() => setType('DanhSach')}
                    key='DanhSach' 
                    className={`py-2 px-4 font-bold rounded ${tab === type ? 'text-blue-600 border border-blue-600 hover:bg-slate-100' : 'hover:bg-blue-700 hover:text-white'}`}
                >
                    Danh sách
                </button>
            </div> */}
            
            {/* Content */}
            <div className="flex-1 bg-white mt-4 p-4 rounded shadow w-full">
                <SelectedComponent />
            </div>
        </div>
    );
}

export default BacSi;
