import React, { useState } from "react";
import { CONFIG } from '../../configurations/configuration';

function AddResultModal({ isOpen, onClose, onAdd, appointmentId }) {
  const [resultName, setResultName] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddResult = async () => {
    if (!resultName || !file) {
      alert("Vui lòng nhập tên kết quả và chọn tệp!");
      return;
    }

    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append("appointmentId", appointmentId)
    formData.append("name", resultName);
    formData.append("file", file);

    try {
      const response = await fetch(`${CONFIG.API_GATEWAY}/his/health-check-result/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        //alert("Thêm kết quả mới thành công!");
        onAdd(); // Gọi hàm callback để cập nhật danh sách bên ngoài
        onClose(); // Đóng modal sau khi thêm thành công
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Không thể thêm kết quả mới"}`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm kết quả mới:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        {/* Tiêu đề Modal */}
        <div className="bg-sky-700 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-bold">Thêm Kết Quả Mới</h2>
          <button
            onClick={onClose}
            className="text-sky-600 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition duration-200"
            style={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            X
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tên kết quả:
            </label>
            <input
              type="text"
              value={resultName}
              onChange={(e) => setResultName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Nhập tên kết quả"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Chọn tệp:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
          </div>
        </div>

        {/* Nút Hành Động */}
        <div className="flex justify-center gap-4 p-4">
          <button
            onClick={handleAddResult}
            className="font-semibold bg-blue-500 text-white py-2 px-8 rounded hover:bg-blue-600 transition duration-200"
          >
            Thêm Mới
          </button>
          <button
            onClick={onClose}
            className="font-semibold bg-gray-400 text-white py-2 px-8 rounded hover:bg-gray-500 transition duration-200"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddResultModal;
