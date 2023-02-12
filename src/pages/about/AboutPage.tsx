import React from "react";
import Footer from "../../components/common/footer/Footer";
import styles from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  return (
    <>
      <div className={styles.content}>
        <h1>Hei!</h1>
        <p>
          Book of Arrows er en tjeneste for alle bueskyttere. Her kan du lage en profil, få beregnet siktemerker og mye
          mer!
        </p>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
