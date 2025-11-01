// src/firebase/auth.js
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./config";

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

export const onAuthStateChangedListener = (callback) => auth.onAuthStateChanged(callback);
