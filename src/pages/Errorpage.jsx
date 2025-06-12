import React from 'react';
import { useLocation } from "react-router-dom";



const Errorpage = () => {

  const location = useLocation();
  const error = location.state?.error;

  return (

    <>
    <div style={{ padding: "2rem", color: "red" }}>
      <b>❌ Something went wrong:</b>
      <h2>{error?.message || "Unknown error"}</h2>
    </div>
    </>
 
  );
};

export default Errorpage;
