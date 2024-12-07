import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from '../../../../services/localStorageService';
import { CONFIG } from '../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ThongTinDangKy({ appointment }) {
    return (
        <div>
            {appointment ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
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
                                    <strong>Thời gian đặt: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.dateTime || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Dịch vụ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.serviceTimeFrame?.serviceName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Bác sĩ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.serviceTimeFrame?.doctorQualificationName + " " + appointment?.serviceTimeFrame?.doctorName || "Không có thông tin!"}
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
                                    {appointment?.serviceTimeFrame?.roomName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ngày khám: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.dateFullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Khung giờ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.serviceTimeFrame?.timeFrameNameFullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Trạng thái: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {appointment?.status || "Không có thông tin!"}
                                </p>

                                <img
                                    src={`https://barcode.tec-it.com/barcode.ashx?data=${appointment.id}&code=Code128&dpi=96`}
                                    alt="Mã vạch lịch hẹn"
                                    className="object-cover col-span-2"
                                />
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
    const [patients, setPatients] = useState(null);

    const navigate = useNavigate();

    const getPatients = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/patient/id/${patientsId}`,
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
            console.log("patientsId: " + patientsId)
            console.log("patients: " + data)
            setPatients(data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate('/login');
        } else {
            getPatients(accessToken);
        }
    }, [navigate, patientsId]);

    return (
        <div>
            {patients ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
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
                                    {patients?.id || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Họ tên: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.fullName || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ngày sinh: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.dateOfBirth || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Giới tính: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.gender || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Quốc gia: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.nation || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Mã số căn cước: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.identificationCode || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số điện thoại: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.phoneNumber || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Email: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.email || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Nghề nghiệp: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.occupation || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số bảo hiểm y tế: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.insuranceId || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Địa chỉ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients.address + ", " + patients.ward + ", " + patients.district + ", " + patients.province || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Quan hệ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.relationship || "Không có thông tin!"}
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ghi chú: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    {patients?.note || "Không có thông tin!"}
                                </p>

                                <img
                                    src={`https://barcode.tec-it.com/barcode.ashx?data=${patients.id}&code=Code128&dpi=96`}
                                    alt="Mã vạch lịch hẹn"
                                    className="object-cover col-span-2"
                                />

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

function ThongTinThanhToan({ paymentId }) {

    return (
        <div>
            {paymentId ? (
                <>
                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN THANH TOÁN
                        </div>
                        <br></br>
                        {/* Nội dung khung */}
                        {/* <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr,3fr,7fr] gap-4"> */}
                        <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-[3fr,7fr,3fr,7fr] gap-4">
                                <p className="text-lg mb-2">
                                    <strong>Mã thanh toán: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Thời gian: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Phí dịch vụ: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Phụ thu: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Giảm giá: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Tổng tiền: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Mã giao dịch: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Số trace: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Ngân hàng: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Trạng thái: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Phương thức: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Kênh thanh toán: </strong>
                                </p>

                                <p className="text-lg mb-2">
                                    ...
                                </p>

                                <p className="text-lg mb-2">
                                    <strong>Nội dung: </strong>
                                </p>

                                <p className="text-lg mb-2 col-span-2">
                                    ...
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

function ChiTietLichKham() {

    const navigate = useNavigate();

    const [patientsId, setPatientsId] = useState()

    const [paymentId, setPaymentId] = useState()

    const [appointment, setAppointment] = useState(null);

    const { appointmentId } = useParams();

    const getAppointment = async (accessToken) => {
        try {
            const response = await fetch(
                `${CONFIG.API_GATEWAY}/appointment/id/${appointmentId}`,
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
            console.log(`${CONFIG.API_GATEWAY}/appointment/id/${appointmentId}`)
            const data = await response.json();
            setAppointment(data || []);
            console.log(data.patientsId)
            setPatientsId(data.patientsId)
            setPaymentId(data.paymentId)

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate('/login');
        } else {
            getAppointment(accessToken);
        }
    }, [navigate, appointmentId]);


    return (
        <div className='p-4'>
          
            {/* Nút quay lại danh sách */}
            <div className="flex justify-start">
                <button
                    onClick={() => navigate("/lich-kham-benh/ho-so-dang-ky")}
                    className="py-1 px-3 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
            </div>
            <br /><br></br>

            <ThongTinDangKy appointment={appointment} />
            <ThongTinHoSo patientsId={patientsId} />
            <ThongTinThanhToan paymentId={paymentId} />

        </div>
    )

}

export default ChiTietLichKham;