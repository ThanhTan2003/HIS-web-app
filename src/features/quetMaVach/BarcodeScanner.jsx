import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga'; // Thư viện quét mã vạch
import Webcam from 'react-webcam'; // Thư viện webcam

const BarcodeScanner = ({ onDetected, onClose }) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    if (webcamRef.current) {
      // Cấu hình QuaggaJS
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment', // Sử dụng camera sau của máy tính hoặc thiết bị
          },
          target: webcamRef.current.video,
          mirror: true, // Lật hình ảnh để đúng chiều quét
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader'], // Các định dạng mã vạch cần quét
        },
      }, (err) => {
        if (err) {
          console.error('Lỗi khi khởi tạo QuaggaJS:', err);
          return;
        }

        // Tìm canvas và thiết lập thuộc tính willReadFrequently
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const context = canvas.getContext('2d', { willReadFrequently: true });
        }

        Quagga.start();
      });

      // Khi phát hiện mã vạch
      Quagga.onDetected((result) => {
        const barcode = result.codeResult.code;
        if (barcode) {
          onDetected(barcode); // Trả mã vạch về cho component cha
          Quagga.stop(); // Dừng quét sau khi đã quét thành công
        }
      });

      return () => {
        Quagga.stop(); // Dừng QuaggaJS khi component unmount
      };
    }
  }, []);

  return (
    <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        position: 'relative', 
      }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <Webcam
          ref={webcamRef}
          style={{
            width: '100%',
            transform: 'scaleX(-1)', // Lật hình ảnh qua trục X để hiển thị đúng chiều
          }}
        />
        {/* Thêm nút Đóng */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: '#fc3d03',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default BarcodeScanner;
