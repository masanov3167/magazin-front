import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../functions";
import { Context } from "../context/context";
import './main.css'

const AdminCategoryPage = () => {
  const {link, lang,token,role, setRole, setToken,  fetchHeaders} = useContext(Context);
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
        name:'Kategoriya nomi (uzb)',
        name_oz:`Kategoriya nomi (uzb-kirill)`,
        name_ru:`Kategoriya nomi (ru)`,
        route:`Route (kategoriya sahifasiga havola)`,
        route_err:`Route (kategoriya sahifasiga havola) xato`,
        count:`Kategoriyalar`,
        length:'To`ldirilgan ma`lumotlarizni har biri kamida 3ta harfdan iborat bo`lsin',
        empty_data:'Kategoriya hali joylanmagan',
        error:`Ma'lumotlar kelishida xatolik yuz berdi :( Iltimos sahifani yangilang yoki birozdan so'ng urinib ko'ring!`,
        loading:`Ma'lumotlar yuklanmoqda biroz sabr qiling...`
    },
    ru: {
        name:'Название категории (Узб)',
         name_oz:`Название категории (узб-кириллица)`,
         name_ru:`Название категории (ru)`,
         route:`Route (ссылка на страницу категории)`,
         count:`Категории`,
        length: 'Каждое из ваших заполненных данных должно состоять не менее чем из 3 букв',
        route_err:`Route (ссылка на страницу категории) ошибка`,
        empty_data: 'Категория еще не опубликована',
        home:'Главное меню',
        sign: `Регистрация`,
        success:`Успешный вход в систему!`,
        error:`Произошла ошибка при получении данных :( Пожалуйста, обновите страницу или повторите попытку позже!`,
        loading:`Загрузка данных, подождите...`
    },
    oz: {
        name:'Категория номи (узб)',
        name_oz:`Категория номи (узб-кирилл)`,
        name_ru:`Категория номи (ру)`,
        route:`Route (категория саҳифасига ҳавола)`,
        route_err:`Route (категория саҳифасига ҳавола) хато`,
        count:`Категориялар`,
        length: `Толдирилган маьлумотларизни ҳар бири камида 3та харфдан иборат бўлсин`,
        empty_data: 'Категория ҳали жойланмаган',
        error:`Маълумотлар келишида хатолик юз берди :( Илтимос саҳифани янгиланг ёки бироздан сўнг уриниб кўринг!`,
        loading:`Маълумотлар юкланмоқда бироз сабр qiling...`
    }
})

  const resHandler = res =>{
    if(res.status === 200 && res.success){
        setData({
          fetched: true, data: res.data
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

const CategoryResponseHandler = (res, index) =>{
  if(res.status === 200 && res.success){
    data.fetched = true
    data.data[index] = res.data
    data.error = false
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
      fetch(`${link}/category`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then((data) => resHandler(data))
        .catch(() => setData({ error: true, fetched: false }));
     }
  }, []);

  useEffect(() =>{
    if(!checkToken(token, role, [4])){
      navigate('/admin');
    }
  }, [token, role])

  

  const HandleEditor = (id, index) =>{
    const nameUz = document.querySelector(`.name_uz${index}`).value;
    const nameOz = document.querySelector(`.name_oz${index}`).value;
    const nameRu = document.querySelector(`.name_ru${index}`).value;
    const route  = document.querySelector(`.route${index}`).value;
      if(nameUz.length <3 , nameOz.length <3 , nameRu.length <3){
        alert(about[lang].length);
        return
      }
      if(!route.match(/^[a-z][-a-z0-9]*$/i)){
        alert(about[lang].route_err);
        return
      }
      fetch(`${link}/category/${id}`,{
        method: 'PUT',
        headers: fetchHeaders,
        body: JSON.stringify({
         name_uz : nameUz, name_oz: nameOz,name_ru: nameRu, route 
        })
      })
      .then(res => res.json())
      .then(data => CategoryResponseHandler(data, index))
  }

  const HandleDeleteCategory = (id, index) =>{
    setEdit(false)
    fetch(`${link}/category/${id}`,{
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
    const nameUz = document.querySelector(`.name_uz`).value;
    const nameOz = document.querySelector(`.name_oz`).value;
    const nameRu = document.querySelector(`.name_ru`).value;
    const route  = document.querySelector(`.route`).value;
    if(nameUz.length <3 , nameOz.length <3 , nameRu.length <3){
      alert(about[lang].length);
      return
    }
    if(!route.match(/^[a-z][-a-z0-9]*$/i)){
      alert(about[lang].route_err);
      return
    }
    fetch(`${link}/category`,{
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        name_uz : nameUz, name_oz: nameOz,name_ru: nameRu, route
      })
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

  const HandleRouteRegex = e =>{
    if(!e.target.value.match(/^[a-z][-a-z0-9]*$/i)){
      e.target.value = e.target.value.split('').filter(a => a.match(/^[-a-z][-a-z0-9]*$/i)).join('')
    }
  }

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
                          <input type="text" className='name_uz' required placeholder={about[lang].name}/>
                          <input type="text" className='name_oz' required placeholder={about[lang].name_oz}/>
                          <input type="text" className='name_ru' required placeholder={about[lang].name_ru}/>
                          <input type="text" onInput={HandleRouteRegex} className='route' required placeholder={about[lang].route}/>
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
                          <input type="text" className={`name_uz${index}`} defaultValue={e[`name_uz`]} placeholder={about[lang].name} />
                          <input type="text" className={`name_oz${index}`} defaultValue={e[`name_oz`]} placeholder={about[lang].name_oz}/>
                          <input type="text" className={`name_ru${index}`} defaultValue={e[`name_ru`]} placeholder={about[lang].name_ru}/>
                          <input type="text" onInput={HandleRouteRegex} className={`route${index}`}   defaultValue={e[`route`]} placeholder={about[lang].route}/>
                        </div>
                      ):(
                        <span>{e[`name_${lang}`]}</span>
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
                      <button onClick={() =>HandleDeleteCategory(e.id, index)} className="btn btn-danger"><i className="fa-solid fa-trash"></i></button>
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

export default AdminCategoryPage;
