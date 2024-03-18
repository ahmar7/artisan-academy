import ProtoTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWindowPosition from "../../Hooks/useWindowPosition";
import Logout from "../Login/Logout";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { colors } from "@mui/material";
function Header({ className, logo, joinBtn, search }) {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const {token} = useSelector(state => state.authReducer)
  const [activeMobileSubMenu, setActiveSubMobileMenu] = useState(false);
  const windowPosition = useWindowPosition();
  const location = useLocation();
  const currentPath = location.pathname;

useEffect(() => { 
  if(windowPosition == 0 )
  setActiveMobileMenu(false)
}
, [windowPosition])
  return (
    <header
   
      className={`${className ? className : "header-01"} sticky ${windowPosition > 0 && "fix-header  animated fadeInDown"
        }  `}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <nav className="navbar navbar-expand-lg">
              {/* logo Start */}
              <Link className="navbar-brand" to="/">
                {(currentPath=="/" || currentPath=="/login" || currentPath=="/register" )?  <img
                  src="assets/images/logo.png" alt="" />:  <img
                  src="assets/images/logoBlue.png" /> }
              
                <img
                  className="sticky-logo"
                  src="assets/images/logoBlue.png"
                  alt=""
                />
              </Link>
              {/* logo End */}

              {/* Moblie Btn Start  */}
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setActiveMobileMenu(!activeMobileMenu)}
              >
                <i className="fal fa-bars"></i>
              </button> 
              {/*  Moblie Btn End  */}

              {/* Nav Menu Start  */}
              <div
                className="collapse navbar-collapse"
                style={{ display: activeMobileMenu && "block" }}
              >
                <ul className="navbar-nav">
                  <li
                  style={{color:"#2c234d"}}
                    className="menu-item-has-children"
                    onClick={() =>
                      setActiveSubMobileMenu(
                        activeMobileSubMenu === "home" ? false : "home"
                      )
                    }
                  >
                    <Link style={{ color:windowPosition > 0 && activeMobileMenu && "#2c234d" }}  to="/">Home</Link>


                  </li>
                  <li
                    className="menu-item-has-children"
                 
                    onClick={() =>
                      setActiveSubMobileMenu(
                        activeMobileSubMenu === "course" ? false : "course"
                      )
                    }
                  >
                    <Link    style={{ color:windowPosition > 0 && activeMobileMenu && "#2c234d" }} to="">The Team</Link>


                  </li>
                  <li
                    className="menu-item-has-children"
                    name="pages"
                    onClick={(e) => {
                      setActiveSubMobileMenu(
                        e.target.name
                          ? e.target.name === activeMobileSubMenu
                            ? "pages"
                            : e.target.name
                          : activeMobileSubMenu === "pages"
                            ? false
                            : "pages"
                      );
                    }}
                  >
                    <Link style={{ color:windowPosition > 0 && activeMobileMenu && "#2c234d" }}  to="">Our Products</Link>


                  </li>
                  {/* <li
                    className="menu-item-has-children"
                    onClick={() =>
                      setActiveSubMobileMenu(
                        activeMobileSubMenu === "blog" ? false : "blog"
                      )
                    }
                  >
                    <a>Blog</a>
                    <span className="submenu-toggler">
                      <i
                        className={`fal ${
                          activeMobileSubMenu === "blog"
                            ? "fa-minus"
                            : "fa-plus"
                        }`}
                      ></i>
                    </span>
                    <ul
                      className="sub-menu"
                      style={{
                        display: activeMobileSubMenu === "blog" && "block",
                      }}
                    >
                      <li>
                        <Link to="/blog">Blog Page</Link>
                      </li>
                      <li>
                        <Link to="/single-post">Blog Details</Link>
                      </li>
                    </ul>
                  </li> */}
                  <li>
                    <Link style={{ color:windowPosition > 0 && activeMobileMenu && "#2c234d" }}  to="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
              {/* Nav Menu End  */}

              {/*  User Btn  */}
              {joinBtn && !token && (
                <Link to="/login" className="user-btn">
                  <i className="ti-user"></i>
                </Link>
              )}
              {/*  User Btn  */}

              {/* Join Btn  */}
              {joinBtn && !token&& (
                <Link to="/register" className="join-btn">
                  Join for Free
                </Link>
              )}
{token && <Logout />}
              {/* Join Btn   */}
              {search && (
                <form className="search-box" method="post" action="#">
                  <input
                    type="search"
                    name="s"
                    placeholder="Search Courses..."
                  />
                  <button type="submit">
                    <i className="ti-search"></i>
                  </button>
                </form>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  className: ProtoTypes.string,
  logo: ProtoTypes.string,
  joinBtn: ProtoTypes.bool,
  search: ProtoTypes.bool,
};

export default Header;
