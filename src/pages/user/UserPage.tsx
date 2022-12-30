import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Avatar, Button, ColorScheme } from "@mantine/core";
import { Settings } from "tabler-icons-react";
import { ArcherNumber, BowType, ProfileForm } from "../../components";
import { AppContainer } from "../../components/common";
import { useFetchArcher, useFetchBow } from "../../helpers/hooks";
import { UserContext } from "../../helpers/StateProvider";
import firebaseApp from "../../auth";
import styles from "./User.module.css";

interface UserProps {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const UserPage: React.FC<UserProps> = ({ colorScheme, toggleColorScheme }) => {
  const navigate = useNavigate();
  const auth = getAuth(firebaseApp);
  const { user } = useContext(UserContext);
  const { value, getArcherNumber } = useFetchArcher();
  const { bowType, getBow } = useFetchBow();
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useEffect(() => {
    if (user.displayName) {
      getArcherNumber();
      getBow();
    } else {
      navigate("/");
    }
  }, [getArcherNumber, user.displayName]);

  return (
    <AppContainer colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.name}>Hei, {user.displayName}!</h2>
          <Button
            title="Endre profil"
            style={{ marginLeft: "auto" }}
            color="blue"
            variant="outline"
            onClick={() => setShowEditForm((state) => !state)}
          >
            Endre profil
            <Settings size={24} />
          </Button>
        </div>
        <div className={styles.profileData}>
          <Avatar size={64} radius="xl" src={auth.currentUser ? auth.currentUser.photoURL : null} />
          <div className={styles.profileSpecs}>
            <ArcherNumber archerNumber={value} />
            <BowType bowType={bowType} />
          </div>
        </div>
        <Link to={"/form"}>
          <Button>Beregn siktemerker</Button>
        </Link>
      </div>
      {showEditForm && (
        <ProfileForm
          showEditForm={showEditForm}
          bowType={bowType}
          archerNumber={value}
          setShowEditForm={setShowEditForm}
        />
      )}
    </AppContainer>
  );
};

export default UserPage;
