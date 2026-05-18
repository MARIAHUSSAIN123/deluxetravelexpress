// SignupPage.jsx

import React, { useContext, useState } from "react";
import "./Signup.css";

import { LanguageContext } from "../../context/LanguageContext";
import translations from "../../translations";
import Footer from "./Footer";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";

import {
  auth,
  db,
  googleProvider,
} from "../../firebase";

import { useNavigate } from "react-router-dom";

const SignupPage = () => {

  const { language } = useContext(LanguageContext);

  const t = translations[language] || translations.en;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    country: "",
  });

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE SIGNUP
  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      // CREATE USER
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

      const user = userCredential.user;

      // SAVE USER DATA
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        role: "customer",
        createdAt: new Date(),
      });

      setSuccess("Account created successfully!");

      // RESET FORM
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        country: "",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 2000);

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      }

      else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      }

      else {
        setError("Something went wrong");
      }

    } finally {
      setLoading(false);
    }
  };

  // GOOGLE SIGNUP
  const handleGoogleSignup = async () => {

    try {

      setError("");

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: "customer",
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigate("/admin");

    } catch (error) {
      setError("Google signup failed");
    }
  };

  return (
    <>
      <section className="signup-page">

        <div className="signup-overlay"></div>

        <div className="signup-container">

          <h1>
            {t.signupHeading}
          </h1>

          <p className="signup-subtitle">
            {t.signupSubtitle}
          </p>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </button>

          {/* DIVIDER */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="signup-success">
              {success}
            </div>
          )}

          {/* FORM */}
          <form
            className="signup-form"
            onSubmit={handleSignup}
          >

            {/* ROW 1 */}
            <div className="form-grid">

              <div className="input-box">

                <label>
                  {t.firstName}
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t.enterFirstName}
                />

              </div>

              <div className="input-box">

                <label>
                  {t.lastName}
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t.enterLastName}
                />

              </div>

            </div>

            {/* ROW 2 */}
            <div className="form-grid">

              <div className="input-box">

                <label>
                  {t.emailAddress}
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.enterEmail}
                />

              </div>

              <div className="input-box">

                <label>
                  {t.phoneNumber}
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.enterPhone}
                />

              </div>

            </div>

            {/* ROW 3 */}
            <div className="form-grid">

              <div className="input-box">

                <label>
                  {t.password}
                </label>

                <div className="password-box">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.createPassword}
                  />

                  <span
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>

                </div>

              </div>

              <div className="input-box">

                <label>
                  {t.confirmPassword}
                </label>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmYourPassword}
                />

              </div>

            </div>

            {/* ADDRESS */}
            <div className="input-box full-width">

              <label>
                {t.signupAddress}
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t.enterAddress}
              />

            </div>

            {/* ROW 4 */}
            <div className="form-grid">

              <div className="input-box">

                <label>
                  {t.signupCity}
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t.enterCity}
                />

              </div>

              <div className="input-box">

                <label>
                  {t.signupCountry}
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={t.enterCountry}
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="signup-btn-form"
              disabled={loading}
            >
              {
                loading
                  ? "Creating..."
                  : t.createAccount
              }
            </button>

          </form>

        </div>

      </section>

      <Footer />
    </>
  );
};

export default SignupPage;