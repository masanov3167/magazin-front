import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/context";
import './modal.css'


const CustomModal = ({modalDisplay, setModalDisplay}) =>{
const {lang} = useContext(Context)
const [about]= useState({
    uz:{
        title:'Kechirasiz, avval saytimizda profil yaratishingiz kerak',
        login: 'Profilga kirish',
        sign: 'Ro`yhatdan o`tish'
    },
    oz:{
        title:`Кечирасиз, аввал сайтимизда профиль яратишингиз керак`,
        login:`Профилга кириш`,
        sign:`Рўйҳатдан ўтиш`
    },
    ru:{
        title:'Извините, сначала вам нужно создать профиль на нашем сайте',
         login: 'Вход в профиль',
         sign: 'Регистрация'
    }
})

const modalCloser = e =>{
    if(!e.target.matches('modal__content')){
        setModalDisplay(!modalDisplay)
    }
}
    return(
        <>
            {
            modalDisplay ? (
                <div onClick={modalCloser} className="modal__wrapper">
                    <div className="modal__content">
                        <h3>{about[lang].title}</h3>

                        <div>
                            <Link className="btn btn-info" to='/login'><i className="fa-solid fa-right-to-bracket"></i> {about[lang].login}</Link>
                            <Link className="btn btn-danger" to='/register'><i className="fa-solid fa-address-card"></i> {about[lang].sign}</Link>
                        </div>
                    </div>
                </div>
            ):(
                <></>
            )
            }
        </>
    )
}

export default CustomModal;