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

const TouristEdit: React.FC = () => {
    const token = localStorage.getItem('token');
    const tokenChecked = useRef<boolean>(false);
    const navigasi = useNavigate();
    const { touristId } = useParams();
    const [userDetail, setUserDetails] = useState<DetailTourist | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [editedTourist, setEditedTourist] = useState({
        name: '',
        email: '',
        location: '',
    });

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

                    setEditedTourist({
                        name: dataDetail.tourist_name || '',
                        email: dataDetail.tourist_email || '',
                        location: dataDetail.tourist_location || '',
                    });
                } catch (error) {
                    console.log('Error fetching detail data!', error);
                }
            };

            fetchDetail();
        }
    }, [token, tokenChecked, navigasi, touristId]);

    const handleEditSubmit = async () => {
        try {
            await axios.put(
                `https://biroperjalanan.datacakra.com/api/Tourist/${touristId}`,
                {
                    tourist_name: editedTourist.name,
                    tourist_email: editedTourist.email,
                    tourist_location: editedTourist.location,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log('Tourist updated successfully');
            navigasi('/dashboard');
        } catch (error) {
            console.error('Error updating tourist:', error);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTourist({
            ...editedTourist,
            [e.target.name]: e.target.value,
        });
    };

    const toggleModal = () => {
        setDeleteModalOpen(prevState => !prevState)
    }

    const handleBackButton = () => {
        navigasi('/dashboard');
    };

    return (
        <div className="tourist-edit-container" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
            <Navbar />

            <div className="tourist-edit-navigation">
                <Button onClick={handleBackButton}><TbArrowBackUp /> Back to home</Button>
            </div>
            {userDetail && (
                <div className="tourist-edit-box">
                    <div className="tourist-edit">
                        <div className="image-tourist">
                            <img src={userDetail.tourist_profilepicture} alt="Profile" />
                        </div>
                        <div className="tourist-edit-info">
                            <input
                                type="text"
                                name="name"
                                placeholder="Masukkan Nama Tourist"
                                value={editedTourist.name}
                                onChange={handleEditChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Masukkan Email"
                                value={editedTourist.email}
                                onChange={handleEditChange}
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Masukkan Lokasi"
                                value={editedTourist.location}
                                onChange={handleEditChange}
                            />
                            <Button onClick={handleEditSubmit}>Update</Button>
                        </div>
                    </div>
                </div>
            )}
            <Modal isOpen={isDeleteModalOpen} onClose={toggleModal}>
                <div className="modal-content-dialog">
                    <p>Apakah anda yakin ingin menghapus data tourist tersebut?</p>
                    <div className="modal-footer">
                        <Button onClick={toggleModal}>No</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TouristEdit;