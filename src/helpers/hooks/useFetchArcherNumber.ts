import { useCallback, useState } from "react";
import { getAuth } from "firebase/auth";
import { ref, getDatabase, onValue } from "firebase/database";
import firebaseApp from "../../auth/";

const useFetchArcher = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [value, setValue] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);

  const getArcherNumber = useCallback(() => {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus("pending");
    try {
      const archerNumber = ref(db, "users/" + userId + "/profile");
      onValue(archerNumber, (snapshot) => {
        const { archerNumber } = snapshot.val();
        setValue(archerNumber);
      })
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
