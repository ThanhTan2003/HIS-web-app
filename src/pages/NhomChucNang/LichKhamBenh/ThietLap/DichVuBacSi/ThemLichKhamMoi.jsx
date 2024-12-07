import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faVialVirus, faXmark, faNotesMedical, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getToken } from '../../../../../services/localStorageService';
import { CONFIG } from '../../../../../configurations/configuration';

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const showInfor = (message) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}

const showError = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

const showWarning = (message) => {
    toast.warning(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

const ChonDichVu = ({ setDoctorServiceId }) => {
    const navigate = useNavigate();
    const { doctorId } = useParams();

    const [doctorServices, setDoctorServices] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState("");

    const [selectedService, setSelectedService] = useState()

    // Hàm lấy danh sách dịch vụ bác sĩ từ API
    const getDoctorServices = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/medical/doctor-service/doctor-id/${doctorId}?page=${currentPage}&size=${pageSize}&keyword=${keyword}`,
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
        }
    }, [navigate, currentPage, keyword]);

    // Hàm xử lý tìm kiếm dịch vụ
    const handleSearch = () => {
        setCurrentPage(1); // Reset lại trang hiện tại về 1 khi tìm kiếm
        const accessToken = getToken();
        if (accessToken) {
            getDoctorServices(accessToken);
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

    const handleSelectService = (service) => {
        if (!service) return;
        setDoctorServiceId(service.id)

        setSelectedService(service.service)

        showInfor(`Đã chọn dịch vụ "${service?.service.name}"!`)
    };

    return (
        <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
            <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-xl">
                Chọn dịch vụ
            </div>
            <div className="md:col-span-2 text-justify pt-2">
                {/* Input tìm kiếm dịch vụ */}
                <div className="mb-4">
                    <div className="grid grid-cols-[70%,29%] gap-2">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Nhập mã dịch vụ hoặc tên dịch vụ"
                            className="border rounded p-2 w-full border-blue-300"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-sky-600 text-white py-2 rounded hover:bg-sky-700 font-semibold"
                        >
                            Tìm dịch vụ &nbsp; <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>

                {/* Bảng danh sách dịch vụ */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                        <thead>
                            <tr className="bg-sky-600 text-white">
                                <th className="border border-gray-200 p-3 text-center">STT</th>
                                <th className="border border-gray-200 p-3 text-left">Tên dịch vụ</th>
                                <th className="border border-gray-200 p-3 text-center">Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorServices.length > 0 ? (
                                doctorServices.map((service, index) => (
                                    <tr key={service.id}>
                                        <td className="border border-gray-200 p-2 text-center">
                                            {index + 1 + (currentPage - 1) * pageSize}
                                        </td>
                                        <td className="border border-gray-200 p-2 text-left">{service.service?.name}</td>
                                        <td className="border border-gray-200 p-2 text-center">
                                            <button
                                                onClick={() => handleSelectService(service)}
                                                className="bg-white text-sky-600 px-3 py-1 rounded-md hover:bg-sky-600 hover:text-white transition duration-75 flex items-center justify-center w-10/12 font-semibold border border-sky-600"
                                            >
                                                Chọn &nbsp; <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center p-4">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phần tổng số dịch vụ và trang hiện tại */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-gray-600">
                        Tổng số dịch vụ: <b>{totalElements}</b>
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

                {/* Dịch vụ đã chọn */}
                <div className="mb-4 mt-4">
                    <label className="block text-gray-700 font-bold mb-2">Dịch vụ được chọn:</label>
                    <input
                        type="text"
                        value={selectedService ? selectedService.name : ''}
                        className="border rounded p-2 w-full border-blue-300 font-semibold text-red-900"
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

const ChonPhongKham = ({ romId, setRoomId, dayOfWeek, timeFrameId }) => {
    const navigate = useNavigate();

    const [functions, setFunctions] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedFunction, setSelectedFunction] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [keyword, setKeyword] = useState('');

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);

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

    const getFunctions = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/medical/room/get-functions`,
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
            setFunctions(data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getRooms = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/medical/room/get-list-of-available-rooms?dayOfWeek=${dayOfWeek}&timeFrameId=${timeFrameId}&function=${selectedFunction}&keyword=${keyword}&page=${currentPage}&size=${pageSize}`,
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
            setRooms(data.data || []);
            setTotalPages(data.totalPages);
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
            getFunctions(accessToken);
        }
    }, [navigate]);

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate("/login");
        } else {
            getRooms(accessToken);
        }
    }, [navigate, currentPage, pageSize, selectedFunction, keyword]);

    const handleSelectFunction = (value) => {
        setSelectedFunction(value);
        setCurrentPage(1); // Reset về trang đầu khi thay đổi chức năng
    };

    const handleClickSearch = () => {
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
        getRooms(getToken());
    };

    const handleSelectRoom = (room) => {
        if (!room) return;
        setRoomId(room.id);
        setSelectedRoom(room);
        showInfor(`Đã chọn "${room?.name}"!`);
    };


    return (
        <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
            <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-xl">
                Chọn phòng khám
            </div>
            <div className="md:col-span-2 text-justify pt-2">
                <div className="mb-4">
                    <select
                        className="border rounded p-2 w-full border-blue-300"
                        onChange={(e) => {
                            setSelectedFunction(e.target.value)
                            handleSelectFunction(e.target.value)
                        }}
                    >
                        <option value="">Tất cả phòng</option>
                        {functions.map((f, index) => (
                            <option key={index} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <div className="grid grid-cols-[70%,29%] gap-2">
                        <input
                            type="text"
                            placeholder="Nhập mã phòng hoặc tên phòng"
                            className="border rounded p-2 w-full border-blue-300"
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            className="bg-sky-600 text-white py-2 rounded hover:bg-sky-700 font-semibold"
                            onClick={handleClickSearch}
                        >
                            Tìm phòng khám &nbsp; <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                        <thead>
                            <tr className="bg-sky-600 text-white">
                                <th className="border border-gray-200 p-3 text-center">STT</th>
                                <th className="border border-gray-200 p-3 text-left">Tên phòng</th>
                                <th className="border border-gray-200 p-3 text-left">Phân loại</th>
                                <th className="border border-gray-200 p-3 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <tr key={room.id} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                        <td className="border border-gray-200 p-2 text-center">{index + 1 + (currentPage - 1) * pageSize}</td>
                                        <td className="border border-gray-200 p-2 text-zinc-700">{room.name}</td>
                                        <td className="border border-gray-200 p-2 text-zinc-700">{room.function}</td>
                                        <td className="border border-gray-200 p-2">
                                        <button
                                                onClick={() => handleSelectRoom(room)}
                                                className="bg-white text-sky-600 px-3 py-1 rounded-md hover:bg-sky-600 hover:text-white transition duration-75 flex items-center justify-center w-10/12 font-semibold border border-sky-600"
                                            >
                                                Chọn &nbsp; <FontAwesomeIcon icon={faCheck} />
                                            </button>
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
                    <div className="text-gray-600">
                        Tổng số phòng: <b>{totalElements}</b>
                    </div>
                    <div className="text-gray-600">
                        Trang {currentPage} / {totalPages}
                    </div>
                </div>

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

                {/* Dịch vụ đã chọn */}
                <div className="mb-4 mt-4">
                    <label className="block text-gray-700 font-bold mb-2">Phòng khám được chọn:</label>
                    <input
                        type="text"
                        className="border rounded p-2 w-full border-blue-300 font-semibold text-red-900"
                        value={selectedRoom ? selectedRoom.name : ''}
                        disabled
                    />
                </div>
            </div>
        </div>
    );
};

const ThongTinLichKham = ({ setQuantity, setStartNumber, setEndNumber }) => {
    const [maxRegistrations, setMaxRegistrations] = useState(""); // Số lượng đăng ký tối đa
    const [startOrder, setStartOrder] = useState(""); // Số thứ tự bắt đầu
    const [endOrder, setEndOrder] = useState(""); // Số thứ tự kết thúc

    // Hàm xử lý thay đổi số lượng đăng ký tối đa
    const handleMaxRegistrationsChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setMaxRegistrations(value);
        setQuantity(value); // Cập nhật giá trị quantity bên ngoài component

        // Nếu đã có giá trị STT bắt đầu, cập nhật STT kết thúc dựa trên số lượng
        if (startOrder) {
            const calculatedEndOrder = startOrder + value - 1;
            setEndOrder(calculatedEndOrder);
            setEndNumber(calculatedEndOrder); // Cập nhật giá trị endNumber bên ngoài component
        }
    };

    // Hàm xử lý thay đổi STT bắt đầu
    const handleStartOrderChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setStartOrder(value);
        setStartNumber(value); // Cập nhật giá trị startNumber bên ngoài component

        // Nếu đã có số lượng đăng ký tối đa, cập nhật STT kết thúc
        if (maxRegistrations) {
            const calculatedEndOrder = value + maxRegistrations - 1;
            setEndOrder(calculatedEndOrder);
            setEndNumber(calculatedEndOrder); // Cập nhật giá trị endNumber bên ngoài component
        }
    };

    // Hàm xử lý thay đổi STT kết thúc
    const handleEndOrderChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setEndOrder(value);
        setEndNumber(value); // Cập nhật giá trị endNumber bên ngoài component

        // Nếu đã có số lượng đăng ký tối đa, cập nhật STT bắt đầu
        if (maxRegistrations) {
            const calculatedStartOrder = value - maxRegistrations + 1;
            setStartOrder(calculatedStartOrder);
            setStartNumber(calculatedStartOrder); // Cập nhật giá trị startNumber bên ngoài component
        }
    };

    return (
        <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
            <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-xl">
                Thông tin lịch khám
            </div>
            <div className="flex justify-between space-x-4 mt-6">
                {/* Số lượng đăng ký tối đa */}
                <div className="flex-1">
                    <label className="block text-gray-700 font-bold mb-2">Số lượng đăng ký tối đa</label>
                    <input
                        type="number"
                        min="1"
                        value={maxRegistrations}
                        onChange={handleMaxRegistrationsChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập số lượng"
                    />
                </div>
                {/* Số thứ tự bắt đầu */}
                <div className="flex-1">
                    <label className="block text-gray-700 font-bold mb-2">Số thứ tự bắt đầu</label>
                    <input
                        type="number"
                        min="1"
                        value={startOrder}
                        onChange={handleStartOrderChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập STT bắt đầu"
                    />
                </div>
                {/* Số thứ tự kết thúc */}
                <div className="flex-1">
                    <label className="block text-gray-700 font-bold mb-2">Số thứ tự kết thúc</label>
                    <input
                        type="number"
                        min="1"
                        value={endOrder}
                        onChange={handleEndOrderChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                        placeholder="Nhập STT kết thúc"
                    />
                </div>
            </div>
        </div>
    );
};


const ThemLichKhamMoi = ({ isOpen, onClose, doctorId, timeFrameId }) => {
    const [doctorServiceId, setDoctorServiceId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [startNumber, setStartNumber] = useState(0);
    const [endNumber, setEndNumber] = useState(0);

    const { day } = useParams();

    const validateInputs = () => {
        if (!day) {
            showError("Vui lòng chọn ngày.");
            return false;
        }
        if (!quantity || quantity <= 0) {
            showError("Vui lòng nhập số lượng tiếp nhận!");
            return false;
        }
        if (!startNumber || startNumber <= 0) {
            showError("Vui lòng nhập số thứ tự bắt đầu phù hợp!");
            return false;
        }
        if (!endNumber || endNumber <= 0) {
            showError("Vui lòng nhập số thứ tự kết thúc phù hợp");
            return false;
        }
        if (!doctorServiceId) {
            showError("Vui lòng chọn dịch vụ của bác sĩ.");
            return false;
        }
        if (!roomId) {
            showError("Vui lòng chọn phòng khám.");
            return false;
        }
        return true;
    };

    const addServiceTimeFrame = async () => {
        if (!validateInputs()) {
            return; // Ngừng thực hiện nếu dữ liệu không hợp lệ
        }
        const accessToken = getToken();
        if (!accessToken) {
            showError("Unauthorized: Please login again.");
            return;
        }

        const ServiceTimeFrameRequest = {
            dayOfWeek: day,
            maximumQuantity: quantity,
            startNumber: startNumber,
            endNumber: endNumber,
            doctorServiceId: doctorServiceId,
            roomId: roomId,
            isActive: true,
            timeFrameId: timeFrameId
        };

        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/medical/service-time-frame/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(ServiceTimeFrameRequest),
            });

            if (response.ok) {
                toast.success("Lịch khám mới được thêm thành công!", { autoClose: 3000 });
                onClose(); // Đóng modal sau khi thêm thành công
            } else {
                const errorData = await response.json();
                showError(errorData.message || "Failed to add service time frame");
            }
        } catch (error) {
            showError("Error adding service time frame: " + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 backdrop-blur-none transition-opacity duration-300 ease-in-out opacity-100">
            <ToastContainer />
            <div className="bg-white rounded-lg shadow-lg w-2/3 max-h-[95vh] overflow-y-auto">
                <div className="bg-sky-600 text-white p-2 px-6 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold"><FontAwesomeIcon icon={faPlus} /> &nbsp; Thêm dịch lịch khám mới</h2>
                    <button
                        onClick={onClose}
                        className="text-sky-600 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition duration-200 ease-in-out"
                        title='Đóng'
                        style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className='p-8'>
                    <ChonDichVu setDoctorServiceId={setDoctorServiceId} />
                    <br /><hr /><br />
                    <ChonPhongKham romId={roomId} setRoomId={setRoomId} dayOfWeek={day} timeFrameId ={timeFrameId}/>
                    <br /><hr /><br />
                    <ThongTinLichKham setQuantity={setQuantity} setStartNumber={setStartNumber} setEndNumber={setEndNumber} />
                    <div className="justify-end grid grid-cols-[40%,25%] gap-x-4 font-semibold pt-6">
                        <button
                            className="bg-sky-700 text-white py-2 px-4 rounded hover:bg-sky-800 pt-3 pb-3"
                            onClick={() => {
                                // Gọi hàm thêm lịch khám mới
                                addServiceTimeFrame();
                            }}
                        >
                            Thêm lịch khám mới &nbsp; <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white text-sky-600 px-4 py-2 rounded font-bold border border-sky-600 hover:bg-slate-100"
                        >
                            Hủy &nbsp; X
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ThemLichKhamMoi;
