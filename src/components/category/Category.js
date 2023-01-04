import React, { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../context/context";

const Category = () => {
  const { route } = useParams();
  const navigate = useNavigate();
  const {fetchHeaders} =useContext(Context)

  const [data, setData] = useState({
    fetched: false,
    error: false,
    data: {},
  });

  useEffect(() => {
    if (!route.match(/^[a-z][-a-z0-9]*$/i)) {
      navigate("/");
    }

    if (route.match(/^[a-z][-a-z0-9]*$/i)) {
      fetch(`http://localhost:9000/category/get/${route}`,{
        headers: fetchHeaders
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
    }
  }, [route]);

  return (
    <div>
      {data.fetched && data.data ? (
        <div>{data.data.name_uz}</div>
      ) : !data.fetched && !data.error ? (
        <div>qidirilmoqda</div>
      ) : (
        <div>xatolik</div>
      )}
    </div>
  );
};

export default Category;
