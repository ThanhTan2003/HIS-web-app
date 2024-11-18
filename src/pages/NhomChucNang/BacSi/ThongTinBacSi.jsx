import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../services/localStorageService';
import { CONFIG } from '../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import DanhSachDichVu from './ThongTinBacSi/DanhSachDichVu'
import LichKhamBenh from './ThongTinBacSi/LichKhamBenh';

function ThongTinBacSi() {
    const navigate = useNavigate();
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getDoctorDetails = async (accessToken) => {
        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}/doctor/id/${doctorId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                console.error('Unauthorized: Token invalid or expired');
                navigate('/login');
                return;
            }

            const data = await response.json();
            if (response.ok) {
                setDoctor(data);
            } else {
                setError(data.message || 'Failed to fetch doctor details.');
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            setError('Error fetching doctor details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const accessToken = getToken();
        if (!accessToken) {
            navigate('/login');
        } else {
            getDoctorDetails(accessToken);
            //window.scrollTo(0, 0);
        }
    }, [navigate, doctorId]);

    if (loading) {
        return <div className="flex justify-center"><div className="spinner"></div></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="pt-2 pb-4 pl-4 pr-2">
            {doctor ? (
                <>
                    {/* Nút quay lại danh sách */}
                    <div className="flex justify-start">
                        <button
                            onClick={() => navigate("/bac-si/danh-sach")}
                            className="py-1 px-3 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                        >
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>
                    </div>
                    <br />

                    {/* Khung thông tin bác sĩ với tiêu đề trên cạnh trên */}
                    <div className="border border-blue-600 rounded-lg shadow-md relative p-4">
                        {/* Tiêu đề trên cạnh trên */}
                        <div className="absolute -top-4 left-4 bg-white px-2 text-blue-900 font-bold text-2xl">
                            THÔNG TIN BÁC SĨ:
                        </div>
                        {/* Nội dung khung */}
                        <div className="p-4 bg-white rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Thông tin bác sĩ */}
                            <div className="md:col-span-2 pr-6 text-justify">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <p className="text-lg mb-2"><strong>Mã bác sĩ:</strong> {doctor.id}</p>
                                    <p className="text-lg mb-2"><strong>Tên bác sĩ:</strong> {doctor.fullName}</p>

                                    {/* Học hàm / Học vị */}
                                    <div className="text-lg mb-2">
                                        <strong>Học hàm / Học vị: </strong>
                                        {doctor.qualifications && doctor.qualifications.length > 0 ? (
                                            doctor.qualifications.length === 0 ? (
                                                doctor.qualifications[0].name
                                            ) : (
                                                <ul className="list-disc ml-6">
                                                    {doctor.qualifications.map((qual, index) => (
                                                        <li key={index}>{qual.name}</li>
                                                    ))}
                                                </ul>
                                            )
                                        ) : (
                                            "Không có thông tin!"
                                        )}
                                    </div>

                                    {/* Chuyên khoa */}
                                    <div className="text-lg mb-2">
                                        <strong>Chuyên khoa: </strong>
                                        {doctor.specialties && doctor.specialties.length > 0 ? (
                                            doctor.specialties.length === 0 ? (
                                                doctor.specialties[0].specialtyName
                                            ) : (
                                                <ul className="list-disc ml-6">
                                                    {doctor.specialties.map((specialty, index) => (
                                                        <li key={index}>{specialty.specialtyName}</li>
                                                    ))}
                                                </ul>
                                            )
                                        ) : (
                                            "Không có thông tin chuyên khoa!"
                                        )}
                                    </div>

                                    <p className="text-lg mb-2"><strong>Giới tính:</strong> {doctor.gender}</p>
                                    <p className="text-lg mb-2"><strong>Tình trạng:</strong> {convertStatus(doctor.status)}</p>
                                    <p className="text-lg mb-2"><strong>Điện thoại:</strong> {doctor.phoneNumber || "Không có thông tin!"}</p>
                                    <p className="text-lg mb-2"><strong>Email:</strong> {doctor.email || "Không có thông tin!"}</p>
                                </div>

                                {/* Mô tả và mã vạch */}
                                <p className="text-lg mb-2 text-justify"><strong>Mô tả:</strong> {doctor.description || "Không có thông tin!"}</p>
                                <br />
                                <img
                                    src={`https://barcode.tec-it.com/barcode.ashx?data=${doctor.id}&code=Code128&dpi=96`}
                                    alt="Mã vạch lịch hẹn"
                                    className="object-cover"
                                />
                            </div>


                            {/* Ảnh bác sĩ*/}
                            <div className="flex flex-col items-center justify-center">
                                <img
                                    src={doctor.image || (doctor.gender === 'Nam' ? "/images/default-male-doctor.jpg" : "/images/default-female-doctor.jpg")}
                                    alt="Ảnh bác sĩ"
                                    className="w-3/4 md:w-full object-cover rounded-lg shadow-lg mb-4"
                                />
                            </div>
                        </div>
                    </div>

                    <br />
                    <hr />
                    <br />

                    <DanhSachDichVu />

                    <br />
                    <hr />
                    <br />

                    <LichKhamBenh />
                </>
            ) : (
                <div className="text-center text-xl text-gray-500">
                    Không tìm thấy thông tin bác sĩ.
                </div>
            )}
        </div>
    );
}

const convertStatus = (status) => {
    switch (status) {
        case 'DangLamViec':
            return 'Đang làm việc';
        case 'NgungCongTac':
            return 'Ngừng công tác';
        case 'ChuyenCongTac':
            return 'Chuyển công tác';
        default:
            return 'Không rõ';
    }
};

export default ThongTinBacSi;
