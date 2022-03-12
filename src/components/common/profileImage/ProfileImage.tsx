import React from "react";

import styles from "./ProfileImage.module.css";

interface IProfileImage {
  photoURL: string;
  onClick:  React.MouseEventHandler<HTMLDivElement>;
}

const ProfileImage = ({ photoURL, onClick }: IProfileImage) => {
  return (
    <div onClick={onClick} className={styles.imgContainer}>
      <img className={styles.img} alt="Profile" src={photoURL} />
    </div>
  );
};

export default ProfileImage;
