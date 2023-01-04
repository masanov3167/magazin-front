import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {checkToken} from '../../functions'
import { Context } from "../context/context";
import './main.css'

// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const AdminMediasPage = () => {
    const {link, lang,token,role, setRole, setToken,  fetchHeaders } = useContext(Context);
    const [copy, setCopy] = useState({display:false, id: false});
   
  const navigate = useNavigate();
  const [add, setAdd] = useState(false)
  
  const [data, setData] = useState({
    fetched: false,
    error: false,
    data: [],
  });

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
        count:`Media fayllar`,
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


// const UserResponseHandler = (res, index) =>{
//   if(res.status === 200 && res.success){
//     data.fetched = true
//     data.data[index] = res.data
//     data.error = false
//     data.data = data.data.filter(a => a.role!==1)
//       setData({...data});
//       setEdit(false)
//       alert(res.message);
//       return
//   }

//   if(res.status === 401 || res.status===498){
//     setToken(false);
//       setRole(false);
//       alert(res.message);
//       return
//   }

//   alert(res.message)
// }


  useEffect(() => {
     if(checkToken(token, role, [3,4])){
      fetch(`${link}/media`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then(result => {
          if(result.status === 200 && result.success){
            setData({
                fetched: true, data: result.data
            })
            return
          }  
          alert(result.message)
        })
        .catch(() => setData({ error: true, fetched: false }));
     }
  }, []);

  const HandleDeleteUser = (id, index) =>{
    fetch(`${link}/media/${id}`,{
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
    const productPic = document.querySelector('.media_pic').files[0];
    if(!productPic){
      alert('rasmini yuklang');
      return
    }
      
      const formdata = new FormData();
      formdata.append('pic', productPic);
  
    fetch(`${link}/media`,{
      method: 'POST',
      headers: {
        'token': token
      },
      body: formdata
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
    .catch(() => alert('catchniki xatosi'))
  }

  const HandleCopyUrl = (url, id) =>{
    const copiedLink = navigator.clipboard.writeText(`${link}/uploads/${url}`);
    if(copiedLink){
      setCopy({display:true, id: id});
      navigator.vibrate(1000)
      setTimeout(() => {
        setCopy({display:false, id: false})
      }, 800);
      }
  }

  useEffect(() =>{
    if(!checkToken(token, role, [3,4])){
      navigate('/admin');
    }
  }, [token, role]);

  return (
      <div className="admin__main">
                <div  className="admin__main__hero">
                  <h3>{data.fetched && data.data && data.data.length ===0 ? `${about[lang].empty_data}`:`${about[lang].count}: ${data.data.length}`}</h3>
                  <button onClick={() => setAdd(!add)} className="btn btn-primary"><i className="fa-solid fa-plus"></i></button>
                </div>
                {
                  add ? (
                    <div className="medias__form">
                          <label className="edit__camera__button">
                                <span>Media joylash uchun bosing +</span>
                              
                                <input className={`form-control media_pic`} type="file" accept="image/*,video/*" capture='user' />
                          </label>
                          <button onClick={HandleProductAdd} className="btn btn-info me-2" type="submit"><i className="fa-solid fa-check"></i></button>
                          <button className="btn btn-danger" onClick={() => setAdd(false)}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ):(
                    <></>
                  )
                }
          <div className="medias__wrapper row">
              {
                data.fetched && data.data && data.data.length > 0 ? (
                    data.data.map((e, index) => (
                      <div key={index} className="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                        <div  className="media__item">
                        <div>
                          <button onClick={() =>HandleDeleteUser(e.id, index)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
                          {
                            copy.display && copy.id === e.id ? (
                              <button className="btn btn-primary w-auto">Nusxalandi</button>
                              ):(
                              <button onClick={() =>HandleCopyUrl(e.url, e.id)} className="btn btn-info"><i className="fa-solid fa-copy"></i></button>
                            )
                          }
                        </div>
                          {
                            e.mimetype === 'image' ?  <img src={link + '/uploads/'+e.url} alt={e.url} /> : <video controls src={link + '/uploads/'+e.url}></video>
                          }
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
      </div>
  );
};

export default AdminMediasPage;