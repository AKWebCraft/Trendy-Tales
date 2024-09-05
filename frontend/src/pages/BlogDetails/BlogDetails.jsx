import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./BlogDetails.module.css";
import MetaData from "../../components/MetaData/MetaData";
import CommentList from "../../components/CommentList/CommentList";
import {
  getBlogById,
  deleteBlog,
  postComment,
  getCommentsById,
} from "../../api/Api";

function BlogDetails() {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const blogId = params.id;

  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user._id);

  useEffect(() => {
    async function getBlogDetails() {
      const commentResponse = await getCommentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        // set ownership
        setOwnsBlog(username === blogResponse.data.blog.authorUsername);
        setBlog(blogResponse.data.blog);
      }
    }
    getBlogDetails();
  }, [reload]);

  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };

    const response = await postComment(data);

    if (response.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);

    if (response.status === 200) {
      navigate("/");
    }
  };

  return (
    <>
      <MetaData title={"Blog-Details"} />
      <div className={styles.wrapper}>
        <div className={styles.topPart}>
          <h1 className="text-center text-white">{blog.title}</h1>
          <div className="text-center text-white">
            <p>
              <i className="bi bi-person"></i>
              {blog.authorUsername +
                " on " +
                new Date(blog.createdAt).toDateString()}
            </p>
          </div>

          <div className={styles.photo}>
            <img src={blog.photo} />
          </div>

          {ownsBlog && (
            <div className={styles.controls}>
              <button
                className={styles.editButton}
                onClick={() => {
                  navigate(`/blogUpdate/${blog._id}`);
                }}
              >
                <i className="bi bi-pencil-square"> </i>
                Edit
              </button>

              <button className={styles.dltButon} onClick={deleteBlogHandler}>
                <i className="bi bi-trash3"></i>
                Delete
              </button>
            </div>
          )}

          <div className={styles.content}>
            <p>{blog.content}</p>
          </div>
        </div>

        <div className={styles.comentBox}>
          <p className="text-white">Share your thoughts</p>
          <div className={styles.commentsWrapper}>
            <div className={styles.postComment}>
              <input
                className={styles.input}
                placeholder="Write comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className={styles.postCommentButton}
                onClick={postCommentHandler}
              >
                Post
              </button>
            </div>
            <div className="mt-5">
              <CommentList comments={comments} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogDetails;
