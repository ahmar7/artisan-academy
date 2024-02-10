import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, RequireAuth } from "react-auth-kit";

import Home from "./Pages/Home";
import Home2 from "./Pages/Home-2";
import Home3 from "./Pages/Home-3";
import RegisterForm from "./Pages/Register";
import SignForm from "./Pages/Signin";
import Course1 from "./Pages/Course-1";
import Course2 from "./Pages/Course-2";
import Course3 from "./Pages/Course-3";
import CourseSingle from "./Pages/CourseSingle";
import About1 from "./Pages/About-1";
import About2 from "./Pages/About-2";
import Instructor from "./Pages/Instructor";
import InstructorProfile from "./Pages/InstructorProfile";
import Error from "./Pages/Error";
import Blogs from "./Pages/Blogs";
import SinglePost from "./Pages/SinglePost";
import Contact from "./Pages/Contact";
import GotoTop from "./Component/GotoTop";
; import createStore from "react-auth-kit/createStore";
const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});
export default function RouterData() {
  return (
    // <AuthProvider store={store}>
    //   <BrowserRouter>
    //     <GotoTop />
    //     <Routes>
    //       <Route index path="/" element={<Home />} />
    //       <Route path="/register" element={<RegisterForm />} />
    //       <Route path="/login" element={<SignForm />} />
    //       <Route path="/home-2" element={<Home2 />} />
    //       <Route path="/home-3" element={<Home3 />} />
    //       <Route path="/course-1" element={<Course1 />} />
    //       <Route path="/course-2" element={<Course2 />} />
    //       <Route path="/course-3" element={<Course3 />} />
    //       <Route path="/single-course" element={<CourseSingle />} />
    //       <Route path="/about-1" element={<About1 />} />
    //       <Route path="/about-2" element={<About2 />} />
    //       <Route path="/instructor" element={<Instructor />} />
    //       <Route path="/profile" element={<InstructorProfile />} />
    //       <Route path="/blog" element={<Blogs />} />
    //       <Route path="/single-post" element={<SinglePost />} />
    //       <Route path="/contact" element={<Contact />} />
    //       <Route path="*" element={<Error />} />

    //     </Routes>
    //   </BrowserRouter>
    // </AuthProvider>

      <AuthProvider authType={"cookie"} authName={"auth"}>
      <BrowserRouter>
        {/* <Top /> */}
        <Routes>
          <Route index path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<SignForm />} />
          <Route path="/home-2" element={<Home2 />} />
          <Route path="/home-3" element={<Home3 />} />
          <Route path="/course-1" element={<Course1 />} />
          <Route path="/course-2" element={<Course2 />} />
          <Route path="/course-3" element={<Course3 />} />
          <Route path="/single-course" element={<CourseSingle />} />
          <Route path="/about-1" element={<About1 />} />
          <Route path="/about-2" element={<About2 />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/profile" element={
            <RequireAuth loginPath={"/auth/login"}>
              <InstructorProfile />
            </RequireAuth>
          }   />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/single-post" element={<SinglePost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Error />} />

         
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
