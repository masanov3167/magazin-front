import React from "react";
import Joi  from "joi-browser";

const loginRegex = /^[a-z][-a-z0-9]*$/i;
const phoneRegex = /^[+]998[389][012345789][0-9]{7}$/

const numberSplit = num => num.split('').filter(e => e!==' ' && e !== '*').join('');

const checkToken = (token,role, roles) =>{
    if(!token || !role){
        return false
    }
    if(!roles.some(a => a === role)){
        return false;
    }

    if(token && !token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)){
        return false
    }
    return true
}

const PostProductSchema = {
    name_uz: Joi.string().required(),
    name_oz: Joi.string().required(),
    name_ru: Joi.string().required(),
    body_uz: Joi.string().min(10).required(),
    body_oz: Joi.string().min(10).required(),
    body_ru: Joi.string().min(10).required(),
    price: Joi.number().min(10000).required(),
    money_for_seller: Joi.number().min(1000).required(),
    discount: Joi.number(),
    category_id: Joi.number().required()
  };
  const PostNewsSchema = {
    title_uz: Joi.string().required(),
    title_oz: Joi.string().required(),
    title_ru: Joi.string().required(),
    body_uz: Joi.string().min(10).required(),
    body_oz: Joi.string().min(10).required(),
    body_ru: Joi.string().min(10).required()
  };
  const PostReferalSchema = {
    title: Joi.string().min(3),
    product_id: Joi.number()
  };

const Role = ({userRole, lang}) => {
    const [about] = React.useState({
            uz:{
                role1:`User`,
                role2:`Sotuvchi`,
                role3:`Admin`,
                role4:`Super admin`
            },
            oz:{
                role1:`Юзер`,
                role2:`Сотувчи`,
                role3:`Админ`,
                role4:`Супер админ`
            },
            ru:{
                role1:`Продавец`,
                role2:`Продавец`,
                role3:`Администратор`,
                role4:`Супер администратор`
            }
    });

    return <mark style={{fontSize:'11px', padding:'2px', borderRadius:'5px'}} >  {userRole === 1 ? about[lang].role1 : userRole === 2 ? about[lang].role2 : userRole === 3 ? about[lang].role3 : about[lang].role4} </mark>
}


export {
    loginRegex,
    phoneRegex,
    numberSplit,
    Role,
    checkToken,
    PostProductSchema,
    PostReferalSchema,
    PostNewsSchema
}