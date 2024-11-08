import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from '../../../../../services/localStorageService';
import { CONFIG } from '../../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faStethoscope, faVialVirus, faBan } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ThemDichVuThuocChuyenKhoa from './DanhSachDichVu/ThemDichVuThuocChuyeKhoa'
import ThemDichVuNgoaiChuyenKhoa from './DanhSachDichVu/ThemDichVuNgoaiChuyenKhoa'

function DanhSachDichVu() {
    const navigate = useNavigate();

    const [doctorServices, setDoctorServices] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [key, setKey] = useState(0);

    const { doctorId } = useParams();

    const [showModalThemDVThuocChuyenKhoa, setShowModalThemDVThuocChuyenKhoa] = useState(false);
    const [showModalThemDVNgoaiChuyenKhoa, setShowModalThemDVNgoaiChuyenKhoa] = useState(false);


    const openModalThemDVThuocChuyenKhoa = () => {
        setShowModalThemDVThuocChuyenKhoa(true);
    };

    const closeModalThemDVThuocChuyenKhoa = () => {
        setShowModalThemDVThuocChuyenKhoa(false);
    };

    const openModalThemDVNgoaiChuyenKhoa = () => {
        setShowModalThemDVNgoaiChuyenKhoa(true);
    };

    const closeModalThemDVNgoaiChuyenKhoa = () => {
        setShowModalThemDVNgoaiChuyenKhoa(false);
    };

    const showSuccess = async (success) => {
        console.log(success)
        toast.success(success, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

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

    //Hàm lấy danh sách dịch vụ bác sĩ
    const getDoctorServices = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/medical/doctor-service/doctor-id/${doctorId}?page=${currentPage}&size=${pageSize}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.status === 401) {
                console.error("Unauthorized: Token invalid or expired");
                navigate("/login");
                return;
            }
            const data = await response.json();
            setDoctorServices(data.data || []);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getDoctorServices(accessToken);
            //window.scrollTo(0, 0);
        }
    }, [navigate, currentPage, pageSize, keyword, showModalThemDVThuocChuyenKhoa, showModalThemDVNgoaiChuyenKhoa]);


    // Hàm chuyển đổi chuỗi tiếng Việt thành chuỗi không dấu
    const removeVietnameseTones = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    return (
        <div className='border border-blue-600 rounded-lg shadow-md relative p-4'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <h1 className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                DANH SÁCH DỊCH VỤ
            </h1>
            <div className="flex justify-between items-center mb-2 pt-4">
                {/* Nút bên trái */}
                <div className="flex items-center space-x-2 font-semibold">
                    <button
                        type="button"
                        onClick={openModalThemDVThuocChuyenKhoa} // Hàm xử lý khi bấm vào "Thêm dịch vụ thuộc chuyên khoa"
                        className="bg-sky-700 text-white py-2 px-4 rounded hover:bg-sky-800"
                    >
                        Thêm dịch vụ thuộc chuyên khoa &nbsp; <FontAwesomeIcon icon={faStethoscope} />
                    </button>

                    <button
                        type="button"
                        onClick={openModalThemDVNgoaiChuyenKhoa} // Hàm xử lý khi bấm vào "Thêm dịch vụ ngoài chuyên khoa"
                        className="bg-sky-700 text-white py-2 px-4 rounded hover:bg-sky-800"
                    >
                        Thêm dịch vụ ngoài chuyên khoa &nbsp; <FontAwesomeIcon icon={faVialVirus} />
                    </button>
                </div>

                {/* Ô tìm kiếm và nút tìm kiếm ở bên phải */}
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Nhập từ khóa tìm kiếm"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // handleSearch(); // Thực hiện tìm kiếm khi nhấn Enter
                            }
                        }}
                        className="border p-2 rounded w-64 border-blue-300"
                    />

                    <button
                        type="button"
                        // onClick={handleSearch}
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
                            <th className="border border-gray-200 p-3 text-left">Tên dịch vụ</th>
                            <th className="border border-gray-200 p-3 text-left">Chuyên khoa</th>
                            <th className="border border-gray-200 p-3 text-left">Phân loại</th>
                            <th className="border border-gray-200 p-3 text-left">Tình trạng</th>
                            <th className="border border-gray-200 p-3 text-center"></th>
                        </tr>
                    </thead>
                    <tbody key={key}>
                        {doctorServices.length > 0 ? (
                            doctorServices.map((doctorService, index) => (
                                <tr key={doctorService.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                    <td className="border border-gray-200 p-2 text-center">
                                        {index + 1 + (currentPage - 1) * pageSize}
                                    </td>
                                    <td className="border border-gray-200 p-2 text-zinc-700 font-semibold">
                                        {doctorService.service?.name || '...'}
                                    </td>
                                    <td className="border border-gray-200 p-2 text-zinc-700">
                                        {doctorService.specialtyResponse?.specialtyName || '...'}
                                    </td>
                                    <td className="border border-gray-200 p-2 text-zinc-700">
                                        {doctorService.service?.serviceType?.name || '...'}
                                    </td>
                                    <td className="border border-gray-200 p-2 text-zinc-700">
                                        {/* Combobox để chọn tình trạng dịch vụ */}
                                        <select
                                            value={doctorService.status}
                                            // onChange={(e) => {
                                            //     const updatedStatus = e.target.value;
                                            //     // Hàm xử lý thay đổi trạng thái
                                            //     handleStatusChange(doctorService.id, updatedStatus);
                                            // }}
                                            className="border border-blue-300 rounded p-2 w-full"
                                        >
                                            <option value="Đang hoạt động">Đang hoạt động</option>
                                            <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                                        </select>
                                    </td>
                                    <td className="border border-gray-200 p-2 text-center">
                                        <button
                                            className="bg-white text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition duration-75 border border-red-500"
                                        >
                                            Xóa &nbsp;<FontAwesomeIcon icon={faBan} />
                                        </button>
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

            {showModalThemDVThuocChuyenKhoa &&
                <ThemDichVuThuocChuyenKhoa
                    isOpen={showModalThemDVThuocChuyenKhoa}
                    onClose={closeModalThemDVThuocChuyenKhoa}
                    onSuccess={showSuccess}
                />
            }
            {showModalThemDVNgoaiChuyenKhoa &&
                <ThemDichVuNgoaiChuyenKhoa
                    isOpen={showModalThemDVNgoaiChuyenKhoa}
                    onClose={closeModalThemDVNgoaiChuyenKhoa}
                    onSuccess={showSuccess}
                />
            }
        </div>
    );
}

export default DanhSachDichVu
