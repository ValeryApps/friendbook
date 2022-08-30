import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import LoginForm from "../../components/login/LoginForm";
import RegisterForm from "../../components/login/RegisterForm";
import cookies from "js-cookie";

const Login = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    cookies.remove("user");
  }, []);
  return (
    <div className="login">
      <LoginForm setVisible={setVisible} />
      {visible && <RegisterForm setVisible={setVisible} />}
      <Footer />
    </div>
  );
};

export default Login;
