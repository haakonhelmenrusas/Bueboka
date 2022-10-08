import { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import firebaseApp from "../../auth/";
import { CalculatedMarks, Status } from "../../models";

const useStoreBallistics = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  const storeBallistics = async (
    ballistic_result: CalculatedMarks
  ): Promise<void> => {
    const auth = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus(Status.Pending);
    setDoc(doc(database, "users/" + userId, "ballistics", "results"), {
      ballistic_result,
    })
      .then(() => {
        setStatus(Status.Success);
      })
      .catch((error) => {
        setError(error);
        setStatus(Status.Idle);
      });
  };

  return {
    status,
    error,
    storeBallistics,
  };
};

export default useStoreBallistics;
