import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate, faInfo } from '@fortawesome/free-solid-svg-icons'
import { CONFIG } from '../../configurations/configuration';

function DanhSach() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(0); 

    // State để lưu danh sách chuyên khoa
    const [specialties, setSpecialties] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState(""); // Lưu chuyên khoa đã chọn
    const [selectedStatus, setSelectedStatus] = useState(""); // Lưu trạng thái đã chọn

    // Hàm lấy thông tin người dùng và danh sách bác sĩ
    const getUserDetails = async (accessToken) => {
        try {
            setLoading(true);
            const response = await fetch(
              `${CONFIG.API_GATEWAY}/doctor/search?keyword=${keyword}&page=${currentPage}&size=${pageSize}&specialty=${selectedSpecialty}&status=${selectedStatus}`,
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
            setDoctors(data.data || []);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách chuyên khoa từ API
    const getSpecialties = async (accessToken) => {
        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/doctor/specialty/get-all?page=1&size=100`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setSpecialties(data.data || []);
        } catch (error) {
            console.error("Error fetching specialties:", error);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getUserDetails(accessToken); // Lấy thông tin người dùng và bác sĩ
            getSpecialties(accessToken); // Lấy danh sách chuyên khoa
        }
    }, [navigate, currentPage, pageSize, selectedSpecialty, selectedStatus]);

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

    // Khi nhấn nút tìm kiếm
    const handleSearch = () => {
        setCurrentPage(1);
        setKey(prevKey => prevKey + 1); 
        getUserDetails(getToken());
    };

    const convertStatus = (status) => {
        switch (status) {
            case "DangLamViec":
                return "Đang làm việc";
            case "NgungCongTac":
                return "Ngừng công tác";
            case "ChuyenCongTac":
                return "Chuyển công tác";
            default:
                return "Không rõ";
        }
    };

    return (
        <div style={{ padding: 20 }}>
            {loading ? (
                <div className="flex justify-center">
                    <div className="spinner"></div> {/* Sử dụng spinner đơn giản */}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <button 
                            className="bg-sky-600 text-white py-2 px-4 rounded font-bold hover:bg-sky-700"
                            title='Đồng bộ dữ liệu với hệ thống HIS'
                        >
                            Đồng bộ dữ liệu
                            &nbsp;<FontAwesomeIcon icon={faRotate} />
                        </button>

                        <div className="flex items-center space-x-2">
                            <select 
                                className="border p-2 rounded border-blue-300" 
                                value={selectedSpecialty}
                                onChange={(e) => setSelectedSpecialty(e.target.value)}
                            >
                                <option value="">Tất cả chuyên khoa</option>
                                {specialties.map(specialty => (
                                    <option key={specialty.specialtyId} value={specialty.specialtyId}>
                                        {specialty.specialtyName}
                                    </option>
                                ))}
                            </select>

                            {/* Thay đổi từ combobox "Học hàm/Học vị" thành "Trạng thái" */}
                            <select 
                                className="border p-2 rounded border-blue-300" 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="DangLamViec">Đang làm việc</option>
                                <option value="NgungCongTac">Ngừng công tác</option>
                                <option value="ChuyenCongTac">Chuyển công tác</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="border p-2 rounded w-64 border-blue-300"
                            />
                            <button 
                                type="button"
                                onClick={handleSearch}
                                className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700"
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>
                    </div>
                    {/* <select 
                        className="border p-2 rounded border-blue-300" 
                        value={pageSize}
                        onChange={(e) => setPageSize(parseInt(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select> */}
                    <br />

                    {/* Bảng danh sách */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    <th className="border border-gray-200 p-3 text-center">STT</th>
                                    <th className="border border-gray-200 p-3 text-left">Mã BS</th>
                                    <th className="border border-gray-200 p-3 text-left">HH/HV</th>
                                    <th className="border border-gray-200 p-3 text-left">Họ tên</th>
                                    <th className="border border-gray-200 p-3 text-left">Chuyên khoa</th>
                                    <th className="border border-gray-200 p-3 text-left">Tình trạng</th>
                                    <th className="border border-gray-200 p-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody key={key}>
                                {doctors.length > 0 ? (
                                    doctors.map((doctor, index) => (
                                        <tr key={doctor.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                            <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                                            <td className="border border-gray-200 p-2">{doctor.id}</td>
                                            <td className="border border-gray-200 p-2">{doctor.qualificationName}</td>
                                            <td className="border border-gray-200 p-2">{doctor.fullName}</td>

                                            <td className="border border-gray-200 p-2">
                                                {doctor.specialties && doctor.specialties.length > 0
                                                    ? doctor.specialties.map((specialty) => specialty.specialtyName).join(", ")
                                                    : "Không có chuyên khoa"}
                                            </td>

                                            <td className="border border-gray-200 p-2">{convertStatus(doctor.status)}</td>

                                            <td className="border border-gray-200 p-2 text-center">
                                                <button className="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700 transition duration-75">
                                                    Chi tiết 
                                                    {/* &nbsp;<FontAwesomeIcon icon={faInfo} /> */}
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
                            Tổng số bác sĩ: <b>{totalElements}</b>
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
            )}
        </div>
    );
}

export default DanhSach;
