import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitBlog } from "../../api/Api";
import TextInput from "../../components/TextInput/TextInput";
import styles from "./SubmitBlog.module.css";
import FileBase from "react-file-base64";
import MetaData from "../../components/MetaData/MetaData";

function SubmitBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const author = useSelector((state) => state.user._id);

  const submitHandler = async () => {
    const data = {
      author,
      title,
      content,
      photo,
    };

    const response = await submitBlog(data);

    if (response.status === 201) {
      navigate("/");
    }
  };

  return (
    <>
      <MetaData title={"Submit-Blog"} />

      <div className={styles.wrapper}>
        <div className={styles.header}>
          Create a blog
          <i className="bi bi-pen"></i>
        </div>
        <TextInput
          type="text"
          name="title"
          placeholder="Title"
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
          <div>{photo !== "" ? <img src={photo} width={250} /> : ""}</div>
        </div>
        <button
          className={styles.submit}
          onClick={submitHandler}
          disabled={title === "" || content === "" || photo === ""}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default SubmitBlog;
