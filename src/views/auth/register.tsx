import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setName, setEmail, setPassword, setShowPassword } from '../../redux/registerSlice';
import { RootState } from '../../redux/store';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../assets/sass/style.scss';
import body from '../../assets/image/body-login.png';
import animaton from '../../assets/image/register-animation.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from "../../components/button";

const Register: React.FC = () => {
    const dispatch = useDispatch();
    const { name, email, password, showPassword } = useSelector((state: RootState) => state.register);
    const navigasi = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        try {
            setError(null);
            if (!email || !password || !name) {
              setError('Form input tidak boleh kosong.');
              return;
            }
            const response = await axios.post(
                "https://biroperjalanan.datacakra.com/api/authaccount/registration",
                `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            console.log('Register success!', response.data)
            navigasi('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error during login:', error.message);
            } else {
                console.error('Unexpected error during login:', error);
            }
        }
    };

    const togglePasswordVisibility = () => {
        dispatch(setShowPassword(!showPassword));
    };

    return (
        <div className="container-register" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
            <div className="register-box">
                <div className="header-register">
                    <img src={animaton} alt="" />
                    <h1>Hallo, Silahkan Buat Akun</h1>
                    <h3>Tourist Web Apps</h3>
                </div>
                <form>
                    <div className="form-header">
                        <h2>Register</h2>
                        <p>Silahkan isi form untuk membuat akun baru</p>
                        {error && <p className="error-message">{error}</p>}
                    </div>
                    <div className="input-name">
                        <label htmlFor="email">Name</label>
                        <input type="text" name="name" id="name" value={name} onChange={(e) => dispatch(setName(e.target.value))} />
                    </div>
                    <div className="input-email">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => dispatch(setEmail(e.target.value))} />
                    </div>
                    <div className="input-pass">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => dispatch(setPassword(e.target.value))}
                            />
                            <div className="eye-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleRegister} color="#346680">Daftar</Button>

                    <p className="register-text">Sudah punya akun? <a href="/">Login</a></p>
                </form>
            </div>
        </div>
    )
}

export default Register