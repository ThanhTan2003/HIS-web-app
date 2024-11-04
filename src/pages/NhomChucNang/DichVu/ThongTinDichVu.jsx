import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../services/localStorageService';
import { CONFIG } from '../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

export default function ThongTinDichVu() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [service, setService] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);


  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken)
      navigate('/login');

    getServiceDetails(accessToken)
    
    // Cuộn trang lên đầu khi component được render
    window.scrollTo(0, 0);
  }, [navigate, serviceId])

  const getServiceDetails = async (accessToken) => {
    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/medical/service/id/${serviceId}`, {
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
        setService(data);
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
        service ?
          (
            <div className="p-4">
              <div className='text-justify'>
                <div className="flex justify-start">
                  <button
                    onClick={() => navigate("/dich-vu/danh-sach")}
                    className=" py-1 px-3 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                  >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </button>
                </div>
                <br />
                <h1 className="text-2xl font-bold mb-4 text-blue-900">Thông tin dịch vụ:</h1>

                {/* Tạo grid với 2 cột và khoảng cách giữa các mục */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                <p className="text-lg">
                  <strong>Mã dịch vụ:</strong> {service.id}
                </p>
                <p className="text-lg">
                  <strong>Tên dịch vụ:</strong> {service.name}
                </p>
                <p className="text-lg">
                  <strong>Chuyên khoa:</strong> {service.specialtyId ? service.specialtyId : '...'}
                </p>
                <p className="text-lg">
                  <strong>Phân loại:</strong> {service.serviceType.name ? service.serviceType.name : '...'}
                </p>
                <p className="text-lg">
                  <strong>Phí khám bệnh:</strong> {service.unitPrice.toLocaleString('vi-VN')}
                </p>
                <p className="text-lg">
                  <strong>Tình trạng:</strong> {service.status}
                </p>
                <p className="text-lg col-span-2">
                  <strong>Mô tả:</strong> {service.description}
                </p>
              </div>

              </div>
              <img
                src={`https://barcode.tec-it.com/barcode.ashx?data=${serviceId}&code=Code128&dpi=96`}
                alt="Mã vạch lịch hẹn"
                className="mb-4 object-cover"
              />
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
                      <th className="border border-gray-200 p-3 text-left">Bác sĩ phụ trách</th>
                      <th className="border border-gray-200 p-3 text-left">Thứ</th>
                      <th className="border border-gray-200 p-3 text-left">Buổi</th>
                      <th className="border border-gray-200 p-3 text-left">Khung giờ</th>
                      <th className="border border-gray-200 p-3 text-left">Trạng thái</th>
                      <th className="border border-gray-200 p-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                  <tr>
                          <td colSpan="7" className="text-center p-4">Không có dữ liệu</td>
                        </tr>

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
