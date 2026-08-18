import { useState } from "react";
import type { FormEvent } from "react";

import { useAuth } from "../context/AuthContext";

function Profile() {
  const {
    user,
    loading,
    signInUser,
    signUpUser,
    signInWithGoogleUser,
    signOutUser,
  } = useAuth();

  const [mode, setMode] =
    useState<"signin" | "signup">("signin");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [displayName, setDisplayName] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password.",
      );
      return;
    }

    if (
      mode === "signup" &&
      !displayName.trim()
    ) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSubmitting(true);

      if (mode === "signin") {
        await signInUser(
          email.trim(),
          password,
        );
      } else {
        await signUpUser(
          email.trim(),
          password,
          displayName.trim(),
        );
      }

      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (firebaseError) {
      console.error(
        "Firebase authentication error:",
        firebaseError,
      );

      const code =
        typeof firebaseError === "object" &&
        firebaseError !== null &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code,
            )
          : "";

      switch (code) {
        case "auth/invalid-credential":
          setError(
            "Email or password is incorrect.",
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account exists with this email.",
          );
          break;

        case "auth/wrong-password":
          setError(
            "The password is incorrect.",
          );
          break;

        case "auth/email-already-in-use":
          setError(
            "An account with this email already exists.",
          );
          break;

        case "auth/weak-password":
          setError(
            "Password must be at least 6 characters.",
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address.",
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/password authentication is not enabled in Firebase.",
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Check your internet connection.",
          );
          break;

        default:
          setError(
            "Authentication failed. Please try again.",
          );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (submitting) {
      return;
    }

    try {
      setError("");
      setSubmitting(true);

      await signInWithGoogleUser();
    } catch (firebaseError) {
      console.error(
        "Google sign-in error:",
        firebaseError,
      );

      const code =
        typeof firebaseError === "object" &&
        firebaseError !== null &&
        "code" in firebaseError
          ? String(
              (
                firebaseError as {
                  code?: unknown;
                }
              ).code,
            )
          : "";

      switch (code) {
        case "auth/popup-closed-by-user":
          setError(
            "Google sign-in was cancelled.",
          );
          break;

        case "auth/popup-blocked":
          setError(
            "Your browser blocked the Google sign-in popup.",
          );
          break;

        case "auth/unauthorized-domain":
          setError(
            "This website domain is not authorized in Firebase.",
          );
          break;

        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email using another sign-in method.",
          );
          break;

        default:
          setError(
            "Google sign-in failed. Please try again.",
          );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError("");
      await signOutUser();
    } catch (logoutError) {
      console.error(
        "Logout error:",
        logoutError,
      );

      setError(
        "Could not sign out. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading dashboard-glass-card">
          <span className="eyebrow">
            SELFEDU ACCOUNT
          </span>

          <h1>
            Loading your account...
          </h1>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="profile-page">
        <section className="profile-hero">
          <div>
            <p className="eyebrow">
              SELFEDU ACCOUNT
            </p>

            <h1>
              Welcome back,
              <br />
              <span>
                {user.displayName ||
                  user.email?.split("@")[0] ||
                  "Student"}
                .
              </span>
            </h1>

            <p>
              Your SelfEDU account is connected.
              Your learning data can now be tied
              to your account.
            </p>
          </div>

          <div className="profile-avatar">
            {(
              user.displayName ||
              user.email ||
              "S"
            )
              .charAt(0)
              .toUpperCase()}
          </div>
        </section>

        <section className="profile-account-card dashboard-glass-card">
          <span className="dashboard-label">
            ACCOUNT
          </span>

          <div className="profile-account-row">
            <span>Name</span>

            <strong>
              {user.displayName ||
                "Not set"}
            </strong>
          </div>

          <div className="profile-account-row">
            <span>Email</span>

            <strong>
              {user.email ||
                "Not available"}
            </strong>
          </div>

          <div className="profile-account-row">
            <span>Provider</span>

            <strong>
              {user.providerData[0]
                ?.providerId ===
              "google.com"
                ? "Google"
                : "Email & Password"}
            </strong>
          </div>

          <div className="profile-account-row">
            <span>Status</span>

            <strong className="profile-status">
              Signed in
            </strong>
          </div>

          {error && (
            <p className="profile-error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="profile-logout-button"
            onClick={() =>
              void handleLogout()
            }
          >
            Sign out
            <span>→</span>
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-auth-layout">
        <div className="profile-auth-intro">
          <p className="eyebrow">
            SELFEDU ACCOUNT
          </p>

          <h1>
            Your preparation,
            <br />
            <span>in one place.</span>
          </h1>

          <p>
            Sign in to keep your IELTS
            preparation connected to your
            SelfEDU account.
          </p>

          <div className="profile-auth-features">
            <div>
              <span>01</span>

              <strong>
                Progress
              </strong>

              <p>
                Keep your IELTS activity
                connected to your account.
              </p>
            </div>

            <div>
              <span>02</span>

              <strong>
                AI Coach
              </strong>

              <p>
                Build a personalized learning
                history.
              </p>
            </div>

            <div>
              <span>03</span>

              <strong>
                Everything together
              </strong>

              <p>
                One account for Reading,
                Listening, Writing, and Speaking.
              </p>
            </div>
          </div>
        </div>

        <div className="profile-auth-card dashboard-glass-card">
          <div className="profile-auth-tabs">
            <button
              type="button"
              className={
                mode === "signin"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("signin");
                setError("");
              }}
            >
              Sign in
            </button>

            <button
              type="button"
              className={
                mode === "signup"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Create account
            </button>
          </div>

          <div className="profile-auth-heading">
            <span className="dashboard-label">
              {mode === "signin"
                ? "WELCOME BACK"
                : "NEW STUDENT"}
            </span>

            <h2>
              {mode === "signin"
                ? "Sign in to SelfEDU."
                : "Create your account."}
            </h2>

            <p>
              {mode === "signin"
                ? "Continue your IELTS preparation."
                : "Start building your personalized IELTS profile."}
            </p>
          </div>

          <button
            type="button"
            className="profile-google-button"
            disabled={submitting}
            onClick={() =>
              void handleGoogleSignIn()
            }
          >
            <span>G</span>
            Continue with Google
          </button>

          <div className="profile-auth-divider">
            <span>OR</span>
          </div>

          <form
            className="profile-auth-form"
            onSubmit={handleSubmit}
          >
            {mode === "signup" && (
              <label>
                <span>Name</span>

                <input
                  type="text"
                  value={displayName}
                  onChange={(event) =>
                    setDisplayName(
                      event.target.value,
                    )
                  }
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              <span>Email</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="At least 6 characters"
                autoComplete={
                  mode === "signin"
                    ? "current-password"
                    : "new-password"
                }
              />
            </label>

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            <button
              className="profile-submit-button"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}

              <span>→</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Profile;