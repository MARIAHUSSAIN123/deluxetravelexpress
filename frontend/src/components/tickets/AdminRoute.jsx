import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../firebase";

const AdminRoute = ({
  children,
}) => {

  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {

            setIsAdmin(false);

            setLoading(false);

            return;
          }

          try {

            const userRef = doc(
              db,
              "users",
              user.uid
            );

            const userSnap =
              await getDoc(userRef);
 console.log("USER:",user?.uid);
 console.log('ADMIN CHECK:',userSnap.data());
            if (
              userSnap.exists() &&
              userSnap.data()?.role?.trim().toLowerCase() ===
                "admin"
            ) {

              setIsAdmin(true);

            } else {

              setIsAdmin(false);

            }

          } catch (error) {

            console.log(error);

            setIsAdmin(false);

          }

          setLoading(false);

        }
      );

    return () =>
      unsubscribe();

  }, []);

  // LOADING
  if (loading) {

    return (
      <div
        style={{
          color: "white",
          padding: "40px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  // NOT ADMIN
  if (!isAdmin) {

    return (
      <Navigate to="/" />
    );
  }

  return children;
};

export default AdminRoute;
