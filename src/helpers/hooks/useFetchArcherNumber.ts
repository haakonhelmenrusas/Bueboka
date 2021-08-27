import { useCallback, useState } from "react";
import firebase from "firebase";

const useFetchArcher = () => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  const getArcherNumber = useCallback(() => {
    setStatus("pending");
    const userId = firebase.auth().currentUser!.uid;
    try {
      const archerNumber = firebase
          .database()
          .ref("users/" + userId + "/profile");

      archerNumber.on("value", (snapshot) => {
        const { archerNumber } = snapshot.val();
        setValue(archerNumber);
      });
    } catch (e) {
      setError(e);
    }
  }, []);

  return {
    status,
    value,
    error,
    getArcherNumber,
  };
};

export default useFetchArcher;
