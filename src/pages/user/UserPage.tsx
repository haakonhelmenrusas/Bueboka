import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Avatar, Button } from "@mantine/core";
import { Settings } from "tabler-icons-react";
import { ArcherNumber, BowType, ProfileForm } from "../../components";
import { useFetchArcher, useFetchBow } from "../../helpers/hooks";
import { UserContext } from "../../helpers/StateProvider";
import firebaseApp from "../../auth";
import styles from "./User.module.css";

const UserPage: React.FC = () => {
  const auth = getAuth(firebaseApp);
  const { user } = useContext(UserContext);
  const { value, getArcherNumber } = useFetchArcher();
  const { bowType, getBow } = useFetchBow();
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useEffect(() => {
    getArcherNumber();
    getBow();
  }, [user]);

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <h2 className={styles.name}>Hei, {user && user.displayName}!</h2>
        <Button
          title="Endre profil"
          style={{ paddingLeft: 4, paddingRight: 4, marginLeft: "auto" }}
          color="blue"
          variant="outline"
          onClick={() => setShowEditForm((state) => !state)}
        >
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
      <Link to={"/siktemerker "}>
        <Button>Beregn siktemerker</Button>
      </Link>
      {showEditForm && (
        <ProfileForm
          showEditForm={showEditForm}
          bowType={bowType}
          archerNumber={value}
          setShowEditForm={setShowEditForm}
        />
      )}
    </div>
  );
};

export default UserPage;
