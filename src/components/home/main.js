import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Context } from "../context/context";
import Header from "../header/header";
import CustomModal from "../modal/Modal";
import './homeItem.css'

const Main = () => {
  const {link,  mode, lang,modalDisplay, setModalDisplay,fetchHeaders} = useContext(Context);
  
  const [data, setData] = useState({
    fetched: false,
    error: false,
    data: {},
  });

  const [data1, setData1] = useState({
    fetched: false,
    error: false,
    data: {},
  });

  useEffect(() => {
    fetch(`${link}/products`,{
      headers:fetchHeaders
    })
      .then((res) => res.json())
      .then((info) => setData1({ fetched: true, data: info.data.slice(0,100)}))
      .catch(() => setData1({ fetched: false, error: true }));

      fetch(`http://localhost:9000/category`,{
        headers:fetchHeaders
      })
        .then((res) => res.json())
        .then((data) =>
          setData(
            data.status === 200
              ? { fetched: true, data: data.data }
              : { error: true, fetched: false }
          )
        )
        .catch(() => setData({ error: true, fetched: false }));
  }, []);


  return (
    <div className="container">
        <Header data={data} setData={setData} />
      


      <div className="products__list">
        {
            data.fetched && data.data.length > 0 ? (
                data.data.map((e, index) => (
                    <Link key={index} className="products__list__item" to={`/kategoriya/${e.route}`}>
                      <div className="products__list__item__body">
                          <h4>{e[`name_${lang}`]}</h4>
                      </div>
                    </Link>
                ))
            ): data.fetched && data.data.length === 0 ? (
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Topilmadi :(</div>
                  {/* <div className="btn btn-info">Restart &#128259;</div> */}
                </div>
              </div>
            ): data.error && data.fetched === false ? (
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Xatolik &#9888;</div> 
                </div>
              </div>
            ):(
              <div className="loading__wrap">
                <div className="loading__container">
                  <div className="loading__ball"></div>
                  <div className="loading__text">Yuklanmoqda &#9203;</div>
                </div>
              </div>
            )
        }
      </div>
       {
          data1.fetched && data1.data ? (
            <div>
              keldi
              {/* <div dangerouslySetInnerHTML={{ __html: data1.data[0].body_uz }}></div> */}
            </div>
          ):(
            <div>kelmadi</div>
          )
        }
        
        <CustomModal modalDisplay={modalDisplay} setModalDisplay={setModalDisplay} />
    </div>
  );
};

export default Main;
