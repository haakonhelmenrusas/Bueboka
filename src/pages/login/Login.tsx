import React, { useContext, useEffect } from "react";
import { Bow, BrandGoogle, ListCheck, UserCircle } from "tabler-icons-react";
import { Button, Card } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../auth";
import Logo from "../../assets/images/logo512.png";
import Footer from "../../components/common/footer/Footer";
import styles from "./Login.module.css";
import { UserContext } from "../../helpers/StateProvider";

const Login = () => {
  let navigate = useNavigate();
  const { user } = useContext(UserContext);

  async function handleLogin() {
    await googleLogin().then(() => {
      navigate("/user", { replace: true });
    });
  }

  useEffect(() => {
    if (user) {
      navigate("/user", { replace: true });
    }
  }, [user]);

  return (
    <>
      <div className={styles.welcomeContainer}>
        <img className={styles.logo} alt="Logo" src={Logo} />
        <h1 className={styles.title}>Book of Arrows</h1>
        <h2 className={styles.subtitle}>Her samles Norges bueskyttere</h2>
        <div className={styles.list}>
          <Card radius={4} className={styles.listItem}>
            <UserCircle color="#228be6" size={40} />
            <p className={styles.listText}>Skytterprofil</p>
          </Card>
          <Card radius={4} className={styles.listItem}>
            <ListCheck color="#228be6" size={40} />
            <p className={styles.listText}>Beregning av siktemerker</p>
          </Card>
          <Card radius={4} className={styles.listItem}>
            <Bow color="#228be6" size={40} />
            <p className={styles.listText}>Register utstyr</p>
          </Card>
        </div>
        <Button leftIcon={<BrandGoogle />} onClick={handleLogin}>
          Logg inn med Google
        </Button>
      </div>
      <Footer />
    </>
  );
};

export default Login;
