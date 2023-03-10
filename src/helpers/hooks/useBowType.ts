import { useState } from "react";
import { doc, getFirestore, setDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../auth/";

const useBowType = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState<any | null>(null);

  const writeBowType = async (bowType: string): Promise<void> => {
    const auth = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (userId) {
      setStatus("pending");
      setDoc(doc(database, "users", userId, "profile", "bow"), {
        bowType,
      })
        .then(() => {
          setStatus("success");
        })
        .catch((error) => {
          setError(error);
          setStatus("error");
        });
    }
  };

  return {
    status,
    error,
    writeBowType,
  };
};

export default useBowType;
