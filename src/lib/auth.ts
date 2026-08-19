import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";

import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export async function signUp(
  email: string,
  password: string,
  displayName: string,
) {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

  await updateProfile(credential.user, {
    displayName: displayName.trim(),
  });

  return credential.user;
}

export async function signIn(
  email: string,
  password: string,
) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

  return credential.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(
    auth,
    googleProvider,
  );

  return result.user;
}

export async function logOut() {
  await signOut(auth);
}

export function subscribeToAuth(
  callback: (user: User | null) => void,
) {
  return onAuthStateChanged(auth, callback);
}
