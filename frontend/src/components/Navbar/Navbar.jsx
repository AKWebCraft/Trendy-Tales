import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../api/Api";
import { resetUser } from "../../store/userSlice";

function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth);

  const handleSignout = async () => {
    await signout();
    dispatch(resetUser());
  };

  return (
    <div className={styles.mainheader}>
      <header className="p-3">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <h3 className={styles.logo}>Trendy-Tales</h3>

            <ul className="nav ggg col-12 col-lg-auto me-lg-auto ms-auto mb-2 justify-content-center mb-md-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? styles.activeStyle : styles.inActiveStyle
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="about-us"
                  className={({ isActive }) =>
                    isActive ? styles.activeStyle : styles.inActiveStyle
                  }
                >
                  AboutMe
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="contact-us"
                  className={({ isActive }) =>
                    isActive ? styles.activeStyle : styles.inActiveStyle
                  }
                >
                  ContactMe
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="submit-blog"
                  className={({ isActive }) =>
                    isActive ? styles.activeStyle : styles.inActiveStyle
                  }
                >
                  Submit Blog
                </NavLink>
              </li>
            </ul>

            <div className="text-end">
              {isAuthenticated ? (
                <div>
                  {" "}
                  <NavLink to="login">
                    <button
                      type="button"
                      className="btn btn-outline-light me-2"
                      onClick={handleSignout}
                    >
                      Log Out
                    </button>
                  </NavLink>{" "}
                </div>
              ) : (
                <div>
                  {" "}
                  <NavLink to="login">
                    <button
                      type="button"
                      className="btn btn-outline-light me-2"
                    >
                      Login
                    </button>
                  </NavLink>
                  <NavLink to="signup">
                    <button type="button" className="btn btn-warning">
                      SignUp
                    </button>
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Navbar;
