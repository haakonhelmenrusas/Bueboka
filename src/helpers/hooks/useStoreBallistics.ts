import { useState } from "react";
import {ref, set, getDatabase, update} from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";
import {CalculatedMarks, Status} from "../../models";

const useStoreBallistics = () => {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<any | null>(null);

  /**
   * Store ballistic calculation result in users profile in database.
   *
   * @param ballistic_result
   */
  const storeBallistics = async (ballistic_result: CalculatedMarks): Promise<void> => {
    const auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp)
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus(Status.Pending);
    set(ref(database, "users/" + userId + "/ballistics"),
      {
        ...ballistic_result,
      },
    )
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
