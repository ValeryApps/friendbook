import React from "react";
import Header from "../../components/header";

const Home = () => {
  return (
    <>
      <Header />
      <div
        style={{
          width: "400px",
          height: "400px",
          background: "red",
          left: "23px",
          position: "absolute",
        }}
      ></div>
    </>
  );
};

export default Home;
