import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "firebase/auth";

import {
  logOut,
  signIn,
  signInWithGoogle,
  signUp,
  subscribeToAuth,
} from "../lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;

  signUpUser: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<User>;

  signInUser: (
    email: string,
    password: string,
  ) => Promise<User>;

  signInWithGoogleUser: () => Promise<void>;

  signOutUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      subscribeToAuth((currentUser) => {
        console.log(
          "🔥 Firebase auth state:",
          currentUser
            ? currentUser.email
            : "signed out",
        );

        setUser(currentUser);
        setLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUpUser = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    const createdUser = await signUp(
      email,
      password,
      displayName,
    );

    setUser(createdUser);

    return createdUser;
  };

  const signInUser = async (
    email: string,
    password: string,
  ) => {
    const loggedInUser = await signIn(
      email,
      password,
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const signInWithGoogleUser =
    async () => {
      const googleUser =
        await signInWithGoogle();

      setUser(googleUser);
    };

  const signOutUser = async () => {
    await logOut();
    setUser(null);
  };

  if (loading) {
    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          signUpUser,
          signInUser,
          signInWithGoogleUser,
          signOutUser,
        }}
      >
        <div className="auth-loading-screen">
          <div className="auth-loading-orb">
            ✦
          </div>

          <span>
            Restoring your SelfEDU account...
          </span>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUpUser,
        signInUser,
        signInWithGoogleUser,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}
