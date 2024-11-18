import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { getToken } from "../../../../services/localStorageService";
import { CONFIG } from '../../../../configurations/configuration';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

const calendar = [
  { start: 7, end: 8, name: "7:00 - 8:00", session: "Sáng" },
  { start: 8, end: 9, name: "8:00 - 9:00", session: "Sáng" },
  { start: 9, end: 10, name: "9:00 - 10:00", session: "Sáng" },
  { start: 10, end: 11, name: "10:00 - 11:00", session: "Sáng" },
  { start: 13, end: 14, name: "13:00 - 14:00", session: "Chiều" },
  { start: 14, end: 15, name: "14:00 - 15:00", session: "Chiều" },
  { start: 15, end: 16, name: "15:00 - 16:00", session: "Chiều" },
  { start: 16, end: 17, name: "16:00 - 17:00", session: "Chiều" }
];

export default function LichKhamBenhTheoNgay() {
  const navigate = useNavigate();
  const { doctorId, day } = useParams();

  const [timeFrames, setTimeFrames] = useState([]);

  // Hàm lấy danh sách ServiceTimeFrame từ API
  const getServiceTimeFrames = async (accessToken) => {
    try {
      const response = await fetch(
        `${CONFIG.API_GATEWAY}/medical/service-time-frame/get-by-doctor-and-day?doctorId=${doctorId}&dayOfWeek=${day}`,
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
      setTimeFrames(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      navigate("/login");
    } else {
      getServiceTimeFrames(accessToken);
    }
  }, [navigate, doctorId, day]);

  const renderTimeSlots = (sessionName) => {
    const filteredSlots = calendar.filter((slot) => slot.session === sessionName);

    return filteredSlots.map((timeSlot, index) => {
      const frame = timeFrames.find(
        (frame) => frame.startTime === timeSlot.start && frame.endTime === timeSlot.end
      );

      return (
        <tr key={timeSlot.start}>
          {index === 0 && (
            <td
              className="border border-gray-300 p-2 text-center font-bold align-middle"
              rowSpan={filteredSlots.length}
            >
              {sessionName}
            </td>
          )}
          <td className="border border-gray-300 p-2 text-left">{timeSlot.name}</td>
          {frame ? (
            <>
              <td className="border border-gray-300 p-2 text-zinc-700 font-semibold whitespace-normal">
                {frame.doctorServiceResponse.service.name}
              </td>
              <td className="border border-gray-300 p-2 text-zinc-700">{frame.roomResponse.id}</td>
              <td className="border border-gray-300 p-2 text-zinc-700">{frame.maximumQuantity}</td>
              <td className="border border-gray-300 p-2 text-zinc-700">
                {frame.startNumber} - {frame.endNumber}
              </td>
              <td className="border border-gray-300 p-2 text-zinc-700">
                Nhận đăng ký
              </td>
              <td className="border border-gray-200 p-2 text-center whitespace-nowrap">
                <button
                  className="bg-white text-sky-600 px-3 py-1 rounded-md hover:bg-sky-600 hover:text-white transition duration-75 w-10/12 font-semibold border border-sky-600"
                >
                  Chi tiết &nbsp;<FontAwesomeIcon icon={faInfo} className="mr-1" />
                </button>
              </td>
            </>
          ) : (
            <>
              <td className="border border-gray-300 p-2 text-zinc-700 font-semibold whitespace-normal"></td>
              <td className="border border-gray-300 p-2 text-zinc-700"></td>
              <td className="border border-gray-300 p-2 text-zinc-700"></td>
              <td className="border border-gray-300 p-2 text-zinc-700"></td>
              <td className="border border-gray-300 p-2 text-zinc-700"></td>
              <td className="border border-gray-200 p-2 text-center whitespace-nowrap">

              </td>
            </>
          )}
        </tr>
      );
    });
  };

  return (
    <>
      <br />

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-md whitespace-nowrap">
          <thead>
            <tr className="bg-sky-600 text-white">
              <th className="border border-gray-300 p-3 text-center">Buổi</th>
              <th className="border border-gray-300 p-3 text-left">Khung giờ</th>
              <th className="border border-gray-300 p-3 text-left whitespace-normal">Tên dịch vụ</th>
              <th className="border border-gray-300 p-3 text-left">Phòng</th>
              <th className="border border-gray-300 p-3 text-left">SL</th>
              <th className="border border-gray-300 p-3 text-left">Số TT</th>
              <th className="border border-gray-300 p-3 text-left" style={{ width: "150px" }}>Tình trạng</th>
              <th className="border border-gray-300 p-3 text-left" style={{ width: "150px" }}></th>

            </tr>
          </thead>
          <tbody>
            {renderTimeSlots("Sáng")}
            {/* Hàng trống để phân cách buổi sáng và buổi chiều */}
            <tr className="bg-slate-100">
              <td colSpan="8" className="text-center p-4"></td>
            </tr>
            {renderTimeSlots("Chiều")}
          </tbody>
        </table>
        <br></br>
      </div>

      <Outlet />
    </>
  );
}
