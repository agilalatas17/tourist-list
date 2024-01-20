import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/auth/login";
import Register from "./views/auth/register";
import Dashboard from "./views/user/dashboard";
import User_Details from "./views/user/user_detail";
import Tourist_Details from "./views/user/tourist_detail";
import TouristEdit from "./views/user/tourist_edit";
import ErrorPage from "./views/error/error";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user-detail" element={<User_Details />} />
                <Route path="/tourist-detail/:touristId" element={<Tourist_Details />} />
                <Route path="/tourist-edit/:touristId" element={<TouristEdit />} />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    )
}
export default Router