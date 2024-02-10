import { useEffect, useState } from "react";
import Preloader from "../Component/Preloader/index.jsx";
import Header from "../Component/Headers/index.jsx";
import Register from "../Component/Register/HomeRegister.jsx";

import { Link, Element, scroller } from "react-scroll";
import Footer from "../Component/Footer/Footer.jsx";
import GotoTop from "../Component/GotoTop/index.jsx";
import Home3Register from "../Component/Register/Home3Register.jsx";

function RegisterForm() {
  return (
    <>
      <Header logo="assets/images/logo.png" joinBtn={false} loginBtn={false} />
      <Home3Register />
      {/* <Footer getStart={true} /> */}
      <GotoTop />
    </>
  );
}

export default RegisterForm;
