import { useState } from "react";
import {ref, getDatabase, set, update} from "firebase/database";
import { getAuth } from "firebase/auth";

import firebaseApp from "../../auth/";
import {ICalculatedMarks} from "../../models";

const useStoreBallistics = () => {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState<any | null>(null);

  /**
   * Store ballistic calculation result in users profile in database.
   *
   * @param ballistic_result
   */
  const storeBallistics = async (ballistic_result: ICalculatedMarks): Promise<void> => {
    const auth = getAuth(firebaseApp);
    const database = getDatabase(firebaseApp)
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    setStatus("pending");
    update(ref(database, "users/" + userId + "/ballistics"),
      {
        calculation_result: ballistic_result,
      },
    )
      .then(() => {
        console.log("STORE DB ??: ", )
        setStatus("success");
      })
      .catch((error) => {
        console.log("STORE DB ??: ", )
        setError(error);
        setStatus("error");
      });
  };

  return {
    status,
    error,
    storeBallistics,
  };
};

export default useStoreBallistics;
