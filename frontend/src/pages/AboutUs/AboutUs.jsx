import React from "react";
import styles from "./AboutUs.module.css";
import img from "../../images/arslan.jpg";
import MetaData from "../../components/MetaData/MetaData";

function AboutUs() {
  return (
    <>
      <MetaData title={"About-Me"} />
      <div className="container">
        <div className={`row ${styles.wrapper}`}>
          <div className="col-md-6">
            <img src={img} alt="img" width="200px" className={styles.myImg} />
            <div className="mt-4">
              <h4 className={styles.myName}>Arslan Khalil</h4>
              <div className={styles.Icons}>
                <i className={`bi bi-facebook ${styles.icon}`}></i>
                <i className={`bi bi-linkedin ms-4 ${styles.icon}`}></i>
                <i className={`bi bi-github ms-4 ${styles.icon}`}></i>
              </div>
              <span className="text-white">
                I am Arslan Khalil web developer and Wordpress designer with 2
                years of experience. This is my Mern Stack project which i have
                created for my portfolio.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
