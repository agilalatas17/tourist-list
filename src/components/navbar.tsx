import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/image/logo-travel.png";
import "../assets/sass/style.scss";
interface UserDetails {
    id: string;
    avatar: string;
    email: string;
    name: string;
    password: string;
}

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const Id_User = localStorage.getItem('Id');
    const token = localStorage.getItem('token');
    const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response_detailUser = await axios.get(
                    `https://biroperjalanan.datacakra.com/api/users/${Id_User}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("data detail user : ", response_detailUser.data);
                setUserDetails(response_detailUser.data);
                // Handle the user detail data as needed
            } catch (error) {
                console.error('Error fetching user detail:', error);
            }
        };

        if (Id_User) {
            fetchUserDetail();
        }
    }, [token, Id_User]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('Token Telah Dihapus');
        navigate('/');
      };

    const handleEditProfile = () => {
        navigate('/user-detail');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className="navbar-title">
                <h1>Tourist-List</h1>
            </div>
            <div className="navbar-profile">
                <div className="profile-box" onClick={toggleDropdown}>
                    <div className="profile-img">
                        <img src={userDetails.avatar || "https://via.placeholder.com/150"} alt="profile picture" />
                    </div>
                    <div className="profile-name">
                        <p>{userDetails.name}</p>
                    </div>
                </div>
                {showDropdown && (
                    <div className="profile-dropdown">
                        <ul>
                            <li onClick={handleEditProfile}>Detail Profile</li>
                            <hr />
                            <li onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;