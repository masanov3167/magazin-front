import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {loginRegex, phoneRegex, numberSplit, Role, checkToken, PostReferalSchema} from '../../functions'
import { Context } from "../context/context";
import './main.css'
import Joi from 'joi-browser'

const AdminOffersPage = () => {
  const {link, lang,token,role, setRole, setToken,  fetchHeaders } = useContext(Context);
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false)
  const [add, setAdd] = useState(false) 
  const [data, setData] = useState({ fetched: false, error: false, data: []});
  const [product, setProduct] = useState({ fetched: false, error: false, data: []});
  const [about] = useState({
    uz: {
        name:'Ismi',
        login:`Login`,
        parol:`Parol`,
        role:`Role (1,2,3,4 lardan birini tanlang)`,
        role_err:`Role (1,2,3,4 shulardan faqat bittasinigina kiriting) xato`,
        phone:`Telefon raqami`,
        count:`Oqimlar`,
        length:'To`ldirilgan ma`lumotlarizni har biri kamida 3ta harfdan iborat bo`lsin',
        empty_data:'Foydalanuvchilar hali yo`q',
        error:`Ma'lumotlar kelishida xatolik yuz berdi :( Iltimos sahifani yangilang yoki birozdan so'ng urinib ko'ring!`,
        loading:`Ma'lumotlar yuklanmoqda biroz sabr qiling...`,
        num_err:`Telefon raqamingiz xato :( Iltimos e'tibor bilan yozing`
    },
    ru: {
        name:'Имя',
        login:`Логин`,
        parol:`Парол`,
        role:`Role (выберите один из 1,2,3,4)`,
        role_err:`Role (1,2,3,4 введите только один из них) ошибка`,
        phone:`Телефон номер`,
         count:`Админи`,
        length: 'Каждое из ваших заполненных данных должно состоять не менее чем из 3 букв',
        empty_data: 'Категория еще не опубликована',
        error:`Произошла ошибка при получении данных :( Пожалуйста, обновите страницу или повторите попытку позже!`,
        loading:`Загрузка данных, подождите...`,
        num_err:`Ваш номер телефона неверен :( Пожалуйста, вводите внимательно`
    },
    oz: {
        name:'Исм',
        login:`Логин`,
        parol:`Парол`,
        role:`Role (1,2,3,4 лардан бирини танланг)`,
        role_err:`Role (1,2,3,4 шулардан фақат биттасини танланг) хато`,
        phone:`Телефон номер`,
        count:`Админлар`,
        length: `Толдирилган маьлумотларизни ҳар бири камида 3та харфдан иборат бўлсин`,
        empty_data: 'Категория ҳали жойланмаган',
        error:`Маълумотлар келишида хатолик юз берди :( Илтимос саҳифани янгиланг ёки бироздан сўнг уриниб кўринг!`,
        loading:`Маълумотлар юкланмоқда бироз сабр қилинг...`,
        num_err:`Телефон рақамингиз хато :( Илтимос эътибор билан ёзинг`
    }
})


  useEffect(() => {
    if(checkToken(token, role, [2,3,4])){
      fetch(`${link}/my-referal`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then(resp => {
          if(resp.status === 200 && resp.success){
            setData({
                fetched: true, data: resp.data
            })
            return
        }
    
        if(resp.status === 401 || resp.status===498){
          setToken(false);
            setRole(false);
            alert(resp.message);
            return
        }
    
        alert(resp.message)
        })
        .catch(() => setData({ error: true, fetched: false }));
     }

     fetch(`${link}/products`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then((data) =>
          setProduct(
            data.status === 200
              ? { fetched: true, data: data.data }
              : { error: true, fetched: false }
          )
        )
        .catch(() => setProduct({ error: true, fetched: false }));
  }, []);

  const HandleEditor = (id, index) =>{
    const title = document.querySelector(`.new_title${index}`).value;
    const product_id = document.querySelector(`.new_product_id${index}`).value;
    const {error, value} = Joi.validate({title, product_id}, PostReferalSchema)
    if(error || value.title.length <3 || !value.product_id){
        alert(about[lang].length);
        return
      }
      fetch(`${link}/referal/${id}`,{
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify({...value})
      })
      .then(res => res.json())
      .then(resp => {
        if(resp.status === 200 && resp.success){
          data.fetched = true
          data.data[index] = resp.data
          data.error = false
            setData({...data});
            setEdit(false)
            alert(resp.message);
            return
        }
      
        if(resp.status === 401 || resp.status===498){
          setToken(false);
            setRole(false);
            alert(resp.message);
            return
        }
      
        alert(resp.message)
      })
  }

  const HandleDeleteProduct = (id, index) =>{
    setEdit(false)
    fetch(`${link}/referal/${id}`,{
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

  const HandleReferalAdd = () =>{
    const title = document.querySelector(`.title`).value;
    const product_id = document.querySelector(`.product_id`).value;

    const {error, value} = Joi.validate({title, product_id}, PostReferalSchema)
    if(error || value.title.length <3 || !value.product_id){
        alert(about[lang].length);
        return
      }
    fetch(`${link}/referal`,{
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({...value})
    })
    .then(res => res.json())
    .then(result => {
      if(result.status === 200 && result.success){
        data.fetched = true
        data.error = false
        data.data.unshift(result.data)
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
    if(!checkToken(token, role, [2,3,4])){
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
                        <input type="text" className={`title`} placeholder={about[lang].name} />
                          <select className="form-control product_id">
                            <option value="false">Kategoriya tanlash majburiy</option>
                            {
                              product.fetched && product.data.length>0 ?(
                                product.data.map((e, key) =>(
                                  <option key={key} value={e.id}>{e[`name_${lang}`]}</option>
                                ))
                              ):(
                                <></>
                              )
                            }
                          </select>
                        </div>
                        <div>
                          <button onClick={HandleReferalAdd} className="btn btn-info me-2" type="submit"><i className="fa-solid fa-check"></i></button>
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
                          <input type="text" className={`new_title${index}`} defaultValue={e[`title`]} placeholder={about[lang].name} />
                          <select defaultValue={e.product_id} className={`form-control mb-2 new_product_id${index}`}>
                            <option  value="false">Mahsulot tanlash majburiy</option>
                            {
                              product.fetched && product.data.length>0 ?(
                                product.data.map((e, key) =>(
                                  <option key={key} value={e.id}>{e[`name_${lang}`]}</option>
                                ))
                              ):(
                                <></>
                              )
                            }
                          </select>
                        </div>
                      ):(
                        <span>{e[`title`]} </span>
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
                      <button onClick={() =>HandleDeleteProduct(e.id, index)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
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

export default AdminOffersPage;
