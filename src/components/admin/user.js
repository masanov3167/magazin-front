import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {loginRegex, phoneRegex, numberSplit, checkToken} from '../../functions'
import { Context } from "../context/context";
import InputMask from 'react-input-mask';
import './main.css'

const AdminUserPage = () => {
    const {link, lang,token,role, setRole, setToken,  fetchHeaders } = useContext(Context);   

  const navigate = useNavigate();
  const [edit, setEdit] = useState(false)
  const [add, setAdd] = useState(false)
  
  
  const [data, setData] = useState({
    fetched: false,
    error: false,
    data: [],
  });

  const [about] = useState({
    uz: {
        name:'Ismi',
        num_err:`Telefon raqamingiz xato :( Iltimos e'tibor bilan yozing`,
        login:`Login`,
        parol:`Parol`,
        role:`Role (1,2,3,4 lardan birini tanlang)`,
        role_err:`Role (1,2,3,4 shulardan faqat bittasinigina kiriting) xato`,
        phone:`Telefon raqami`,
        count:`Foydalanuvchilar`,
        length:'To`ldirilgan ma`lumotlarizni har biri kamida 3ta harfdan iborat bo`lsin',
        empty_data:'Foydalanuvchilar hali yo`q',
        error:`Ma'lumotlar kelishida xatolik yuz berdi :( Iltimos sahifani yangilang yoki birozdan so'ng urinib ko'ring!`,
        loading:`Ma'lumotlar yuklanmoqda biroz sabr qiling...`
    },
    ru: {
        name:'Имя',
        num_err:`Ваш номер телефона неверен :( Пожалуйста, вводите внимательно`,
        login:`Логин`,
        parol:`Парол`,
        role:`Role (1,2,3,4 lardan birini tanlang)`,
        role_err:`Role (1,2,3,4 shulardan faqat bittasinigina kiriting) ошибка`,
        phone:`Телефон номер`,
         count:`Юзерлар`,
        length: 'Каждое из ваших заполненных данных должно состоять не менее чем из 3 букв',
        empty_data: 'Категория еще не опубликована',
        error:`Произошла ошибка при получении данных :( Пожалуйста, обновите страницу или повторите попытку позже!`,
        loading:`Загрузка данных, подождите...`
    },
    oz: {
        name:'Исм',
        num_err:`Телефон рақамингиз хато :( Илтимос эътибор билан ёзинг`,
        login:`Логин`,
        parol:`Парол`,
        role:`Role (1,2,3,4 лардан бирини танланг)`,
        role_err:`Role (1,2,3,4 шулардан фақат биттасини танланг) хато`,
        phone:`Телефон номер`,
        count:`Фойдаланувчилар`,
        length: `Толдирилган маьлумотларизни ҳар бири камида 3та харфдан иборат бўлсин`,
        empty_data: 'Категория ҳали жойланмаган',
        error:`Маълумотлар келишида хатолик юз берди :( Илтимос саҳифани янгиланг ёки бироздан сўнг уриниб кўринг!`,
        loading:`Маълумотлар юкланмоқда бироз сабр қилинг...`
    }
})

  const resHandler = res =>{
    if(res.status === 200 && res.success){
        setData({
          fetched: true, data: res.data.filter(a => a.role==1)
        })
        return
    }

    if(res.status === 401 || res.status===498){
      setToken(false);
        setRole(false);
        alert(res.message);
        return
    }

    alert(res.message)
}

const UserResponseHandler = (res, index) =>{
  if(res.status === 200 && res.success){
    data.fetched = true
    data.data[index] = res.data
    data.error = false
    data.data = data.data.filter(a => a.role==1)
      setData({...data});
      setEdit(false)
      alert(res.message);
      return
  }

  if(res.status === 401 || res.status===498){
    setToken(false);
      setRole(false);
      alert(res.message);
      return
  }

  alert(res.message)
}


  useEffect(() => {
     if(checkToken(token, role, [4])){
      fetch(`${link}/users`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then((data) => resHandler(data))
        .catch(() => setData({ error: true, fetched: false }));
     }
  }, []);

  
  const handleInput = e =>{
    if(!e.target.value.match(loginRegex)){
    e.target.value =  e.target.value.split('').filter(a => a.match(loginRegex)).join('')
    }
 }
  

  const HandleEditor = (id, index) =>{
    const name = document.querySelector(`.name${index}`).value;
    const login = document.querySelector(`.login${index}`).value;
    const parol = document.querySelector(`.parol${index}`).value;
    const role  = document.querySelector(`.role${index}`).value;
    const phone  = document.querySelector(`.phone${index}`).value;
      if(name.length <3 || login.length <3 || parol.length <3){
        alert(about[lang].length);
        return
      }
      if(role.length !== 1 || role-0 !==1&&role-0 !==2&&role-0 !==3&&role-0 !==4){
        alert(about[lang].role_err);
        return
      }

      if(phone && !numberSplit(phone).match(phoneRegex)){
        alert(about[lang].num_err);
        return
      }

      const raw = {
        name,
        login,
        parol,
        role
        }

        if(phone && numberSplit(phone).match(phoneRegex)){
            raw.phone= numberSplit(phone)
        }

      fetch(`${link}/users/${id}`,{
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify(raw)
      })
      .then(res => res.json())
      .then(data => UserResponseHandler(data, index))
  }

  const HandleDeleteUser = (id, index) =>{
    setEdit(false)
    fetch(`${link}/users/${id}`,{
      method: 'DELETE',
      headers: fetchHeaders
    })
    .then(res => res.json())
    .then(result => {
      if(result.status === 200 && result.success){
        data.fetched = true
        data.error = false
        data.data.splice(index,1)
          setData({...data});
          alert(result.message);
          return
      }
    
      if(result.status === 401 || result.status===498){
        setToken(false);
          setRole(false);
          alert(result.message);
          return
      }
    
      alert(result.message)
    })
  }

  const HandleCategoryAdd = () =>{
    const name = document.querySelector(`.name`).value;
    const login = document.querySelector(`.login`).value;
    const parol = document.querySelector(`.parol`).value;
    const role  = document.querySelector(`.role`).value;
    const phone  = document.querySelector(`.phone`).value;
    if(name.length <3 || login.length <3 || parol.length <3){
        alert(about[lang].length);
        return
      }
      if(role.length !== 1 || role-0 !==1&&role-0 !==2&&role-0 !==3&&role-0 !==4){
        alert(about[lang].role_err);
        return
      }
      if(phone && !numberSplit(phone).match(phoneRegex)){
        alert(about[lang].num_err);
        return
      }
      const raw = {
        name,
        login,
        parol,
        role
        }

        if(phone && numberSplit(phone).match(phoneRegex)){
            raw.phone= numberSplit(phone)
        }

    fetch(`${link}/admin`,{
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify(raw)
    })
    .then(res => res.json())
    .then(result => {
      if(result.status === 200 && result.success){
        data.fetched = true
        data.error = false
        data.data.unshift(result.data)
        data.data = data.data.filter(a => a.role==1)
          setData({...data});
          setAdd(false)
          alert(result.message);
          return
      }
      if(result.status === 401 || result.status===498){
        setToken(false);
          setRole(false);
          alert(result.message);
          return
      }
      alert(result.message)
    })
  }

  useEffect(() =>{
    if(!checkToken(token, role, [4])){
      navigate('/admin');
    }
  }, [token, role]);

  return (
      <div className="admin__main">
                <div  className="admin__main__hero">
                  <h3>{data.fetched && data.data && data.data.length ===0 ? `${about[lang].empty_data}`:`${about[lang].count}: ${data.data.length}`}</h3>
                  <button onClick={() => (setAdd(!add), setEdit(false))} className="btn btn-primary"><i className="fa-solid fa-plus"></i></button>
                </div>
                {
                  add ? (
                    <div className="add_category__form">
                        <div>
                          <input type="text" className='name' required placeholder={about[lang].name}/>
                          <input type="text" onInput={handleInput} className='login' required placeholder={about[lang].login}/>
                          <input type="text" onInput={handleInput} className='parol' required placeholder={about[lang].parol}/>
                          <input type="text" className='role' required placeholder={about[lang].role}/>
                          <InputMask name="number" className="phone"  mask="+\9\9\8 99 999 99 99" maskChar="*" placeholder={about[lang].phone} />
                        </div>
                        <div>
                          <button onClick={HandleCategoryAdd} className="btn btn-info me-2" type="submit"><i className="fa-solid fa-check"></i></button>
                          <button className="btn btn-danger" onClick={() => setAdd(false)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                  ):(
                    <></>
                  )
                }
          {
            data.fetched && data.data && data.data.length > 0 ? (
                data.data.map((e, index) => (
                  <div key={index} className="category__item">
                    {
                      edit && edit === e.id ? (
                        <div>
                          <input type="text" className={`name${index}`} defaultValue={e[`name`]} placeholder={about[lang].name} />
                          <input type="text" className={`login${index}`} defaultValue={e[`login`]} placeholder={about[lang].login}/>
                          <input type="text" className={`parol${index}`} defaultValue={e[`parol`]} placeholder={about[lang].parol}/>
                          <input type="text" className={`role${index}`} defaultValue={e[`role`]} placeholder={about[lang].role}/>
                          <InputMask name="number" className={`phone${index}`}   defaultValue={e[`phone`]}  mask="+\9\9\8 99 999 99 99" maskChar="*" placeholder={about[lang].phone} />
                        </div>
                      ):(
                        <span>{e[`name`]}  </span>
                      )
                    }
                    <div>
                      {
                        edit && edit === e.id ? (
                          <>
                            <button onClick={() => setEdit(false)} className="btn btn-success me-2"><i className="fa-solid fa-xmark"></i></button>
                            <button onClick={() => HandleEditor(e.id, index)} className="btn btn-danger me-2"><i className="fa-solid fa-check"></i></button>
                          </>
                        ):(
                          <button onClick={() => (setEdit(e.id), setAdd(false))} className="btn btn-info me-2"><i className="fa-solid fa-pen-to-square"></i></button>
                        )
                      }
                      <button onClick={() =>HandleDeleteUser(e.id, index)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
              ))
            ) : data.fetched && data.data && data.data.length === 0 ? (
              <></>
            ) : data.error ? (
              <h2>{about[lang].error}</h2>
            ) : (
              <h2>{about[lang].loading}</h2>
            )
          }
      </div>
  );
};

export default AdminUserPage;