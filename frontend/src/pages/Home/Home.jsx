import React from "react";
import { useState, useEffect } from "react";
import { getAllBlogs } from "../../api/Api";
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import MetaData from "../../components/MetaData/MetaData";

function Home() {
  const navigate = useNavigate();
  const [blogs, setBlog] = useState([]);

  useEffect(() => {
    (async function getAllBlogsApi() {
      const response = await getAllBlogs();

      if (response.status === 200) {
        setBlog(response.data.blogs);
      }
    })();
  }, []);

  const excrept = (str) => {
    if (str.length > 45) {
      str = str.substring(0, 45) + "...";
    }

    return str;
  };

  if (blogs.length === 0) {
    return <Loader text="blogs" />;
  }

  return (
    <>
      <MetaData title={"Trendy Tales"} />
      <div className={`container ${styles.box}`}>
        <div className={`row gy-3 ${styles.wrapper}`}>
          {blogs.map((blog) => (
            <div
              className="card ms-2 me-2 bg-dark"
              key={blog._id}
              style={{ width: "21rem" }}
              onClick={() => navigate(`/blog/${blog._id}`)}
            >
              <img
                src={blog.photo}
                className="card-img-top"
                alt="..."
                height="250px"
              />
              <div className="card-body">
                <h5 className="card-title text-white">{blog.title}</h5>
                <p className="card-text text-white">{excrept(blog.content)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
