import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../services/localStorageService';
import { CONFIG } from '../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

export default function ThongTinChuyenKhoa() {
  const navigate = useNavigate();
  const { specialtyId } = useParams();

  const [specialty, setSpecialty] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [services, setServices] = useState([]);

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken)
      navigate('/login');

    getSpecialtyDetails(accessToken)
    getServicesBySpecialtyId(accessToken)

    // Cuộn trang lên đầu khi component được render
    window.scrollTo(0, 0);
  }, [navigate, specialtyId])

  const getSpecialtyDetails = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/doctor/specialty/id/${specialtyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSpecialty(data);
      }

    }
    catch (error) {
      console.log(error);
    }
  }

  const getServicesBySpecialtyId = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/medical/service/specialty/${specialtyId}?page=${currentPage}&size=${pageSize}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setServices(data.data || [])
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setPageSize(data.pageSize);
        setTotalElements(data.totalElements);
      }

    }
    catch (error) {
      console.log(error);
    }
  }

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

  return (
    <>
      {
        specialty ?
          (
            <div className="pt-2 pb-4 pl-4 pr-2">
              <div className="flex justify-start">
                <button
                  onClick={() => navigate("/bac-si/chuyen-khoa")}
                  className="py-1 px-3 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
              </div>
              <br />

              {/* Khung thông tin chuyên khoa với tiêu đề trên cạnh trên */}
              <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                {/* Tiêu đề trên cạnh trên */}
                <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                  Thông tin chuyên khoa:
                </div>
                {/* Nội dung khung */}
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-lg mb-2">
                    <strong>Mã chuyên khoa:</strong> {specialty.specialtyId}
                  </p>
                  <p className="text-lg mb-2">
                    <strong>Tên chuyên khoa:</strong> {specialty.specialtyName}
                  </p>
                  <p className="text-lg mb-2 text-justify">
                    <strong>Mô tả:</strong> {specialty.description}
                  </p>
                  <br />
                  <img
                    src={`https://barcode.tec-it.com/barcode.ashx?data=${specialty.specialtyId}&code=Code128&dpi=96`}
                    alt="Mã vạch lịch hẹn"
                    className="mb-4 object-cover"
                  />
                </div>
              </div>
              <br />
              <hr />
              <br />

              <h1 className="text-2xl font-bold mb-4 text-blue-900">
                Danh sách dịch vụ khám chữa bệnh
              </h1>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                  <thead>
                    <tr className="bg-sky-600 text-white">
                      <th className="border border-gray-200 p-3 text-center">STT</th>
                      <th className="border border-gray-200 p-3 text-left">Tên dịch vụ</th>
                      <th className="border border-gray-200 p-3 text-left">Phân loại</th>
                      <th className="border border-gray-200 p-3 text-left">Tình trạng</th>
                      <th className="border border-gray-200 p-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      services.length > 0 ? (
                        services.map((service, index) => (
                          <tr key={service.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                            <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                            <td className="border border-gray-200 p-2">{service.name}</td>
                            <td className="border border-gray-200 p-2">{service.serviceType.name}</td>
                            <td className="border border-gray-200 p-2">{service.status}</td>
                            <td className="border border-gray-200 p-2 text-center">

                              <button
                                className="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700 transition duration-75"
                              // onClick={() => navigate(`/bac-si/danh-sach/${doctor.id}`)} // Điều hướng đến trang chi tiết bác sĩ
                              >
                                Chi tiết
                              </button>

                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center p-4">Không có dữ liệu</td>
                        </tr>
                      )
                    }

                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                {/* Bên trái: Tổng số bác sĩ */}
                <div className="text-gray-600">
                  Tổng số dịch vụ: <b>{totalElements}</b>
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
            </div>
          ) : (
            <div className="text-center text-xl text-gray-500">
              Không tìm thấy thông tin bác sĩ.
            </div>
          )
      }
    </>
  )
}
