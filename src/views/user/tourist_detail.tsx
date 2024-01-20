import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../assets/sass/style.scss';
import body from '../../assets/image/body-login.png';
import Navbar from '../../components/navbar';
import Button from "../../components/button";
import Modal from "../../components/modal";
import { TbArrowBackUp } from "react-icons/tb";

interface DetailTourist {
    $id: string;
    createdat: string;
    id: string;
    tourist_email: string;
    tourist_profilepicture: string;
    tourist_location: string;
    tourist_name: string;
}

const Tourist_Details: React.FC = () => {
    const token = localStorage.getItem('token');
    const tokenChecked = useRef<boolean>(false);
    const navigasi = useNavigate();
    const { touristId } = useParams();
    const [userDetail, setUserDetails] = useState<DetailTourist | null>(null); // Perhatikan bahwa saya mengubah ini menjadi satu objek DetailTourist
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!token && !tokenChecked.current) {
            alert('Silahkan login terlebih dahulu!');
            navigasi('/');
            tokenChecked.current = true;
            return;
        }

        if (token || tokenChecked) {
            const fetchDetail = async () => {
                try {
                    const responseDetail = await axios.get(
                        `https://biroperjalanan.datacakra.com/api/Tourist/${touristId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const dataDetail: DetailTourist = responseDetail.data;
                    setUserDetails(dataDetail);
                } catch (error) {
                    console.log('Error fetching detail data!', error);
                }
            };

            fetchDetail();
        }
    }, [token, tokenChecked, navigasi, touristId]);

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const toggleModal = () => {
        setDeleteModalOpen(prevState => !prevState)
    }

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(
                `https://biroperjalanan.datacakra.com/api/Tourist/${touristId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    data: {
                        tourist_email: userDetail?.tourist_email,
                        tourist_name: userDetail?.tourist_name,
                        tourist_location: userDetail?.tourist_location,
                    },
                }
            );
            console.log('Tourist deleted successfully');
            setDeleteModalOpen(false);
            navigasi('/dashboard');
        } catch (error) {
            console.error('Error deleting tourist:', error);
        }
    };

    const handleBackButton = () => {
        navigasi('/dashboard');
    };

    return (
        <div className="tourist-detail-container" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
            <Navbar />

            <div className="tourist-detail-navigation">
                <Button onClick={handleBackButton}><TbArrowBackUp /> Back to home</Button>
            </div>
            {userDetail && (
                <div className="tourist-detail-box">
                    <div className="tourist-detail">
                        <div className="image-tourist">
                            <img src={userDetail.tourist_profilepicture} alt="Profile" />
                        </div>
                        <div className="tourist-detail-info">
                            <table>
                                <tr>
                                    <td>Id</td>
                                    <td>:</td>
                                    <td>{userDetail.id}</td>
                                </tr>
                                <tr>
                                    <td>Nama</td>
                                    <td>:</td>
                                    <td>{userDetail.tourist_name}</td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td>:</td>
                                    <td>{userDetail.tourist_email}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>:</td>
                                    <td>{userDetail.tourist_location}</td>
                                </tr>
                                <tr>
                                    <td>Create At</td>
                                    <td>:</td>
                                    <td>{userDetail.createdat}</td>
                                </tr>
                            </table>
                            <div className="detail-button">
                                <Button onClick={() => navigasi(`/tourist-edit/${userDetail.id}`)}>Edit</Button>
                                <Button onClick={handleDelete}>Delete</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Modal isOpen={isDeleteModalOpen} onClose={toggleModal}>
                <div className="modal-content-dialog">
                    <p>Apakah anda yakin ingin menghapus data tourist tersebut?</p>
                    <div className="modal-footer">
                        <Button onClick={handleConfirmDelete}>Yes</Button>
                        <Button onClick={toggleModal}>No</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Tourist_Details;