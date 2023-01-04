import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../context/context";
import './sidebar.css'

const Sidebar = ({show}) =>{
    const {lang, role} = useContext(Context)
    const [nav]= useState([
        {title: {uz:'Kategoriyalar', oz:'Категориялар', ru:'Категории'}, link:'/admin/categories', icon:'fa-brands fa-slack', role:[4]},
        {title: {uz:'Foydalanuvchilar', oz:'Фойдаланувчилар', ru:'Пользователи'}, link:'/admin/users', icon:'fa-solid fa-users', role:[4]},
        {title: {uz:'Adminlar', oz:'Админлар',ru:'Админы'}, link:'/admin/admins', icon:'fa-solid fa-user-nurse', role:[4]},
        {title: {uz:'Mahsulotlar',oz:'Маҳсулотлар',ru:'Продукты'}, link:'/admin/products', icon:'fa-solid fa-mug-hot', role:[3,4]},
        {title: {uz:'Oqimlar',oz:'Оқимлар',ru:'Токи'}, link:'/admin', icon:'fa-sharp fa-solid fa-seedling', role:[2,3,4]},
        {title: {uz:'Medialar',oz:'Медиалар',ru:'Файлы'}, link:'/admin/medias', icon:'fa-solid fa-photo-film', role:[3,4]},
        {title: {uz:'Yangiliklar',oz:'Янгиликлар',ru:'Новости'}, link:'/admin/news', icon:'fa-sharp fa-solid fa-bell', role:[3,4]}
    ]);

    const filter = arr => arr.filter(e => e.role.some(a => a===Number(role)));

    return(
        <div className={`sidebar ${show ? 'show': ''}`}>
            {
                filter(nav).map((e, index) => (
                    <NavLink key={index} className='sidebar__item' to={e.link}><i className={e.icon}></i> {e.title[lang]} </NavLink>
                    ))
                }
                <NavLink  className='sidebar__item down__sidebar' to='/'><i className="fa-solid fa-right-from-bracket"></i> {lang === 'oz'? 'Бош меню' : lang ==='ru' ? 'Главное меню' :'Bosh menyu'} </NavLink>
        </div>
    )
}

export default Sidebar;