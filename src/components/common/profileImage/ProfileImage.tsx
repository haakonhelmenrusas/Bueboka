import React from "react";

import styles from "./ProfileImage.module.css";

interface IProfileImage {
  photoURL: string;
}

const ProfileImage = ({ photoURL }: IProfileImage) => {
  return (
    <div className={styles.imgContainer}>
      <img className={styles.img} alt="Profile" src={photoURL} />
    </div>
  );
};

export default ProfileImage;
