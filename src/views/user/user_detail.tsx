import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../assets/sass/style.scss';
import body from '../../assets/image/body-login.png';
import Navbar from '../../components/navbar';
import Button from "../../components/button";
import { TbArrowBackUp } from "react-icons/tb";

interface UserDetails {
    id: string;
    avatar: string;
    email: string;
    name: string;
    password: string;
}

const User_Details: React.FC = () => {
    const Id_User = localStorage.getItem('Id');
    const token = localStorage.getItem('token');
    const tokenChecked = useRef<boolean>(false);
    const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
    const navigasi = useNavigate();

    useEffect(() => {
        if (!token && !tokenChecked.current) {
            alert('Silahkan login terlebih dahulu!');
            navigasi('/');
            tokenChecked.current = true;
            return;
        }

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
            } catch (error) {
                console.error('Error fetching user detail:', error);
            }
        };

        if (Id_User) {
            fetchUserDetail();
        } else {
            navigasi('/dashboard');
            console.log('Id tidak ditemukan!');
        }
    }, [token, Id_User, navigasi]);

    const handleBackButton = () => {
        navigasi('/dashboard');
    };

    return (
        <div className="tourist-detail-container" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
            <Navbar />

            <div className="tourist-detail-navigation">
                <Button onClick={handleBackButton}><TbArrowBackUp /> Back to home</Button>
            </div>
            <div className="tourist-detail-box">
                <div className="tourist-detail">
                    <div className="image-tourist">
                        <img src={userDetails.avatar} alt="Profile" />
                    </div>

                    <div className="tourist-detail-info">
                        <table>
                            <tr>
                                <td>Id</td>
                                <td>:</td>
                                <td>{ userDetails.id }</td>
                            </tr>
                            <tr>
                                <td>Nama</td>
                                <td>:</td>
                                <td>{ userDetails.name }</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>:</td>
                                <td>{userDetails.email }</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User_Details