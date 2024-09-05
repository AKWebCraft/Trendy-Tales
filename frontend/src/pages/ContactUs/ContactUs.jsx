import React from "react";
import styles from "./ContactUs.module.css";
import MetaData from "../../components/MetaData/MetaData";

function ContactUs() {
  return (
    <>
      <MetaData title={"Contact-Me"} />
      <div className="container">
        <div className={`row ${styles.wrapper}`}>
          <div className="col-md-6">
            <div className={styles.container}>
              {" "}
              <a
                className={styles.mailBtn}
                href="mailto:arslankhalil660@gmail.com"
              >
                <button className="text-white">
                  Contact <i className="bi bi-envelope-at"></i>:
                  arslankhalil660@gmail.com
                </button>{" "}
              </a>{" "}
              <a className={styles.mailBtn} href="https://wa.me/03095508115">
                <button className="text-white">
                  Contact <i className="bi bi-whatsapp"></i>: 03095508115
                </button>{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
