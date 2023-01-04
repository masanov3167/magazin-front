import React, {useState, useContext, useRef, useEffect} from "react"
import { Context } from "../context/context"
import profilImg from '../../files/profile.jpg'
import './header.css'
import { Link, useNavigate } from "react-router-dom"

const Header = ({data, setData, admin,show, setShow}) =>{
    const {mode, setMode, token, setToken, lang, setLang, modalDisplay, setModalDisplay, setRole} = useContext(Context);
    const val = useRef()
    const [ toggle, setToggle] = useState({profil: false, input: false})

    const [about] = useState({
        uz:{
            search:"Qidiruv"
        },
        oz:{
            search:"Қидирув"
        },
        ru:{
            search:"Поиск"
        }
    })

    const closeInput = () =>{
        setToggle({input: false})
        val.current.value = null
    }

    const [language, setLanguage] = useState(false)
   
    const logOut = () =>{
        setToken(false)
        setRole(false)
        setToggle({profil:false})
    }

    const useDebounce = (callback, delay) => {
        const latestCallback = useRef();
        const latestTimeout = useRef();
      
        useEffect(() => {
          latestCallback.current = callback;
        }, [callback]);
      
        return () => {
          if (latestTimeout.current) {
            clearTimeout(latestTimeout.current);
          }
      
          latestTimeout.current = setTimeout(() => { latestCallback.current(); }, delay);
        };
      };

      const handleClick = useDebounce(() =>{
        const searched = data.data.filter(a => a.title.toLowerCase().includes(val.current.value.trim().toLowerCase()))
         setData({isFetched: data.isFetched, error: data.error, data: searched})
        
        } , 1500);

        const [h, setH] = useState(false);
        const navigate = useNavigate();
        const kak = () =>{
            setH(!h);
            setTimeout(() =>{
                navigate('/news')
            }, 1000);

        }

    return (
        <header  className={`header ${mode ? 'dark__shadow' : 'light__shadow'}`}>
            {
                admin?(
                        <i onClick={() => setShow(!show)} className="fa-solid fa-bars"></i>
                ):(
                    <div style={toggle.input ? {'width':'100%'}:{'width':'auto'}} className="form__search" >
                        <input onKeyUp={handleClick} style={mode ? {'color':'white'} : {'color':'black'}}  onBlur={closeInput} ref={val} onFocus={() => setToggle({input: true})} type="text" className="search__input"  required placeholder={`${about[lang].search}...` }/>
                        <svg onClick={closeInput} style={toggle.input ? {'display':'block'}: {"display":"none"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x search-close"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                )
            }
            <ul style={toggle.input ? {'display':'none'}: {"display":"flex"}} className="header__nav">

                <li className="mode__icon__wrapper header__nav__item" onClick={() => setMode(!mode)}>
                <i className={`mode__icon fa-solid ${mode ? 'fa-sun' : 'fa-moon'}`}></i>
                </li>

                <li onClick={() => (setLanguage(!language), setToggle({profil: false}))} className="mode__icon__wrapper header__nav__item lang__btn">
                    <i className={`mode__icon fa-solid fa-language`}></i>

                    <div className={language ? 'lang__wrapper' : 'd-none'}>
                        <span onClick={() => (setLanguage(!language), setLang("uz"))}>UZ</span>
                        <span onClick={() => (setLanguage(!language), setLang("oz"))}>OZ</span>
                        <span onClick={() => (setLanguage(!language), setLang("ru"))}>RU</span>
                    </div>
                </li>

                    <li onClick={kak} className={`mode__icon__wrapper header__nav__item ${h ? 'nav-link' : ''}`} >
                        <i className="mode__icon fa-regular fa-bell"></i>
                    </li>

                    <li  className='mode__icon__wrapper header__nav__item me-2 position-relative'>
                    <i className="mode__icon fa-solid fa-basket-shopping"></i>
                    <span style={{fontSize:'9px', padding:'2px 4px', marginTop:'3px', marginLeft:'40px'}} className={`position-absolute top-0 translate-middle badge rounded-pill ${mode ? 'bg-primary' : 'bg-info'}`}>99+</span>
                </li>

                <li className="header__nav__item">
                        <img onClick={() => token ? (setToggle({profil: !toggle.profil}), setLanguage(false)) : setModalDisplay(!modalDisplay)} alt="avatar" src={profilImg} className="header__avatar rounded-circle" />
                    <div className={toggle.profil ? 'header__avatar__item' : 'd-none'}>

                    <div>
                        <a href="/settings">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        <span>Sozlash</span>
                        </a>
                    </div>
                    <div>
                        <a href="/transformation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-ccw" > <polyline points="1 4 1 10 7 10"></polyline> <polyline points="23 20 23 14 17 14"></polyline> <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path> </svg>
                        <span>Ta'minotchi kabineti</span>
                        </a>
                    </div>
                    
                    <div onClick={logOut}> 
                    <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out" > <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path> <polyline points="16 17 21 12 16 7"></polyline> <line x1="21" y1="12" x2="9" y2="12"></line> </svg>
                    <span>Chiqish</span>
                    </div>
                    </div>
                </li>
            </ul>
        </header>
    )
}

export default Header;