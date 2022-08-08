import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import "../../pages/login/login.css";
import LoginInput from "../../components/inputs/loginInput";
import * as Yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../reducers/userReducer";
import cookie from "js-cookies";
import { PulseLoader } from "react-spinners";

const url = "http://localhost:5000/users/login";
const loginInfo = {
  email: "",
  password: "",
};
const LoginForm = ({ setVisible }) => {
  const [login, setLogin] = useState(loginInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { email, password } = login;
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Email is not valid"),
    password: Yup.string().required("Password is required").min(6),
  });
  const submitLogin = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(url, login);
      setLoading(false);
      dispatch({ type: LOGIN, payload: data });
      cookie.setItem("user", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login_wrapper">
      <div className="login_wrap">
        <div className="login_1">
          <img src="../../icons/facebook.svg" alt="" />
          <span>
            Facebook helps you connect and share with people in your life
          </span>
        </div>
        <div className="login_2">
          <div className="login_2_wrap">
            <Formik
              enableReinitialize
              initialValues={{
                email,
                password,
              }}
              validationSchema={loginValidation}
              onSubmit={submitLogin}
            >
              {(formik) => (
                <Form>
                  <LoginInput
                    placeholder="Email or phone number"
                    type="text"
                    name="email"
                    onChange={handleInputChange}
                  />
                  <LoginInput
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={handleInputChange}
                    bottom
                  />
                  <button type="submit" className="blue_btn" disabled={loading}>
                    {loading ? "Loging you in" : "Log In"}
                    {loading && <PulseLoader color="white" />}
                  </button>
                </Form>
              )}
            </Formik>
            {error && <h6 className="login_error">{error}</h6>}
            <Link to="/" className="forgot_password">
              forgotten password?
            </Link>
            <div className="sign_splitter"></div>
            <button
              className="blue_btn open_signup"
              onClick={() => setVisible(true)}
            >
              Create Account
            </button>
          </div>
          <Link to="/" className="sign_extra">
            <b>Create a page</b> for a celebrity, brand or business
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
