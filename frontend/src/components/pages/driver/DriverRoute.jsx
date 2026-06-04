import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useEffect, useState } from "react";

const DriverRoute = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {

        if (!user) {
          setLoading(false);
          return;
        }

        const snap = await getDoc(
          doc(db, "users", user.uid)
        );

        if (
          snap.exists() &&
          snap.data()?.isDriver === "true"
        ) {
          setIsDriver(true);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isDriver) return <Navigate to="/" />;

  return children;
};

export default DriverRoute;
