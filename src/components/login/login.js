import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './main.css'
import {loginRegex} from '../../functions'
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../context/context";
import { useEffect } from "react";

const Login = () =>{
    const [check, setCheck] = useState(false)
    const [about] = useState({
        uz: {
            enter: 'Tizimga kirish',
            login:'Login',
            parol: 'Parol',
            accept:[`Barcha shartlarga`, `roziman`],
            home:'Bosh menyu',
            sign: `Ro'yhatdan o'tish`,
            success:`Muvaffaqiyatli tizimga kirildi!`,
            error:`Ma'lumotlar kiritilishida xatolik \n Iltimos e'tibor bilan to'ldiring! `
        },
        ru: {
            enter: 'Авторизоваться',
            login:'Логин',
            parol: 'Пароль',
            accept:[`На все условия`, `Я согласен`],
            home:'Главное меню',
            sign: `Регистрация`,
            success:`Успешный вход в систему!`,
            error:`Ошибка ввода данных \n Пожалуйста, заполните внимательно!`
        },
        oz: {
            enter: 'Тизимга кириш',
            login:'Логин',
            parol: 'Пароль',
            accept:[`Барча шартларга`, `розиман`],
            home:'Бош меню',
            sign: `Рўйҳатдан ўтиш`,
            success:`Муваффақиятли тизимга кирилди!`,
            error:`Маълумотлар киритилишида хатолик \n Илтимос эътибор билан тўлдиринг!`
        }
    })
    const navigate = useNavigate()
    const {link, token, setToken, lang ,setRole,fetchHeaders} = useContext(Context)
    const handleInput = e =>{
       if(!e.target.value.match(loginRegex)){
       e.target.value =  e.target.value.split('').filter(a => a.match(loginRegex)).join('')
       }
    }

    const resHandler = res =>{
        if(res.status === 200 && res.success){
            setToken(res.token);
            setRole(res.role);
            alert(about[lang].success)
            return
        }

        setToken(false)
        setRole(false)
        alert(about[lang].error)
    }

    const handleSubmit = e =>{
        e.preventDefault();
        const {login, parol} = e.target
        if(login.value.length<3 || parol.value.length<3){
            alert(about[lang].error)
        }

        if(login.value.length>=3 || parol.value.length>=3){
            fetch(`${link}/user_login`,{
                method:'POST',
                headers:fetchHeaders,
                body: JSON.stringify({
                    login: login.value,
                    parol: parol.value
                })
            })
            .then(res => res.json())
            .then(data => resHandler(data))
            .catch(() => alert(about[lang].error))
        }

        e.target.reset()
    }

    useEffect(() =>{
        if(token){
            navigate('/')
        }
    }, [token])

     return (
        <div className="login__wrapper">
            <div className="login__content">
                <h2 className="fw-bold">{about[lang].enter}</h2>
                <form onSubmit={handleSubmit} className="login__form" >
                    <div>
                        <span className="d-block ms-2" >{about[lang].login}</span>
                        <input onInput={handleInput} className="form-control mb-3" type="text" name="login" placeholder={`${about[lang].login} *`} required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >{about[lang].parol}</span>
                        <input onInput={handleInput} className="form-control mb-3" type="text" name="parol" placeholder={`${about[lang].parol} *`} required/>
                    </div>

                    <div className="d-flex align-item-center mb-1">
                        <input type="checkbox" onChange={() => setCheck(!check)} checked={check} />
                        <span className="ms-2"><Link  to='/about_us'>{about[lang].accept[0]}</Link> {about[lang].accept[1]}</span>
                    </div>
                    <button disabled={!check} className="btn btn-info w-100 mb-2" type="submit">{about[lang].login}</button>
                </form>

                <Link className="btn btn-light w-100 mb-2" to='/register'>{about[lang].sign}</Link>
                <Link className="home__url" to='/'>{about[lang].home}</Link>
            </div>
        </div>
    )
}

export default Login;