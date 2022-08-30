import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import PostPopup from "./components/posts/postpopup/PostPopup";
import Home from "./pages/home";
import Activate from "./pages/home/activate";
import Login from "./pages/login";
import Profile from "./pages/profile/index";
import Reset from "./pages/reset/Reset";

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(false);

  return (
    <>
      {visible && <PostPopup user={user} setVisible={setVisible} />}
      <Routes>
        <Route path="/" element={<Home setVisible={setVisible} />} exact />
        <Route path="/profile" element={<Profile setVisible={setVisible} />} />
        <Route
          path="/profile/:username"
          element={<Profile setVisible={setVisible} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/activate/:token" element={<Activate />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </>
  );
}

export default App;
