import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div>
      <div className="container mt-5">
        <footer className={styles.foter}>
          <span>© 2024 All Rights Reserved, Trendy-Tales</span>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
