import React, { useEffect, useState } from 'react';

import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleRight, faRotate } from '@fortawesome/free-solid-svg-icons'
import { CONFIG } from '../../configurations/configuration';


function DanhSach() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const { appointmentId } = useParams();



  // Hàm lấy thông tin người dùng và danh sách bác sĩ
  const getAppointments = async () => {
    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/his/appointment/get-all?page=${currentPage}&size=${pageSize}`,
        {
          method: "GET"
        }
      );

      console.log("Lấy danh sách lịch hẹn")

      const data = await response.json();
      setAppointments(data.data || []);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setPageSize(data.pageSize);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {

    }
  };

  useEffect(() => {
    getAppointments();
  }, [navigate, currentPage, pageSize]);

  // Hàm để tạo số trang hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxDisplayPages = 4;

    if (currentPage > 5) {
      pageNumbers.push(1);
      if (currentPage > 6) {
        pageNumbers.push('...');
      }
    }

    for (let i = currentPage - maxDisplayPages; i <= currentPage + maxDisplayPages; i++) {
      if (i > 0 && i <= totalPages) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - maxDisplayPages - 1) {
      pageNumbers.push('...');
    }

    if (currentPage < totalPages - maxDisplayPages) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const syncAppointments = async () => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/his/appointment/sync`, {
        method: "GET",
      });

      if (response.ok) {
        console.log("Đồng bộ dữ liệu thành công!");
        getAppointments(); // Gọi lại API để cập nhật danh sách
      } else {
        console.error("Lỗi khi đồng bộ dữ liệu:", await response.text());
      }
    } catch (error) {
      console.error("Lỗi kết nối khi đồng bộ dữ liệu:", error);
    }
  };

  // Hàm chuyển đổi chuỗi tiếng Việt thành chuỗi không dấu
  const removeVietnameseTones = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  return (
    <div>
      {!appointmentId && (
        <>
          <br></br>
          <div className="flex justify-between items-center mb-2">
  <div className="flex items-center space-x-2">
    {/* Nút Đồng bộ dữ liệu */}
    <button
      onClick={syncAppointments}
      className="bg-sky-600 text-white py-2 px-4 rounded font-bold hover:bg-sky-700"
      title='Đồng bộ dữ liệu với hệ thống quản lý lịch hẹn'
    >
      Đồng bộ dữ liệu
      &nbsp;<FontAwesomeIcon icon={faRotate} />
    </button>

    {/* Nút Tải lại danh sách */}
    <button
      onClick={getAppointments}
      className="ml-2 border border-sky-600 text-sky-600 py-2 px-4 rounded font-bold hover:bg-sky-100 transition"
      title='Tải lại danh sách'
    >
      Tải lại danh sách
      &nbsp;<FontAwesomeIcon icon={faRotate} />
    </button>
  </div>

  <div className="flex items-center space-x-2">
    <button
      type="button"
      className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 flex items-center"
    >
      <p className='font-semibold'>Quét mã vạch</p> &nbsp;
      <img
        src='/icons/icon-scan-qr-code.png'
        title="Quét mã vạch"
        className="w-6 h-6 ml-2"
      />
    </button>
    <select
      className="border p-2 rounded border-blue-300"
    >
      <option value="">Tất cả trạng thái</option>
    </select>

    <input
      type="text"
      placeholder="Nhập mã lịch hẹn"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          getAppointments(); // Tìm kiếm khi nhấn Enter
        }
      }}
      className="border p-2 rounded w-64 border-blue-300"
    />
    <button
      type="button"
      onClick={getAppointments}
      className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700"
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} />
    </button>
  </div>
</div>

          <br />

          {/* Bảng danh sách */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
              <thead>
                <tr className="bg-sky-600 text-white">
                  <th className="border border-gray-200 p-3 text-center">STT</th>
                  <th className="border border-gray-200 p-3 text-left">Mã lịch hẹn</th>
                  <th className="border border-gray-200 p-3 text-left">Tên dịch vụ</th>
                  <th className="border border-gray-200 p-3 text-left">Bác sĩ</th>
                  <th className="border border-gray-200 p-3 text-left whitespace-nowrap">Ngày khám</th>
                  <th className="border border-gray-200 p-3 text-left">Trạng thái</th>
                  <th className="border border-gray-200 p-3 text-center"></th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                      <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                      <td className="border border-gray-200 p-2 text-zinc-700 whitespace-nowrap"><b>{appointment.id}</b></td>
                      <td className="border border-gray-200 p-2">{appointment.service.name}</td>
                      <td className="border border-gray-200 p-2">{appointment.doctor.fullName}</td>
                      <td className="border border-gray-200 p-2">{appointment.dateName}</td>
                      <td
                        className={`border border-gray-200 p-2 whitespace-nowrap ${appointment.status === "Đã nhập kết quả"
                            ? "text-green-700 font-semibold"
                            : "text-red-600 font-semibold"
                          }`}
                      >
                        {appointment.status}
                      </td>
                      <td className="border border-gray-200 p-2 text-center whitespace-nowrap">
                        <Link to={`/ket-qua-kham-benh/chi-tiet/${appointment.id}`}>
                          <button
                            className="bg-white text-cyan-600 border border-cyan-600 px-3 py-1 rounded-md hover:bg-cyan-100 transition duration-75 w-full"
                          >
                            Chi tiết
                          </button>
                        </Link>
                      </td>


                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            {/* Bên trái: Tổng số bác sĩ */}
            <div className="text-gray-600">
              Tổng số lịch hẹn: <b>{totalElements}</b>
            </div>

            {/* Bên phải: Trang hiện tại / Tổng số trang */}
            <div className="text-gray-600">
              Trang {currentPage} / {totalPages}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {getPageNumbers().map((pageNumber, index) =>
              typeof pageNumber === 'number' ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(pageNumber)}
                  style={currentPage === pageNumber ? { color: '#fff', backgroundColor: '#333' } : {}}
                  className="p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200"
                >
                  {pageNumber}
                </button>
              ) : (
                <span key={index} style={{ margin: '0 5px' }}>...</span>
              )
            )}
          </div>
        </>
      )
      }
      <Outlet />
    </div>

  );
}

export default DanhSach;