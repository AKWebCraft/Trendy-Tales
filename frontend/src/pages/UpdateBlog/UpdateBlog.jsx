import React from "react";
import { useState, useEffect } from "react";
import { getBlogById } from "../../api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TextInput from "../../components/TextInput/TextInput";
import styles from "./UpdateBlog.module.css";
import { updateBlog } from "../../api/Api";
import FileBase from "react-file-base64";
import MetaData from "../../components/MetaData/MetaData";

function UpdateBlog() {
  const navigate = useNavigate();

  const params = useParams();
  const blogId = params.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const author = useSelector((state) => state.user._id);

  const updateHandler = async () => {
    let data = {
      author,
      title,
      content,
      photo,
      blogId,
    };

    const response = await updateBlog(data);

    if (response.status === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photo);
      }
    }
    getBlogDetails();
  }, []);

  return (
    <>
      <MetaData title={"Update-Blog"} />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          Edit your blog
          <i className="bi bi-pencil-square"></i>
        </div>
        <TextInput
          type="text"
          name="title"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "60%" }}
        />
        <textarea
          className={styles.content}
          placeholder="your content goes here..."
          maxLength={400}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.photoPrompt}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) => setPhoto(base64)}
          />
          <div>
            <img src={photo} width={250} />
          </div>
        </div>
        <button className={styles.update} onClick={updateHandler}>
          Update
        </button>
      </div>
    </>
  );
}

export default UpdateBlog;
