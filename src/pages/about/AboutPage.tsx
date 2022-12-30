import React from "react";
import { ColorScheme } from "@mantine/core";

import { AppContainer } from "../../components/common";
import Footer from "../../components/common/footer/Footer";
import styles from "./AboutPage.module.css";

interface IAboutPage {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const AboutPage: React.FC<IAboutPage> = ({ colorScheme, toggleColorScheme }) => {
  return (
    <AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <div className={styles.content}>
        <h1>Hei!</h1>
        <p>
          Book of Arrows er en tjeneste for alle bueskyttere. Her kan du lage en profil, få beregnet siktemerker og mye
          mer!
        </p>
      </div>
      <Footer />
    </AppContainer>
  );
};

export default AboutPage;
