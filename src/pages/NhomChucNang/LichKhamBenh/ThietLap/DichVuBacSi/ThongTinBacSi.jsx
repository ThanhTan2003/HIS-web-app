import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from '../../../../../services/localStorageService';
import { CONFIG } from '../../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

function ThongTinbacSi() {
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
            // window.scrollTo(0, 0);
        }
    }, [navigate, doctorId]);

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

    return (
        <div>
            {doctor ? (
                <>
                    {/* Nút quay lại danh sách */}
                    <div className="flex justify-start">
                        <button
                            onClick={() => navigate("/lich-kham-benh/thiet-lap")}
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
                            THÔNG TIN BÁC SĨ
                        </div>
                        {/* Nội dung khung */}
                        <div className="md:col-span-2 pr-6 text-justify pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3"> {/* Thay đổi từ grid-cols-2 thành grid-cols-3 */}
                                <p className="text-lg mb-2"><strong>Mã bác sĩ:</strong> &nbsp;&nbsp;&nbsp;{doctor.id}</p>
                                <p className="text-lg mb-2"><strong>Tên bác sĩ:</strong>&nbsp;&nbsp; {doctor.fullName}</p>
                                <p className="text-lg mb-2"><strong>Giới tính:</strong>&nbsp; {doctor.gender}</p>
                                <p className="text-lg mb-2"><strong>Tình trạng:</strong>&nbsp; {convertStatus(doctor.status)}</p>
                                <p className="text-lg mb-2"><strong>Điện thoại:</strong>&nbsp; {doctor.phoneNumber || "Không có thông tin!"}</p>
                                <p className="text-lg mb-2"><strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {doctor.email || "Không có thông tin!"}</p>

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
                                        <ul className="list-disc ml-6">
                                                
                                                    <li key={''}>Không</li>
                                            </ul>
                                    )}
                                </div>


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

export default ThongTinbacSi;