import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../services/localStorageService';
import { CONFIG } from '../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

function ThongTinBacSi() {
    const navigate = useNavigate();
    const { doctorId } = useParams(); // Lấy id từ URL
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Hàm lấy thông tin chi tiết bác sĩ
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
            console.log(data)
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
        }
    }, [navigate, doctorId]);

    if (loading) {
        return <div className="flex justify-center"><div className="spinner"></div></div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="p-5">
            {doctor ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Cột bên trái - thông tin bác sĩ */}
                        <div className="md:col-span-2">
                            <h1 className="text-2xl font-bold mb-4 text-blue-900">
                                {doctor.qualifications && doctor.qualifications.length > 0 ? doctor.qualifications.map(qual => qual.abbreviation).join(". ") : "Không có thông tin"}.
                                {` ${doctor.fullName}`}
                            </h1>
                            <p className="text-lg mb-2"><strong>Mã bác sĩ:</strong> {doctor.id}</p>
                            <p className="text-lg mb-2"><strong>Học hàm / Học vị:</strong> {doctor.qualifications && doctor.qualifications.length > 0 ? doctor.qualifications.map(qual => qual.name).join(", ") : "Không có thông tin"}</p>
                            <p className="text-lg mb-2"><strong>Chuyên khoa:</strong> {doctor.specialties && doctor.specialties.length > 0 ? doctor.specialties.map(specialty => specialty.specialtyName).join(", ") : "Không có thông tin chuyên khoa"}</p>
                            <p className="text-lg mb-2"><strong>Tình trạng:</strong> {convertStatus(doctor.status)}</p>
                            <p className="text-lg mb-2"><strong>Điện thoại:</strong> {doctor.phoneNumber || "Không có thông tin"}</p>
                            <p className="text-lg mb-2"><strong>Email:</strong> {doctor.email || "Không có thông tin"}</p>
                            <p className="text-lg mb-2"><strong>Mô tả:</strong> {doctor.description || "Không có thông tin"}</p>
                            <br></br>

                            <img 
                                src={`https://barcode.tec-it.com/barcode.ashx?data=${doctor.id}&code=Code128&dpi=96`} 
                                alt="Mã vạch lịch hẹn" 
                                className="mb-4 object-cover"
                            />
                            
                            {/* Nút quay lại danh sách */}
                            {/* <div className="flex justify-start mt-6">
                                <button 
                                    onClick={() => navigate("/bac-si/danh-sach")}
                                    className=" py-2 px-6 rounded transition duration-300 text-blue-600 border border-blue-600 hover:bg-slate-100"
                                >
                                    <FontAwesomeIcon icon={faAnglesLeft} /> &nbsp;
                                    Quay lại danh sách
                                </button>
                            </div> */}
                        </div>
                        
                        {/* Cột bên phải - ảnh bác sĩ và mã vạch */}
                        <div className="flex flex-col items-center justify-center">
                            
                            <img 
                                src="/images/default-doctor.jpg" 
                                alt="Ảnh bác sĩ" 
                                className="w-3/4 md:w-full object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                    <br />
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
                                    <th className="border border-gray-200 p-3 text-left">Mã DV</th>
                                    <th className="border border-gray-200 p-3 text-left">Tên dịch vụ</th>
                                    <th className="border border-gray-200 p-3 text-left">Chuyên khoa</th>
                                    <th className="border border-gray-200 p-3 text-left">Phân loại</th>
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
                </>
                
            ) : (
                <div className="text-center text-xl text-gray-500">
                    Không tìm thấy thông tin bác sĩ.
                </div>
            )}
        </div>
    );
    
}

// Hàm chuyển đổi trạng thái
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