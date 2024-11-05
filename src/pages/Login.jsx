import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../services/localStorageService';
import { CONFIG, API } from '../configurations/configuration';

import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [lastUsername, setLastUsername] = useState('');
    const [lastPassword, setLastPassword] = useState('');

    const showError = (error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    };

    const showInfo= (info) =>{
        toast.info(info, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Kiểm tra nếu người dùng chưa nhập username hoặc password
        if (!username || !password) {
            showInfo('Vui lòng điền đầy đủ thông tin đăng nhập!');
            return;
        }

        // Kiểm tra nếu username và password giống với lần trước đó
        if (username === lastUsername && password === lastPassword) {
            showError('Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!');
            return;
        }

        try {
            const response = await fetch(`${CONFIG.API_GATEWAY}${API.LOGIN}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: username,
                    password: password,
                }),
            });

            const data = await response.json();

            // Nếu thông tin đăng nhập không hợp lệ
            if (!response.ok || !data.authenticated) {
                // Cập nhật lại thông tin đăng nhập cuối cùng
                setLastUsername(username);
                setLastPassword(password);
                
                showError('Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!');
                return;
            }

            // Xác thực thành công, lưu token và điều hướng đến trang chính
            setToken(data.token);
            navigate("/");

        } catch (error) {
            console.error("Error:", error);
            showError('Đã xảy ra lỗi trong quá trình đăng nhập!');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-3xl p-4 max-w-4xl w-full">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Bounce}
                />

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

                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label className="block text-md mb-1" htmlFor="username">Tài khoản</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 py-2 mb-4"
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
                            />
                        </div>

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
