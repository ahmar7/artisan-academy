import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi ,loginwithGoogle,forgotApi} from "../../Api/Service";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useDispatch} from 'react-redux'
import { styled } from '@mui/system';
import './style.css';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
// import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { GoogleLogin } from '@react-oauth/google';
import {setUserDetails} from '../../store/reducers/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
const StyledTextField = styled(TextField)({
  marginBottom: '15px',
  width: '100%',
});

function ForgotPassword() {
  let location=useLocation()
  const queryParams = new URLSearchParams(location.search);
  // const signIn = useSignIn();
  // const isAuthenticated = useIsAuthenticated();
  // const authUser = useAuthUser();
  const successMessage = queryParams.get("success");
  const [isloading, setisloading] = useState(false);
  const [apiError, setapiError] = useState("");
  const [isCall, setisCall] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const dispatch=useDispatch()
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleTogglePassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const areFieldsEmpty = () => {
    const requiredFields = ["email"];
    return requiredFields.some(field => !userData[field]);
  };

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    value = value.trim();
    setUserData({ ...userData, [name]: value });

    // Validate email
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      setErrors({ ...errors, [name]: "Invalid email address" });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setapiError("")
    setisCall(true);
    try {
      // Check if all fields are filled
      const requiredFields = ["email"];
      const newErrors = {};
      for (const field of requiredFields) {
        if (!userData[field]) {
          newErrors[field] = `The ${field} field is required`;
        }
      }
      setErrors({ ...errors, ...newErrors });

      if (Object.keys(newErrors).length > 0) {
        setisloading(false);
        return;
      }

      let data = {
        email: userData.email,
        password: userData.password,
      };

      const loginResponse = await forgotApi(data);
      console.log('loginResponse: ', loginResponse);

      if (loginResponse.success) {
    
        navigate("/login");
      } else {
        setapiError(loginResponse.message || "Something went wrong, please try again")
   
        
      }
    } catch (error) {
    
      setapiError(error?.data?.message || "Something went wrong, please try again")
      
    } finally {
      setisloading(false);

      setisCall(false);
    }
  };

 

  return (
    <section className="register-section" style={{ backgroundImage: "url(assets/images/own/bg-main.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
       {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          An email link has been sent to your registered email. Please check your inbox.
        </div>
      )}
      
      <div className="container pt-5">
        <div className="row">
          <div className="col-lg-7 col-md-6">
            <h2 className="sec-title mb-15">Welcome back</h2>
            <p className="sec-desc">
              Get 150s of Online <span>Courses for Free</span>
            </p>
            {/* Countdown Start */}
            <div className="devis">

              <img src="assets/images/own/WorkHome.png" alt="" />
            </div>

          </div>
          <div className="col-lg-5 col-md-6">
            <div className="registration-form">
              <h4>Send Eamil</h4>
              <p>verification of change password</p>
              <form onSubmit={handleLogin} method="post">
                <StyledTextField
                  type="email"
                  onChange={handleInput}
                  value={userData.email}
                  name="email"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email}
                />

              
                <Button
                  onClick={handleLogin}
                  disabled={isloading || areFieldsEmpty()||isCall}
                  type="submit"
                  className='reg-byn'
                >
                  {isCall ? <CircularProgress  size={24} color="inherit" /> : "Send Email"}
                </Button>
                {apiError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {apiError}
                  </div>
                )}
                


              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
 