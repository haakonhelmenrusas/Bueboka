import { useCallback, useState } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../auth/";
import { Status } from "../../models";

const useFetchBow = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [bowType, setBowType] = useState<string | null>(null);
  const [error, setError] = useState<any | null>(null);

  const getBow = useCallback(() => {
    const auth = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (userId) {
      setStatus(Status.Pending);
      try {
        const dbRef = doc(database, "users/" + userId, "profile", "bow");
        onSnapshot(dbRef, (doc) => {
          if (doc.exists()) {
            const { bowType } = doc.data();
            setBowType(bowType);
            setStatus(Status.Idle);
          }
        });
      } catch (e) {
        setError(e);
        setStatus(Status.Idle);
      }
    }
  }, []);

  return {
    status,
    bowType,
    error,
    getBow,
  };
};

export default useFetchBow;
