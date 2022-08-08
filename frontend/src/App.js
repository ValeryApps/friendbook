import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";

function App() {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("http://localhost:5000/users");
  //     const data = await response.json();
  //     console.log(data);
  //   };
  //   fetchData();
  // }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
