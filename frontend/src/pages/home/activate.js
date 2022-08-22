import { useDispatch, useSelector } from "react-redux";
import LeftHome from "../../components/home/left/index";
import RightHome from "../../components/home/right/index";
import Stories from "../../components/home/stories/index";
import "./home.css";
import CreatePost from "../../components/createPost/index";
import ActivationForm from "../../components/home/ActivateForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import cookie from "js-cookie";
import { VERIFY } from "../../reducers/userReducer";

const url = `${process.env.REACT_APP_URL}/users/activate`;
const Activate = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const activateContact = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          url,
          { token },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess(data.message);
        setLoading(false);
        cookie.set("user", JSON.stringify({ ...user, verified: true }));
        dispatch({ type: VERIFY, payload: true });
        navigate("/login");
      } catch (error) {
        setLoading(false);
        setError(error.response.data.message);
        navigate("/login");
      }
    };
    activateContact();
  }, [token, user, dispatch, navigate]);
  return (
    <div className="home">
      What is this now
      {success && (
        <ActivationForm
          header={"Account verification successful"}
          text={success}
          type={"success"}
          loading={loading}
        />
      )}
      {error && (
        <ActivationForm
          header={"Account verification failed"}
          text={error}
          type={"erro"}
          loading={loading}
        />
      )}
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        <CreatePost user={user} />
      </div>
      <RightHome user={user} />
    </div>
  );
};

export default Activate;
