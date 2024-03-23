import logo from '../../asset/logo.png';
import WorkHome from '../../asset/WorkHome.png';
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi ,loginwithGoogle,forgotApi,chnagePassord} from "../../Api/Service";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useDispatch} from 'react-redux'
import { styled } from '@mui/system';
import './style.css';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
// import { useSignIn, useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { GoogleLogin } from '@react-oauth/google';
import {setUserDetails} from '../../store/reducers/auth'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
const StyledTextField = styled(TextField)({
  marginBottom: '15px',
  width: '100%',
});
import '../../asset/bootstrap.css'

function ChangePassword() {
  let location=useLocation()
  const queryParams = new URLSearchParams(location.search);
  let { resetToken } = useParams();
  const successMessage = queryParams.get("success");
  const [isloading, setisloading] = useState(false);
  const [apiError, setapiError] = useState("");
  const [isCall, setisCall] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState("password");
  const dispatch=useDispatch()
  const [userData, setUserData] = useState({
    newPassword: "",
    confirmpassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmpassword: "",
  });

  const handleTogglePassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const areFieldsEmpty = () => {
    const requiredFields = ["newPassword","confirmpassword"];
    return requiredFields.some(field => !userData[field]);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value.trim() });

    if (name === "newPassword" && value.length < 8) {
      setErrors({ ...errors, [name]: "Password is too short." });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const areFieldsValid = () => {
    return userData.newPassword.length >= 8 && userData.newPassword === userData.confirmPassword;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setisCall(true);
    try {
     
     
      if (!areFieldsValid()) {
        setApiError("Please fix the errors before submitting.");
        return;
      }
  
      let data = {
        newPassword: userData.newPassword,
      
      };

      const loginResponse = await chnagePassord(`admin/reset-password/${resetToken}`,data);
      console.log('loginResponse: ', loginResponse);

      if (loginResponse.success) {
        window.location.href ="/login"
     
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
            <a href="/academy">
              <img style={{ width: "100px", marginBottom: "10px" }} src={logo} alt="" /></a>
            <h2 className="sec-title mb-15">Welcome back</h2>
            <p className="sec-desc">
              Get 150s of Online <span>Courses for Free</span>
            </p>
            {/* Countdown Start */}
            <div className="devis">

              <img src={WorkHome} alt="" />
            </div>

          </div>
          <div className="col-lg-5 col-md-6">
            <div className="registration-form">
              <h4>Send Eamil</h4>
              <p>Verification of change password</p>
              <form onSubmit={handleLogin} method="post">
              <StyledTextField
              type="password"
              onChange={handleInput}
              value={userData.newPassword}
              name="newPassword"
              label="New Password"
              error={!!errors.newPassword}
              helperText={errors.newPassword }
            />
            <StyledTextField
              type="password"
              onChange={handleInput}
              value={userData.confirmPassword}
              name="confirmPassword"
              label="Confirm New Password"
              error={userData.confirmPassword !== userData.newPassword}
              helperText={userData.confirmPassword !== userData.newPassword ? "Passwords must match." : ""}
            />
              
                <Button
                  onClick={handleLogin}
                  disabled={isloading || isCall}
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

export default ChangePassword;
 