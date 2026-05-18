
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
  auth,
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
        (user) => {

          if (
            user &&
            [
              "mariahussain021@gmail.com",
              "emile.atcham@deluxetravelexpress.com",
              "partner2@gmail.com",
            ].includes(user.email)
          ) {

            setIsAdmin(true);

          } else {

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
      <Navigate to="/signup" />
    );

  }

  return children;
};

export default AdminRoute;

