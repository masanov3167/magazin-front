import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './main.css'
import {loginRegex, phoneRegex, numberSplit} from '../../functions'
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../context/context";
import { useEffect } from "react";
import InputMask from 'react-input-mask';

const Register = () =>{
    const [check, setCheck] = useState(false)
    const navigate = useNavigate()
    const {link, token, setToken, lang ,setRole,fetchHeaders} = useContext(Context)
    const handleInput = e =>{
       if(!e.target.value.match(loginRegex)){
       e.target.value =  e.target.value.split('').filter(a => a.match(loginRegex)).join('')
       }
    }

    const [about] = useState({
        uz: {
            name:'Ismingiz',
            number:'Telefon raqamingiz',
            login:'Login',
            parol: 'Parol',
            accept:[`Barcha shartlarga`, `roziman`],
            home:'Bosh menyu',
            sign: `Ro'yhatdan o'tish`,
            success:`Muvaffaqiyatli tizimga kirildi!`,
            error:`Ma'lumotlar kiritilishida xatolik \n Iltimos e'tibor bilan to'ldiring! `
        },
        ru: {
            name:'Имя',
            number:'Ваш номер телефона',
            login:'Логин',
            parol: 'Пароль',
            accept:[`На все условия`, `Я согласен`],
            home:'Главное меню',
            sign: `Регистрация`,
            success:`Успешный вход в систему!`,
            error:`Ошибка ввода данных \n Пожалуйста, заполните внимательно!`
        },
        oz: {
            name:'Исмингиз',
            number:'Телефон рақамингиз',
            login:'Логин',
            parol: 'Пароль',
            accept:[`Барча шартларга`, `розиман`],
            home:'Бош меню',
            sign: `Рўйҳатдан ўтиш`,
            success:`Муваффақиятли тизимга кирилди!`,
            error:`Маълумотлар киритилишида хатолик \n Илтимос эътибор билан тўлдиринг!`
        }
    })

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
        const {name, login, parol, number} = e.target

        if(name.value.length<3 || login.value.length<3 || parol.value.length<3){
            alert(about[lang].error);
            return
        }

        if(number.value && !numberSplit(number.value).match(phoneRegex)){
            alert(about[lang].error);
            return
        }

        const raw = {
            name: name.value,
            login: login.value,
            parol: parol.value,
            role: 1
        }

        if(number.value && numberSplit(number.value).match(phoneRegex)){
            raw.phone= numberSplit(number.value)
        }

            fetch(`${link}/users`,{
                method:'POST',
                headers:fetchHeaders,
                body: JSON.stringify(raw)
            })
            .then(res => res.json())
            .then(data => resHandler(data))
            .catch(() => alert(about[lang].error))

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
                <h2 className="fw-bold">{about[lang].sign}</h2>
                <form onSubmit={handleSubmit} className="login__form" >
                    <div>
                        <span className="d-block ms-2" >{about[lang].name}</span>
                        <input className="form-control mb-2" type="text" name="name" placeholder={`${about[lang].name} *`} required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >{about[lang].login}</span>
                        <input onInput={handleInput} className="form-control mb-2" type="text" name="login" placeholder={`${about[lang].login} *`} required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >{about[lang].parol}</span>
                        <input onInput={handleInput} className="form-control mb-2" type="text" name="parol" placeholder={`${about[lang].parol} *`} required/>
                    </div>

                    <div>
                        <span className="d-block ms-2" >{about[lang].number}</span>
                        {/* <input  className="form-control mb-2" type="text" name="number" placeholder={about[lang].number} required/> */}
                    <InputMask name="number" className="form-control"  mask="+\9\9\8 99 999 99 99" maskChar="*" placeholder={about[lang].number} />
                    </div>


                    <div className="d-flex align-item-center mb-1">
                        <input type="checkbox" onChange={() => setCheck(!check)} checked={check} />
                        <span className="ms-2"><Link  to='/about_us'>{about[lang].accept[0]}</Link> {about[lang].accept[1]}</span>
                    </div>
                    <button disabled={!check} className="btn btn-info w-100 mb-2" type="submit">{about[lang].sign}</button>
                </form>

                <Link className="btn btn-light w-100 mb-2" to='/login'>{about[lang].login}</Link>
                <Link className="home__url" to='/'>{about[lang].home}</Link>
            </div>
        </div>
    )
}

export default Register;