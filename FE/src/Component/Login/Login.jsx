import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi ,loginwithGoogle} from "../../Api/Service";
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

function Login() {
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
    const requiredFields = ["email", "password"];
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
      const requiredFields = ["email", "password"];
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

      const loginResponse = await loginApi(data);

      if (loginResponse
      //   && signIn({
      //   token: loginResponse.token.token,
      //   expiresIn: 4317,
      //   tokenType: "Bearer",
      //   authState: newData,
      //   sameSite: loginResponse,
      // })
      ) {
        dispatch(setUserDetails({token:loginResponse?.token,userData:loginResponse?.user}))
        navigate("/");
      } else {
        setapiError(loginResponse.msg || "Something went wrong, please try again")
        // setErrors({ ...errors, password: "Invalid email or password" });
        
      }
    } catch (error) {
      // Handle login error
      setapiError(error?.data?.msg || "Something went wrong, please try again")
      
    } finally {
      setisloading(false);

      setisCall(false);
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated() && authUser().user.role === "user") {
  //     navigate("/dashboard");

  //     return;
  //   } else if (isAuthenticated() && authUser().user.role === "admin") {
  //     navigate("/admin/dashboard");
  //   }
  // }, []);
const LoginWithGoogle=async (data)=>{
  const loginResponse = await loginwithGoogle(data);

  if (loginResponse) {
    dispatch(setUserDetails({token:loginResponse?.token,userData:loginResponse?.user}))
    navigate("/");
    toast.success("Login successfully")
  } else {
    
  toast.error("Something went wrong, please try again")
    
  }
}
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
              <h4>Login to Your Account</h4>
              <p>Access your personalized courses</p>
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

                <div className="in-gp">
                  <StyledTextField
                    type={type}
                    onChange={handleInput}
                    value={userData.password}
                    name="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <Button
                    type="button"
                    onClick={handleTogglePassword}
                    className="abs-btna"
                  >
                    {type === "password" ? (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Hide password">
                        {/* Your eye icon for hiding password */}
                      </div>
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Show password">
                        {/* Your eye-slash icon for showing password */}
                      </div>
                    )}
                  </Button>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isloading || areFieldsEmpty()||isCall}
                  type="submit"
                  className='reg-byn'
                >
                  {isCall ? <CircularProgress  size={24} color="inherit" /> : "Login"}
                </Button>
                {apiError && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {apiError}
                  </div>
                )}
                <div className="or-divider">
                  <div className="line"></div>
                  <div className="or-text">OR</div>
                  <div className="line"></div>
                </div>
{/* 
                <button onClick={() => login()} type="button" className=" btn-google mt-3">
                  
                  <img src='assets/images/own/google.svg' /> Sign in with Google</button> */}
<div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>
  <GoogleLogin
    onSuccess={credentialResponse => {
      const decoded = jwtDecode(credentialResponse.credential);
    if(decoded)
    {
      let data = {
        email: decoded.email,
        first_name:decoded.given_name,
        last_name:decoded.family_name,
        profile:decoded.picture,
      };
      LoginWithGoogle(data)
    }
    }}
    onError={() => {
      toast.error("Something went wrong, please try again")
    }}
    size="large"
  />
</div>

                <p className='alred'>Don't have an account? <Link to="/register">Register Now</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
 