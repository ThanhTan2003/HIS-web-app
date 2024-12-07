import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faQuestion } from '@fortawesome/free-solid-svg-icons';

const ConfirmModal = ({ isOpen, onClose, onConfirm, appointmentId }) => {
    if (!isOpen) return null;  // Không hiển thị modal nếu isOpen là false

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 backdrop-blur-none transition-opacity duration-300 ease-in-out opacity-100">
      <div className="bg-white rounded-lg shadow-lg w-2/5">
                {/* Tiêu đề với nền xanh */}
                <div className="bg-sky-600 text-white p-2 px-6 rounded-t-lg flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center">
                        <FontAwesomeIcon icon={faQuestion} className="mr-2" /> Xác nhận thao tác
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-sky-600 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition duration-200 ease-in-out"
                        title='Đóng'
                        style={{ width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Nội dung modal */}
                <div className="text-center mb-6 p-6">
                    <p className="mt-4 text-lg text-gray-700">Xác nhận thông tin lịch hẹn <span className="font-bold text-blue-500">{appointmentId}</span>?</p>
                </div>

                {/* Các nút hành động */}
                <div className="flex justify-between p-4 mx-6">
                    <button
                        onClick={() => onConfirm(appointmentId)} // Truyền appointmentId khi gọi onConfirm
                        className="font-semibold mx-6 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
                    >
                        Có
                    </button>
                    <button
                        onClick={onClose}
                        className="font-semibold mx-6 w-full bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition duration-200 ease-in-out ml-2"
                    >
                        Không
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
