import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../services/localStorageService";
import { CONFIG } from '../../../configurations/configuration';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faRotate, faInfo } from '@fortawesome/free-solid-svg-icons'

function DanhSachChuyenKhoa() {
    const navigate = useNavigate();

    const [specialties, setSpecialties] = useState([]);

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");

    const { specialtyId } = useParams();

    // Hàm lấy danh sách chuyên khoa từ API
    const getSpecialties = async (accessToken) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/doctor/specialty/search?keyword=${keyword}&page=${currentPage}&size=${pageSize}`,
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
            setSpecialties(data.data || []);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching specialties:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getSpecialties(accessToken); // Lấy danh sách chuyên khoa
            window.scrollTo(0, 0);
        }
    }, [navigate, currentPage, pageSize]);

    // Hàm để tìm kiếm chuyên khoa khi nhấn nút tìm kiếm
    const handleSearch = () => {
        setCurrentPage(1);
        const accessToken = getToken();
        if (accessToken) {
            getSpecialties(accessToken);
        }
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

    return (
        <div>
            {!specialtyId && (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <button
                            className="bg-sky-600 text-white py-2 px-4 rounded font-bold hover:bg-sky-700"
                            title='Đồng bộ dữ liệu với hệ thống HIS'
                        >
                            Đồng bộ dữ liệu
                            &nbsp;<FontAwesomeIcon icon={faRotate} />
                        </button>

                        {/* Input tìm kiếm và nút tìm kiếm */}
                        <div className="flex items-center space-x-2">
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
                    <br />

                    {/* Bảng danh sách chuyên khoa */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    <th className="border border-gray-200 p-3 text-center">STT</th>
                                    <th className="border border-gray-200 p-3 text-left">Mã chuyên khoa</th>
                                    <th className="border border-gray-200 p-3 text-left">Tên chuyên khoa</th>
                                    <th className="border border-gray-200 p-3 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {specialties.length > 0 ? (
                                    specialties.map((specialty, index) => (
                                        <tr key={specialty.specialtyId} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                            <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                                            <td className="border border-gray-200 p-2">{specialty.specialtyId}</td>
                                            <td className="border border-gray-200 p-2 text-zinc-700"><b>{specialty.specialtyName}</b></td>
                                            <td className="border border-gray-200 p-2 text-center">
                                                <Link to={`${specialty.specialtyId}`}>
                                                    <button className="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700 transition duration-75">
                                                        Chi tiết
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        {/* Bên trái: Tổng số chuyên khoa */}
                        <div className="text-gray-600">
                            Tổng số chuyên khoa: <b>{totalElements}</b>
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
            <Outlet />
        </div>
    );
}

export default DanhSachChuyenKhoa;
