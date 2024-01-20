import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/button';
import '../../assets/sass/style.scss';
import body from '../../assets/image/body-login.png';
import { IoLocationSharp } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import Navbar from '../../components/navbar';
import Modal from '../../components/modal';
import {
  setCurrentPage,
  setTourists,
  setTotalPages,
  setSearchTerm,
  setIsModalOpen,
  setNewTourist,
  selectTourist,
} from '../../redux/listSlice';
import { useDispatch, useSelector } from 'react-redux';

interface Tourist {
  $id: string;
  createdat: string;
  id: string;
  tourist_email: string;
  tourist_profilepicture: string;
  tourist_location: string;
  tourist_name: string;
}

interface ApiResponse {
  page: string;
  per_page: number;
  totalrecord: number;
  total_pages: number;
  data: Tourist[];
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPage, totalPages, tourists, searchTerm, isModalOpen, newTourist } = useSelector(selectTourist);
  const navigasi = useNavigate();
  const token = localStorage.getItem('token');
  const tokenChecked = useRef<boolean>(false);
  const debounceTimeoutRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token && !tokenChecked.current) {
      alert('Silahkan login terlebih dahulu!');
      navigasi('/');
      tokenChecked.current = true;
      return;
    }

    if (token || tokenChecked) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://biroperjalanan.datacakra.com/api/Tourist?page=${currentPage}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = response.data as ApiResponse;
          dispatch(setTotalPages(data.total_pages));

          const filteredTourists = data.data.filter(tourist =>
            tourist.tourist_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          dispatch(setTourists(filteredTourists));

          console.log('render data');
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      debounceTimeoutRef.current = window.setTimeout(fetchData, 500);
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }

  }, [currentPage, navigasi, token, tokenChecked, searchTerm, dispatch]);

  const deleteTourist = async (touristId: string, email: string, location: string, name: string) => {
    try {
      const responseDelete = await axios.delete(
        `https://biroperjalanan.datacakra.com/api/Tourist/${touristId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            tourist_email: email,
            tourist_location: location,
            tourist_name: name,
          },
        }
      );
  
      const dataDeleted = responseDelete.data;
      console.log('User deleted successfully:', dataDeleted);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
  const handleDelete = (touristId: string, email: string, location: string, name: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      deleteTourist(touristId, email, location, name);
    }
  }

  const AddTourist = async () => {
    try {
      const responseAdd = await axios.post(
        `https://biroperjalanan.datacakra.com/api/Tourist`,
        {
          tourist_name: newTourist.name,
          tourist_email: newTourist.email,
          tourist_location: newTourist.location,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const dataAdded = responseAdd.data;
      console.log('User added successfully:', dataAdded);
      
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleAddTourist = () => {
    if (!newTourist.name || !newTourist.email || !newTourist.location) {
      setError('Form input tidak boleh ada yang kosong.');
      return;
    }

    AddTourist();
    dispatch(setIsModalOpen(false));
  };

  const handleInputTourist = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setNewTourist({
        ...newTourist,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleEdit = (touristId: string) => {
    navigasi(`/tourist-edit/${touristId}`);
  };

  const handleSelect = (touristId: string) => {
    navigasi(`/tourist-detail/${touristId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hapus timeout sebelumnya
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <div className="tourist-list-container" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
      <Navbar />

      <div className="navigation-list">
        <div className="search-tourist">
          <input type="text" placeholder='Cari data Tourist'
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="nav-button">
          <Button onClick={() => dispatch(setIsModalOpen(true))}><FaUserPlus /> Add Tourist</Button>
        </div>
      </div>

      <div className="list-tourist-box">
        {tourists.map((tourist) => (
          <ul key={tourist.id}>
            <li className="profile-pict" onClick={() => handleSelect(tourist.id)}>
              <img src={tourist.tourist_profilepicture} alt="picture tourist" />
              {tourist.tourist_name}
            </li>
            <li className='location'>
              <IoLocationSharp />{tourist.tourist_location}
            </li>
            <li className='action'>
              <p><FiEdit onClick={() => handleEdit(tourist.id)} /></p>
              <p><MdDeleteForever onClick={() => handleDelete(tourist.id, tourist.tourist_email, tourist.tourist_location, tourist.tourist_name)} /></p>
            </li>
          </ul>
        ))}

        <div className="pagination">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>Prev</Button>
          <select id="pageSelect" value={currentPage} onChange={(e) => handlePageChange(Number(e.target.value))}>
            {Array.from({ length: totalPages }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => dispatch(setIsModalOpen(false))}>
        <div className="modal-header">
          <h2>Add Tourist</h2>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="modal-content-input">
          <input
            type="text"
            name="name"
            id=""
            placeholder="Masukkan nama"
            value={newTourist.name}
            onChange={handleInputTourist}
          />
          <input
            type="email"
            name="email"
            id=""
            placeholder="Masukkan email"
            value={newTourist.email}
            onChange={handleInputTourist}
          />
          <input
            type="text"
            name="location"
            placeholder="Masukkan lokasi"
            value={newTourist.location}
            onChange={handleInputTourist}
          />
        </div>
        <div className="modal-footer">
          <Button onClick={handleAddTourist}>Add</Button>
          <Button onClick={() => dispatch(setIsModalOpen(false))} color="red">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;