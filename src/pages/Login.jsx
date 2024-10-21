import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../services/localStorageService';
import { logIn } from '../services/authenticationService';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Đã sửa

    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn hành động mặc định của form

        try {
            const response = await fetch("http://localhost:8080/api/v1/identity/auth/log-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set the content type to JSON
                },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Tài khoản không hợp lệ. Vui lòng kiểm tra lại");
            }

            const data = await response.json();

            console.log("Response body:", data);

            // Kiểm tra nếu người dùng được xác thực
            if (data.authenticated) {
                setToken(data.token); // Lưu token vào localStorage
                navigate("/home"); // Điều hướng về trang chủ
            } else {
                throw new Error("Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!");
            }
        } catch (error) {
            setErrorMessage(error.message); // Hiển thị lỗi trong trang
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-3xl p-4 max-w-4xl w-full">
                
                {/* Left Box */}
                <div className="flex justify-center items-center bg-blue-50 rounded-2xl md:w-1/2 p-4">
                    <img
                        src="/login/Data_security_05 [Converted].png"
                        alt="Security"
                        className="w-4/5"
                    />
                </div>
                
                {/* Right Box */}
                <div className="flex flex-col md:w-1/2 p-10">
                    <div className="text-center mb-2">
                        <img
                            src="/login/logo phong kham.PNG"
                            alt="Logo"
                            className="w-24 mx-auto mb-2"
                        />
                        <h6 className="text-lg font-medium mt-5">Hệ thống quản lý đặt lịch khám chữa bệnh</h6>
                        <h2 className="text-2xl text-blue-900 font-bold mt-7">Đăng nhập</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit}> {/* Thêm handleSubmit */}
                        <div className="mt-4">
                            <label className="block text-md mb-1" htmlFor="username">Tài khoản</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 py-2 mb-4"
                                placeholder=""
                            />
                        </div>
                        
                        <div className="mt-2">
                            <label className="block text-md mb-1" htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 py-2 mb-4"
                                placeholder=""
                            />
                        </div>
                        
                        {errorMessage && (
                            <div className="text-red-500 text-sm mb-4">
                                {errorMessage} {/* Hiển thị thông báo lỗi */}
                            </div>
                        )}
                        
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="mr-2"
                                />
                                <label htmlFor="remember" className="text-gray-600 text-sm">Ghi nhớ mật khẩu</label>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-bold"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
