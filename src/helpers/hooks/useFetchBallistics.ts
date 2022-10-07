import {useCallback, useState} from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import firebaseApp from "../../auth/";
import {CalculatedMarks, Status} from "../../models";

const useFetchBallistics = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [ballistics, setBallistics] = useState<CalculatedMarks | null>(null);
  const [error, setError] = useState<any | null>(null);

  const getBallistics = useCallback(async () => {
    const auth = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus(Status.Pending);
    try {
      const dbRef = doc(database, "users/" + userId, 'ballistics', 'results');
      const docSnap = await getDoc(dbRef);

      if (docSnap.exists()) {
        const doc = docSnap.data();
        setBallistics(doc.ballistic_result);
        setStatus(Status.Idle);
      }
    } catch (e) {
      setError(e);
      setStatus(Status.Idle);
    }
  }, []);

  return {
    status,
    ballistics,
    error,
    getBallistics,
  };
};

export default useFetchBallistics;
