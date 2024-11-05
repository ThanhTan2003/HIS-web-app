import React, { useEffect, useState } from 'react';

import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import { getToken } from "../../../services/localStorageService";
import { CONFIG } from '../../../configurations/configuration';

import BarcodeScanner from '../../../features/quetMaVach/BarcodeScanner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus, faInfo, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import ThongTinTaiKhoanHeThong from './ThongTinTaiKhoanHeThong';
import ThemTaiKhoan from './ThemTaiKhoan';
import CapNhatTaiKhoan from './CapNhatTaiKhoan';


function DanhSach() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [key, setKey] = useState(0);
    const [selectedRole, setSelectedRole] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showModalUpdate, setShowModalUpfate] = useState(false);
    const [showModalDeleta, setShowModalDelete] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState(null);

    const openModalDetail = (userName) => {
        setSelectedUserName(userName);
        setShowModalDetail(true);
    };

    const closeModalDetail = () => {
        setSelectedUserName(null);
        setShowModalDetail(false);
    };

    const openModalAdd = () => {
        setShowModalAdd(true);
    };

    const closeModalAdd = () => {
        setShowModalAdd(false);
    };

    const handleAddSuccess = () => {
        // Refresh the user list after successfully adding a new account
        const accessToken = getToken();
        getUsers(accessToken); // Gọi lại API để lấy danh sách mới nhất
        closeModalAdd(); // Đóng modal
    };

    const { userId } = useParams();

    // Hàm xử lý khi quét mã vạch
    const handleBarcodeDetected = (barcode) => {
        setKeyword(barcode);
        setShowScanner(false);
    };

    const handleCloseScanner = () => {
        setShowScanner(false);
    };

    // Hàm lấy danh sách tài khoản
    const getUsers = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/identity/user/search?keyword=${keyword}&page=${currentPage}&size=${pageSize}`,
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
            setUsers(data.data || []);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Lấy danh sách loại tài khoản từ API
    const getRoles = async (accessToken) => {
        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/identity/role/get-all-except-nguoi-dung`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            setRoles(data || []);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getUsers(accessToken);
            getRoles(accessToken);
            window.scrollTo(0, 0);
        }
    }, [navigate, currentPage, pageSize, selectedRole, keyword]);

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
        getUsers(getToken());
    };

    // Hàm chuyển đổi chuỗi tiếng Việt thành chuỗi không dấu
    const removeVietnameseTones = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    };

    return (
        <div>
            {!userId && (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={openModalAdd} // Gọi openModalAdd khi nhấn
                            className="bg-sky-600 text-white py-2 px-4 rounded font-bold hover:bg-sky-700"
                            title="Thêm tài khoản mới"
                        >
                            Thêm tài khoản mới &nbsp;<FontAwesomeIcon icon={faPlus} />
                        </button>

                        <div className="flex items-center space-x-2">
                            <select
                                className="border p-2 rounded border-blue-300"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Tất cả loại tài khoản</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border p-2 rounded border-blue-300"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>

                            {/* <button
                                type="button"
                                onClick={() => setShowScanner(true)} // Hiển thị component quét mã vạch
                                className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700"
                            >
                                <img
                                    src='/icons/icon-scan-qr-code.png'
                                    title="Quét mã vạch"
                                    className="w-6 h-6"
                                />
                            </button> */}

                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
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

                    {showScanner && <BarcodeScanner onDetected={handleBarcodeDetected} onClose={handleCloseScanner} />}

                    <br />

                    {/* Bảng danh sách */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    <th className="border border-gray-200 p-3 text-center">STT</th>
                                    <th className="border border-gray-200 p-3 text-left">Tên tài khoản</th>
                                    <th className="border border-gray-200 p-3 text-left">Tên người dùng</th>
                                    <th className="border border-gray-200 p-3 text-left">Loại tài khoản</th>
                                    <th className="border border-gray-200 p-3 text-left">Tình trạng</th>
                                    <th className="border border-gray-200 p-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody key={key}>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.userName} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                            <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                                            <td className="border border-gray-200 p-2 text-zinc-700"><b>{user.userName}</b></td>
                                            <td className="border border-gray-200 p-2">{user.accountName}</td>
                                            <td className="border border-gray-200 p-2">{user.roleName}</td>

                                            <td className={`border border-gray-200 p-2 font-bold 
                                                ${removeVietnameseTones(user.status) === 'Dang hoat dong' ? 'text-green-800' :
                                                    removeVietnameseTones(user.status) === 'Ngung hoat dong' ? 'text-red-800' :
                                                        removeVietnameseTones(user.status) === 'Dang bao tri' ? 'text-orange-800' : ''}`}>
                                                {user.status}
                                            </td>

                                            <td className="border border-gray-200 p-2 text-center">
                                                <Link to={`${user.userName}`}>
                                                    <button
                                                        onClick={() => openModalDetail(user.userName)}
                                                        className="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700 transition duration-75"
                                                    // className="text-cyan-600 px-3 py-1 rounded-md border border-cyan-600 hover:bg-cyan-600 hover:text-white transition duration-75"
                                                    >
                                                        Xem
                                                        {/* &nbsp; <FontAwesomeIcon icon={faInfo} /> */}
                                                    </button>
                                                </Link>

                                                &nbsp;&nbsp;

                                                <Link to={`${user.userName}`}>
                                                    <button
                                                        onClick={() => openModalDetail(user.userName)}
                                                        className="bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700 transition duration-75"
                                                    >
                                                        Sửa
                                                        {/* &nbsp; <FontAwesomeIcon icon={faPen} /> */}
                                                    </button>
                                                </Link>

                                                &nbsp;&nbsp;

                                                <Link to={`${user.userName}`}>
                                                    <button
                                                        onClick={() => openModalDetail(user.userName)}
                                                        className="bg-rose-600 text-white px-3 py-1 rounded-md hover:bg-rose-700 transition duration-75"
                                                    >
                                                        Xóa
                                                        {/* &nbsp; <FontAwesomeIcon icon={faTrashCan} /> */}
                                                    </button>
                                                </Link>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {showModalDetail &&
                        <ThongTinTaiKhoanHeThong
                            isOpen={showModalDetail}
                            onClose={closeModalDetail}
                            userName={selectedUserName}
                        />
                    }
                    {showModalAdd && (
                        <ThemTaiKhoan
                            isOpen={showModalAdd}
                            onClose={closeModalAdd}
                            onCreateSuccess={handleAddSuccess}
                        />
                    )}
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-gray-600">
                            Tổng số tài khoản: <b>{totalElements}</b>
                        </div>

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

export default DanhSach;
