import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../Api/Service";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/system';
import './style.css'

import CircularProgress from '@mui/material/CircularProgress';
const StyledTextField = styled(TextField)({
  marginBottom: '15px',
  width: '100%',
});

function Home3Register() {
  const [isloading, setisloading] = useState(false);
  const [verifyP, setverifyP] = useState(false);
  const [isCall, setisCall] = useState(false);

  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const [type2, settype2] = useState("password");
  const [type1, settype1] = useState("password");

  const areFieldsEmpty = () => {
    const requiredFields = ["name", "company", "email", "password", "phone", "title", "services", "cpassword"];
    return requiredFields.some(field => !userData[field]);
  };

  const handleTogglePassword = () => {
    settype1((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const handleTogglePassword1 = () => {
    settype2((prevType) => (prevType === "password" ? "text" : "password"));
  };

  const [userData, setUserData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    phone: "",
    title: "",
    services: "",
    cpassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    phone: "",
    title: "",
    services: "",
    cpassword: "",
  });

  let handleInput = (e) => {
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

    // Validate password length
    if (name === "password") {
      if (/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{15,}$/.test(value)) {
        setverifyP(true);
        setErrors({ ...errors, [name]: "" });
      } else {
        setverifyP(false);
        setErrors({ ...errors, [name]: "Password should have at least 15 alphanumeric characters with one capital letter" });
      }
    }
  };

  const Register = async (e) => {
    e.preventDefault();
    setApiError("")
    setisCall(true);
    try {
      // Check if all fields are filled
      const requiredFields = ["name", "company", "email", "password", "phone", "title", "services", "cpassword"];
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

      // Check if password and confirm password match
      if (userData.password !== userData.cpassword) {
        setErrors({ ...errors, cpassword: "Password and confirm password don't match" });
        setisloading(false);
        return;
      }

      let data = {
        name: userData.name,
        company: userData.company,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        title: userData.title,
        services: userData.services,
      };

      const updateHeader = await registerApi(data);
      console.log('updateHeader: ', updateHeader);

      if (updateHeader.success) {

        navigate("/login?success=true");
      } else {
        setApiError(updateHeader.msg || "An error occurred while registering. Please try again later.")
        // Handle registration failure
      }
    } catch (error) {
      console.log('error: ', error);
      setApiError(error ||"An error occurred while registering. Please try again later.");
      // Handle registration error
    } finally {
      setisloading(false);
      setisCall(false);
    }
  }

  useEffect(() => {
    // Add any additional effects you want to run on component mount
  }, []);

  return (
    <section className="register-section" style={{ backgroundImage: "url(assets/images/own/bg-main.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="container pt-5">
        <div className="row">
          <div className="col-lg-7 col-md-6">
            <h2 className="sec-title mb-15">Register Now</h2>
            <p className="sec-desc">
              Get 150s of Online <span>Courses for Free</span>
            </p>
            <div className="devis">
              <img src="assets/images/own/WorkHome.png" alt="" />
            </div>
          </div>
          <div className="col-lg-5 col-md-6">
            <div className="registration-form">
              <h4>What are you waiting for?</h4>
              <p>Get your free personalized course list</p>
              <form action="#" method="post">
                <StyledTextField
                  type="text"
                  onChange={handleInput}
                  value={userData.name}
                  name="name"
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name}
                />

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
                    type={type1}
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
                    {type1 === "password" ? (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Hide password">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="icon h-5 w-5" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13" />
                        </svg>
                      </div>
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Show password">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="icon h-5 w-5" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </div>

                <div className="in-gp">
                  <StyledTextField
                    type={type2}
                    onChange={handleInput}
                    value={userData.cpassword}
                    name="cpassword"
                    label="Confirm Password"
                    error={!!errors.cpassword}
                    helperText={errors.cpassword}
                  />
                  <Button
                    type="button"
                    onClick={handleTogglePassword1}
                    className="abs-btna"
                  >
                    {type2 === "password" ? (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Hide password">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="icon h-5 w-5" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.79 11.79 0 0 1-4 5.19l-1.42-1.43A9.862 9.862 0 0 0 20.82 12A9.821 9.821 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.821 9.821 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13" />
                        </svg>
                      </div>
                    ) : (
                      <div className="relative flex h-full w-full items-center justify-center" data-tooltip="Show password">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="icon h-5 w-5" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0" />
                        </svg>
                      </div>
                    )}
                  </Button>
                </div>

                <StyledTextField
                  type="number"
                  onChange={handleInput}
                  value={userData.phone}
                  onKeyDown={(e) => ["ArrowUp", "ArrowDown", "e", "E", "+", "-", "*", ""].includes(e.key) && e.preventDefault()}
                  name="phone"
                  label="Phone"
                  error={!!errors.phone}
                  helperText={errors.phone}
                />

                <StyledTextField
                  type="text"
                  onChange={handleInput}
                  value={userData.company}
                  name="company"
                  label="Company"
                  error={!!errors.company}
                  helperText={errors.company}
                />

                <StyledTextField
                  type="text"
                  onChange={handleInput}
                  value={userData.title}
                  name="title"
                  label="Title"
                  error={!!errors.title}
                  helperText={errors.title}
                />

                <StyledTextField
                  type="text"
                  onChange={handleInput}
                  value={userData.services}
                  name="services"
                  label="Speciality Products/Services"
                  error={!!errors.services}
                  helperText={errors.services}
                />

                <Button
                  onClick={Register}
                  disabled={isloading || areFieldsEmpty() || isCall}
                  type="submit"
                  className='reg-byn'
                >


                  {isCall ? <CircularProgress size={24} color="inherit" /> : "Register"}
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


                <button type="button" className="btn btn-google mt-3">
                  <img src='assets/images/own/google.svg' /> Sign up with Google</button>
                <p className='alred'>Already have an account? <Link to="/login">Login here</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home3Register;
