import React from "react";
import {  Routes, Route } from "react-router-dom";
import Dashboard from "./components/sotuvchi/dashboard";
import Category from "./components/category/Category";
import { Context } from "./components/context/context";
import Main from "./components/home/main";
import Login from "./components/login/login";
import AboutUs from "./components/login/main";
import Register from "./components/login/register";
import AdminPage from "./components/admin/Index";
import AdminUserPage from "./components/admin/user";
import AdminAdminsPage from "./components/admin/admins";
import AdminOffersPage from "./components/admin/offer";
import AdminCategoryPage from "./components/admin/category";
import AdminProductsPage from "./components/admin/products";
import AdminMediasPage from "./components/admin/media";
import AdminNewsPage from "./components/admin/news";

function App() {  
  const {mode} = React.useContext(Context);
  const [load, setLoad] =React.useState(true);
  window.addEventListener('load', () =>{
    setLoad(false)
  })
  window.document.body.setAttribute('class', mode ? 'dark':'light')
  return (
     load ? (
      <div className="loader__wrapper">
        <div className="loader">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style={{enableBackground: 'new 0 0 50 50'}} xmlSpace="preserve">
          <rect x={0} y={0} width={4} height={10} fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin={0} dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x={10} y={0} width={4} height={10} fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x={20} y={0} width={4} height={10} fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
      </div>
     ):(
      <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/about_us" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/master" element={<Dashboard />} />
      <Route path="/admin" element={<AdminPage />}>
          <Route path="/admin/users" element={<AdminUserPage />} />
          <Route path="/admin/categories" element={<AdminCategoryPage />} />
          <Route path="/admin/" element={<AdminOffersPage />}/>
          <Route path="/admin/admins" element={<AdminAdminsPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/medias" element={<AdminMediasPage />} />
          <Route path="/admin/news" element={<AdminNewsPage />} />
      </Route>
      <Route path="/kategoriya/:route" element={<Category />} />
    </Routes>
     )
  );
}

export default App;
