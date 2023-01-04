import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { checkToken } from "../../functions";
import { Context } from "../context/context";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import './main.css'

const AdminPage = () => {
  const {token,role, show, setShow } = useContext(Context);
  const navigate = useNavigate();
  
  useEffect(() =>{
    if(!checkToken(token, role, [2,3,4])){
      navigate('/');
    }
  }, [token, role])

  
  return (
    <div className="container-lg">
        <Header admin='true' show={show} setShow={setShow} />
      <div className="admin__wrapper">
      <Sidebar show={show} />
       <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
