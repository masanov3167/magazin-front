import React, { useState} from 'react';

const Context = React.createContext();

const TokenProvider = ({ children }) => {

    const defaultlang = "uz"
	const [token ,setToken] = useState(JSON.parse(window.localStorage.getItem("token")) || false)
	const [role ,setRole] = useState(JSON.parse(window.localStorage.getItem("role")) || false)
	const [mode ,setMode] = useState(JSON.parse(window.localStorage.getItem("mode")) || false)
    const [lang, setLang] =useState(JSON.parse(window.localStorage.getItem("lang")) || defaultlang)
    const [modalDisplay, setModalDisplay] = useState(false);
    const [show, setShow] = useState(false)
    // const link = 'https://shop-2naa.onrender.com';
    const link = 'http://localhost:9000';
    const fetchHeaders = {
        'Content-type':"application/json",
        'token':token
    }
	
	React.useEffect(() => {
        if(token) {
            window.localStorage.setItem("token", JSON.stringify(token)
            )
        }
        else{
            window.localStorage.removeItem("token");
        }
    }, [token])

    React.useEffect(() => {
        if(role || role===0) {
            window.localStorage.setItem("role", JSON.stringify(role)
            )
        }
        else{
            window.localStorage.removeItem("role");
        }
    }, [role])
    
    React.useEffect(() =>{
        window.localStorage.setItem('mode', mode)
    }, [mode])

    React.useEffect(() =>{
        window.localStorage.setItem('lang', JSON.stringify(lang))
    }, [lang])

    const DataGetter = (url, setMyState ) =>{
        fetch(`${link}/${url}`,{headers:fetchHeaders})
        .then((res) => res.json())
        .then(result => result.status === 200 && result.success ? setMyState({fetched: true, data: result.data, error:false}) : result.status === 401 || result.status===498 ? (setToken(false), setRole(false), alert(result.message)) : alert(result.message))
        .catch(() => (setMyState({ error: true, fetched: false }), alert('ha uka ')));
    }

    const DataPoster = (url, headers, postBody, myState, setMyState,setAdd) =>{
        fetch(`${link}/${url}`,{
            method: 'POST',
            headers: headers,
            body: postBody
          })
          .then(res => res.json())
          .then(result => result.status === 200 && result.success ? (myState.fetched = true, myState.error = false, myState.data.unshift(result.data), setMyState({...myState}), setAdd(false), alert(result.message)) : result.status === 401 || result.status===498 ? (setToken(false), setRole(false), alert(result.message)) : alert(result.message))
          .catch(() => (setMyState({ error: true, fetched: false }), alert('ha uka ')))
        
    }
   
	return (
		<Context.Provider value={{DataPoster,DataGetter,show, setShow, role ,setRole, token ,setToken, mode, setMode, link, fetchHeaders, lang, setLang, modalDisplay, setModalDisplay}}>{children}</Context.Provider>
	);
};

export { Context, TokenProvider };

