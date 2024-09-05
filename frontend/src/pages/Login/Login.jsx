import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import styles from "./Login.module.css";
import TextInput from "../../components/TextInput/TextInput";
import loginSchema from "../../schemas/LoginSchema";
import { useFormik } from "formik";
import { login } from "../../api/Api";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../../components/MetaData/MetaData";

function Login() {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };

    const response = await login(data);

    if (response.status === 200) {
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };

      dispatch(setUser(user));

      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      setError(response.response.data.message);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: loginSchema,
  });

  return (
    <>
      <MetaData title={"LogIn"} />
      <div className={styles.loginWrapper}>
        <div className={styles.box}>
          <div className={styles.person}>
            <i className="bi bi-person-circle"></i>
          </div>
          <div className={styles.toptext}>
            <h5>Login</h5>
          </div>
        </div>

        <TextInput
          type="text"
          value={values.username}
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="username"
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <TextInput
          type="password"
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="password"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
        <button className={styles.logInButton} onClick={handleLogin}>
          Log In
        </button>
        <span className={styles.bottomTxt}>
          Don't have an account?{" "}
          <button
            className={styles.createAccount}
            onClick={() => navigate("/signup")}
          >
            {" "}
            Register
          </button>
        </span>
        {error != "" ? <p className={styles.errorMessage}>{error}</p> : ""}
      </div>
    </>
  );
}

export default Login;
