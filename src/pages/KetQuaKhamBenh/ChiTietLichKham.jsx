import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { CONFIG } from '../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import ConfirmModal from './ConfirmModal';
import AddResultModal from './AddResultModal';

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ThongTinDangKy({ appointment }) {
    return (
        <div>
            {appointment ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4  bg-white">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN LỊCH HẸN
                        </div>
                        <br></br>
                        {/* Nội dung khung */}
                        {/* <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr,3fr,7fr] gap-4"> */}
                        <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr] gap-4">
                                <p className="text-lg mb-2">
                                    <strong>Mã lịch hẹn: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.id || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">

                                </p>

                                <p className="text-lg mb-2">

                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Dịch vụ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.service?.name || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Bác sĩ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.doctor.fullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số thứ tự: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.orderNumber || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Phòng: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.room?.name || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ngày khám: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.dateName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Trạng thái: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.status || "Không có thông tin!"}
                                </p>
                            </div>
                        </div>

                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    {/* Không tìm thấy thông tin bác sĩ. */}
                </div>
            )}
        </div>
    );

}

function ThongTinHoSo({ patientsId }) {

    return (
        <div>
            {patientsId ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4 bg-white">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 px-2 text-blue-900 font-bold text-2xl bg-white">
                            THÔNG TIN HỒ SƠ ĐĂNG KÝ
                        </div>
                        <br></br>
                        {/* Nội dung khung */}
                        {/* <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr,3fr,7fr] gap-4"> */}
                        <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr] gap-4">
                                <p className="text-lg mb-2">
                                    <strong>Mã hồ sơ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Họ tên: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ngày sinh: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Giới tính: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Quốc gia: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Mã số căn cước: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số điện thoại: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Email: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Nghề nghiệp: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số bảo hiểm y tế: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Địa chỉ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Quan hệ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ghi chú: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                            </div>
                        </div>

                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    <p>Không có dữ liệu</p>
                </div>
            )}
        </div>
    );

}

function ThongTinKetQua({ healthCheckResults, appointmentId, onAddResult }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Trạng thái hiển thị ConfirmModal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Trạng thái hiển thị AddResultModal
    const [selectedResult, setSelectedResult] = useState(null);

    // Hàm xóa kết quả
    const deleteResult = async (resultId) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/his/health-check-result/delete/${resultId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                //alert("Xóa thành công!");
                if (onAddResult) onAddResult();
            } else {
                alert("Có lỗi xảy ra khi xóa!");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API xóa:", error);
        }
    };

    // Hàm xử lý khi nhấn nút Xóa
    const handleDelete = (result) => {
        setSelectedResult(result);
        setIsDeleteModalOpen(true); // Mở ConfirmModal
    };

    return (
        <div>
            {healthCheckResults ? (
                <>
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4 bg-white">
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN KẾT QUẢ
                        </div>
                        <br />
                        <div className="md:col-span-2 pr-6 text-justify">
                            <div className="mb-4 text-right">
                                <button
                                    onClick={() => setIsAddModalOpen(true)} // Mở AddResultModal
                                    className="bg-sky-700 text-white px-4 py-2 rounded-md hover:bg-sky-800 transition duration-200 font-semibold"
                                >
                                    Thêm kết quả mới +
                                </button>
                            </div>
                            <table className="w-full border-collapse border border-gray-200 shadow-lg rounded-md">
                                <thead>
                                    <tr className="bg-sky-600 text-white">
                                        <th className="border border-gray-200 p-3 text-center">STT</th>
                                        <th className="border border-gray-200 p-3 text-left">Tên kết quả</th>
                                        <th className="border border-gray-200 p-3 text-center"></th>
                                        <th className="border border-gray-200 p-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {healthCheckResults.length > 0 ? (
                                        healthCheckResults.map((result, index) => (
                                            <tr
                                                key={result.id}
                                                className="hover:bg-gray-100 transition duration-200 ease-in-out"
                                            >
                                                <td className="border border-gray-200 p-2 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-200 p-2 text-zinc-700">
                                                    {result.name}
                                                </td>
                                                <td className="border border-gray-200 p-2 text-center w-[200px]">
                                                    <button
                                                        onClick={() =>
                                                            window.open(result.url, "_blank")
                                                        }
                                                        className="bg-white text-cyan-600 border border-cyan-600 px-4 py-2 rounded-md hover:bg-cyan-100 transition duration-75 w-4/5"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                                <td className="border border-gray-200 p-2 text-center w-[200px]">
                                                    <button
                                                        onClick={() => handleDelete(result)} // Mở ConfirmModal
                                                        className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition duration-75 w-4/5"
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    Không có kết quả kiểm tra sức khỏe
                </div>
            )}

            {/* Modal Xác Nhận Xóa */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)} // Đóng ConfirmModal
                onConfirm={() => {
                    deleteResult(selectedResult.id); // Gọi API xóa
                    setIsDeleteModalOpen(false); // Đóng ConfirmModal
                }}
                resultName={selectedResult?.name}
            />

            {/* Modal Thêm Kết Quả */}
            <AddResultModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={() => {
                    setIsAddModalOpen(false);
                    if (onAddResult) onAddResult(); // Gọi callback khi thêm mới thành công
                }}
                appointmentId={appointmentId}
            />
            {/* Các nội dung khác của ThongTinKetQua */}
        </div>
    );
}


function ChiTietLichKham() {

    const navigate = useNavigate();

    const [patientsId, setPatientsId] = useState();

    const [appointment, setAppointment] = useState(null);

    const [healthCheckResults, setHealthCheckResults] = useState([]);

    const { appointmentId } = useParams();

    const getAppointment = async () => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/his/appointment/id/${appointmentId}`,
                {
                    method: "GET"
                }
            );
            console.log(`${CONFIG.API_GATEWAY}/his/appointment/id/${appointmentId}`)
            const data = await response.json();
            setAppointment(data || []);
            console.log(data)
            setPatientsId(data.patientsId)
            setHealthCheckResults(data.healthCheckResults)

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }

    useEffect(() => {
        getAppointment()
    }, [navigate, appointmentId]);


    return (
        <div className='p-4'>

            {/* Nút quay lại danh sách */}
            <div className="flex justify-start">
                <button
                    onClick={() => navigate("/ket-qua-kham-benh")}
                    className="py-1 px-3 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
            </div>
            <br /><br></br>

            <ThongTinDangKy appointment={appointment} />
            <ThongTinHoSo patientsId={patientsId} />
            <ThongTinKetQua
                healthCheckResults={healthCheckResults}
                appointmentId={appointmentId}
                onAddResult={getAppointment} // Truyền hàm callback
            />

        </div>
    )

}

export default ChiTietLichKham;