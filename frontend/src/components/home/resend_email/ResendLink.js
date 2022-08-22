import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import "./resend.css";

const url = `${process.env.REACT_APP_URL}/users/resendVerification`;
const ResendLink = () => {
  const [success, setSucess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const reSendEmail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setLoading(false);
      setSucess(data.message);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  return (
    <div>
      <div className="send_link">
        <span>
          Your email is not verified yet. Your account will be deleted if you do
          not verify it after 30 days from the date of creation.
        </span>
        {!loading && (
          <p onClick={reSendEmail}>Click here to verify your email</p>
        )}
        <PulseLoader color="teal" size={15} loading={loading} />
        {success && <span className="success_text">{success}</span>}
        {error && <span className="error_text">{error}</span>}
      </div>
    </div>
  );
};

export default ResendLink;
