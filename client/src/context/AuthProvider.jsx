import React, { createContext, useEffect, useState } from "react"
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

// Tạo một context để chứa thông tin về trạng thái xác thực của người dùng
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    // Sử dụng useState để lưu trữ trạng thái của người dùng
    const [user, setUser] = useState({});
    // Sử dụng hook useNavigation từ react-router-dom để điều hướng đến các route
    const navigate = useNavigate();

    // Lấy instance của firebase auth
    const auth = getAuth()
    console.log({ auth })

    // Sử dụng useEffect để thực hiện các tác vụ sau khi component được render
    useEffect(() => {
        // Đăng ký một hàm callback để lắng nghe sự kiện thay đổi trong token của người dùng
        const unsubscribed = auth.onIdTokenChanged((user) => {
            // In ra console thông tin về người dùng sau khi token thay đổi
            console.log('[From AuthProvider]', { user });
            // Nếu tồn tại user và user có uid (được sử dụng để xác định user đã đăng nhập)
            if (user?.uid) {
                // Cập nhật trạng thái của người dùng
                setUser(user);
                // Lưu accessToken vào localStorage để sử dụng sau này
                localStorage.setItem('accessToken', user.accessToken);
                return;
            }

            // Nếu không tồn tại user hoặc user không có uid (user chưa đăng nhập hoặc đã đăng xuất)
            // Đặt lại thông tin user và xóa accessToken từ localStorage
            setUser({});
            localStorage.clear();
            // Điều hướng đến trang đăng nhập
            navigate('/login');
        });

        // Trả về một hàm hủy để loại bỏ sự kiện lắng nghe khi component unmount
        return () => {
            unsubscribed();
        }
    }, [auth])

    // Trả về AuthContext.Provider để cung cấp thông tin về trạng thái xác thực
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
};