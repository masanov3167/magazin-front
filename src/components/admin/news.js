import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken, PostNewsSchema} from '../../functions'
import { Context } from "../context/context";
import './main.css'
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from "react";

import Joi from 'joi-browser'
const AdminNewsPage = () => {
    const {link, lang,token,role, setRole, setToken,  fetchHeaders, DataGetter,DataPoster } = useContext(Context);
    const bodyUz = useRef();
    const bodyOz = useRef();
    const bodyRu = useRef();
    const newBodyUz = useRef();
    const newBodyOz = useRef();
    const newBodyRu = useRef();
   
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false)
  const [add, setAdd] = useState(false)
  
  const [data, setData] = useState({fetched: false,error: false,data: []});

  const [about] = useState({
    uz: {
        name_uz:'Mahsulot nomi (uzb)',
        name_oz:'Mahsulot nomi (ozb-kiril)',
        name_ru:'Mahsulot nomi (ru)',
        price:`Mahsulot narxini kiriting (sum)`,
        money_for_seller:`Sotuvchi uchun bonus puli (sum)`,
        discount:`Chegirma bo'lsa miqdorini kiriting (sum), foiz avto hisoblanadi`,
        kod:`Mahsulot kodini kiriting`,
        parol:`Parol`,
        role:`Role (1,2,3,4 lardan birini tanlang)`,
        role_err:`Role (1,2,3,4 shulardan faqat bittasinigina kiriting) xato`,
        count:`Yangiliklar`,
        length:'To`ldirilgan ma`lumotlarizni har biri kamida 3ta harfdan iborat bo`lsin',
        empty_data:'Mahsulotlar hali yo`q',
        error:`Ma'lumotlar kelishida xatolik yuz berdi :( Iltimos sahifani yangilang yoki birozdan so'ng urinib ko'ring!`,
        loading:`Ma'lumotlar yuklanmoqda biroz sabr qiling...`,
    },
    ru: {
        name_uz:'Название товара (uzb)',
        name_oz:'Название товара (узб-кириллица)',
        name_ru:'Название товара (ru)',
        price:`Введите цену товара`,
        money_for_seller:`Бонусные деньги для продавца`,
        discount:`Если есть скидка, введите сумму (сумму), проценты начисляются автома`,
        kod:`Введите код продукта`,
        parol:`Парол`,
        role:`Role (выберите один из 1,2,3,4)`,
        role_err:`Role (1,2,3,4 введите только один из них) ошибка`,
        phone:`Телефон номер`,
         count:`Админи`,
        length: 'Каждое из ваших заполненных данных должно состоять не менее чем из 3 букв',
        empty_data: 'Tовара еще не опубликована',
        error:`Произошла ошибка при получении данных :( Пожалуйста, обновите страницу или повторите попытку позже!`,
        loading:`Загрузка данных, подождите...`,
        num_err:`Ваш номер телефона неверен :( Пожалуйста, вводите внимательно`
    },
    oz: {
        name_uz:'Маҳсулот номи (узб)',
        name_oz:'Маҳсулот номи (ўзб-кирил)',
        name_ru:'Маҳсулот номи (ру)',
        price:`Маҳсулот нархини киритинг`,
        money_for_seller:`Сотувчи учун бонус пули`,
        discount:`Чегирма бўлса миқдорини киритинг (сум), фоиз авто ҳисобланади`,
        kod:`Маҳсулот кодини киритинг`,
        parol:`Парол`,
        role:`Role (1,2,3,4 лардан бирини танланг)`,
        role_err:`Role (1,2,3,4 шулардан фақат биттасини танланг) хато`,
        phone:`Телефон номер`,
        count:`Админлар`,
        length: `Толдирилган маьлумотларизни ҳар бири камида 3та харфдан иборат бўлсин`,
        empty_data: 'Маҳсулот ҳали жойланмаган',
        error:`Маълумотлар келишида хатолик юз берди :( Илтимос саҳифани янгиланг ёки бироздан сўнг уриниб кўринг!`,
        loading:`Маълумотлар юкланмоқда бироз сабр қилинг...`,
        num_err:`Телефон рақамингиз хато :( Илтимос эътибор билан ёзинг`
    }
})

  useEffect(() => {
     if(checkToken(token, role, [3,4])){
      DataGetter('news', setData)
     }
  }, []);  

  const HandleProductEdit = (id, index) =>{
   
    const inputValues = {
      title_uz: document.querySelector(`.name_uz${index}`).value,
      title_oz: document.querySelector(`.name_oz${index}`).value,
      title_ru: document.querySelector(`.name_ru${index}`).value,
      body_uz: newBodyUz.current.getContent(),
      body_oz: newBodyOz.current.getContent(),
      body_ru: newBodyRu.current.getContent()
    }

    if(inputValues.title_uz.length <3 || inputValues.title_oz.length <3 || inputValues.title_ru.length <3 || inputValues.body_uz.length <10 || inputValues.body_oz.length <10 || inputValues.body_ru.length <10){
      alert('length');
      return
    }    

    const {error, value} = Joi.validate({...inputValues}, PostNewsSchema)
    if(error){
      console.log(error);
        alert('error');
        return
      }    

      fetch(`${link}/news/${id}`,{
        method: 'PUT',
        headers:fetchHeaders,
        body: JSON.stringify(value)
      })
      .then(res => res.json())
      .then(result => {
        if(result.status === 200 && result.success){
          data.fetched = true
          data.error = false
          data.data[index] = result.data
            setData({...data});
            setEdit(false)
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
      .catch(e => console.log(e))
  }

  const HandleDeleteUser = (id, index) =>{
    setEdit(false)
    fetch(`${link}/news/${id}`,{
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

  const HandleProductAdd = () =>{
    const inputValues = {
      title_uz: document.querySelector(`.name_uz`).value,
      title_oz: document.querySelector(`.name_oz`).value,
      title_ru: document.querySelector(`.name_ru`).value,
      body_uz: bodyUz.current.getContent(),
      body_oz: bodyOz.current.getContent(),
      body_ru: bodyRu.current.getContent()
    }

    if(inputValues.title_uz.length <3||  inputValues.title_oz.length <3||  inputValues.title_ru.length <3||  inputValues.body_uz.length <10||  inputValues.body_oz.length <10||  inputValues.body_ru.length <10){
      alert('length');
      return
    }
   
    const {error, value} = Joi.validate({...inputValues}, PostNewsSchema)
    if(error){
        alert('error');
        return
      }

      // url, headers, postBody, myState, setMyState,setAdd
      DataPoster('news',fetchHeaders,JSON.stringify(value), data, setData, setAdd)

    // fetch(`${link}/news`,{
    //   method: 'POST',
    //   headers: fetchHeaders,
    //   body: JSON.stringify(value)
    // })
    // .then(res => res.json())
    // .then(result => {
    //   if(result.status === 200 && result.success){
    //     data.fetched = true
    //     data.error = false
    //     data.data.unshift(result.data)
    //       setData({...data});
    //       setAdd(false)
    //       alert(result.message);
    //       return
    //   }
    //   if(result.status === 401 || result.status===498){
    //     setToken(false);
    //       setRole(false);
    //       alert(result.message);
    //       return
    //   }
    //   alert(result.message)
    // })
    // .catch(() => alert('catchniki xatosi'))
  }

  useEffect(() =>{
    if(!checkToken(token, role, [3,4])){
      navigate('/admin');
    }
  }, [token, role]);
  return (
      <div className="admin__main">
                <div  className="admin__main__hero">
                  <h3>
                    {
                      data.fetched && data.data && !data.error ? (
                        data.data.length > 0 ? `${about[lang].count}: ${data?.data.length}` : `${about[lang].empty_data}`
                      ):(
                        <></>
                      )
                    }
                  </h3>
                  <button onClick={() => (setAdd(!add), setEdit(false))} className="btn btn-primary"><i className="fa-solid fa-plus"></i></button>
                </div>
                {
                  add ? (
                    <div className="products__form">
                        <div className="products__form__left">
                          <input type="text" className='form-control name_uz' required placeholder={about[lang].name_uz}/>
                          <input type="text" className='form-control name_oz' required placeholder={about[lang].name_oz}/>
                          <input type="text" className='form-control name_ru' required placeholder={about[lang].name_ru}/>
                          <Editor onInit={(evt, editor) => bodyUz.current = editor} initialValue={``} init={{height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (uzb)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} /> <br/>
                          <Editor onInit={(evt, editor) => bodyOz.current = editor} initialValue={``} init={{height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (ozb-kirill)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} /> <br/>
                          <Editor onInit={(evt, editor) => bodyRu.current = editor} initialValue={``} init={{height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (rus)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} />
                        </div>
                        <div className="products__form__right">
                          <button onClick={HandleProductAdd} className="btn btn-info me-2" type="submit"><i className="fa-solid fa-check"></i></button>
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
                  <React.Fragment key={index}>
                  {
                    edit && edit===e.id ? (
                      <div id={`news${index+1}`} className="products__form">
                          <div className="products__form__left">
                            <input type="text" className={`form-control name_uz${index}`} defaultValue={e.title_uz} placeholder={about[lang].name_uz}/>
                            <input type="text" className={`form-control name_oz${index}`} defaultValue={e.title_oz} placeholder={about[lang].name_oz}/>
                            <input type="text" className={`form-control name_ru${index}`} defaultValue={e.title_ru} placeholder={about[lang].name_ru}/>
                            <Editor onInit={(evt, editor) => newBodyUz.current = editor} initialValue={e.body_uz} init={{selector: 'textarea#mytextarea',height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (uzb)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} /> <br/>
                            <Editor onInit={(evt, editor) => newBodyOz.current = editor} initialValue={e.body_oz} init={{height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (ozb-kirill)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} /> <br/>
                            <Editor onInit={(evt, editor) => newBodyRu.current = editor} initialValue={e.body_ru} init={{height: 300, menubar: true,placeholder:'Mahsulot haqida batafsil (rus)',  plugins: ['advlist autolink lists link image charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount image code'],  toolbar: 'undo redo | formatselect | ' +'bold italic backcolor | alignleft aligncenter ' +'alignright alignjustify | bullist numlist outdent indent | ' +'removeformat | help | image | media | link | code | code',  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'}} />
                          </div>
                          <div className="products__form__right">
                            <button onClick={() => HandleProductEdit(e.id, index)} className="btn btn-info me-2" type="submit"><i className="fa-solid fa-check"></i></button>
                            <button className="btn btn-danger" onClick={() => setEdit(false)}><i className="fa-solid fa-xmark"></i></button>
                          </div>
                        </div>
                    ):(

                  <div key={index} className="category__item">
                      <span>{e[`title_${lang}`]} </span>
                    <div>
                      <a href={`#news${index+1}`} onClick={() => (setEdit(e.id), setAdd(false))} className="btn btn-info me-2"><i className="fa-solid fa-pen-to-square"></i></a>
                      <button onClick={() =>HandleDeleteUser(e.id, index)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                    )
                  }
                  </React.Fragment>
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

export default AdminNewsPage;