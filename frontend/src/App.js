import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import PostPopup from "./components/posts/postpopup/PostPopup";
import Home from "./pages/home";
import Activate from "./pages/home/activate";
import Login from "./pages/login";
import Profile from "./pages/profile/index";
import Reset from "./pages/reset/Reset";
import LoggedInRoute from "./routes/LoggedInRoute";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(false);

  return (
    <>
      {visible && <PostPopup user={user} setVisible={setVisible} />}

      <Routes>
        <Route element={<LoggedInRoute />}>
          <Route path="/" element={<Home setVisible={setVisible} />} exact />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/activate/:token" element={<Activate />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </>
  );
}

export default App;
