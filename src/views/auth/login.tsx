import '../../assets/sass/style.scss';
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../redux/authSlice';
import body from '../../assets/image/body-login.png';
import animaton from '../../assets/image/login-animation.png';
import Button from "../../components/button";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaArrowRightToBracket } from "react-icons/fa6";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigasi = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      setError(null);
      if (!email || !password) {
        setError('Email dan password tidak boleh kosong.');
        return;
      }

      const response = await axios.post(
        "https://biroperjalanan.datacakra.com/api/authaccount/login",
        `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log('Login successful!', response.data);
      const token = response.data.data.Token;
      const Id_User = response.data.data.Id;

      if (token) {
        dispatch(setAuthData({ token, userId: Id_User }));
        navigasi('/dashboard');
        console.log('Navigated to /dashboard');
      }
    } catch (error: unknown) {
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-login" style={{ backgroundImage: `url(${body}), linear-gradient(to bottom, #346680, #0E2954)` }}>
      <div className="login-box">
        <div className="header-login">
          <img src={animaton} alt="" />
          <h1>Hallo, Selamat Datang</h1>
          <h3>di Tourist Web Apps</h3>
        </div>
        <form>
          <div className="form-header">
            <h2>Login</h2>
            <p>Silahkan masukkan email dan password akun anda</p>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="input-email">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-pass">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <Button onClick={handleLogin} color="#346680"><p>Login <FaArrowRightToBracket /></p></Button>
          <p className="register-text">Belum punya akun? <a href="/register">Daftar</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
