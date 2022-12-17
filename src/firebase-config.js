// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVg6rBbRlqKwRGtncBwAEUZYPX2VjiCoU",
  authDomain: "jugaad-70ee9.firebaseapp.com",
  projectId: "jugaad-70ee9",
  storageBucket: "jugaad-70ee9.appspot.com",
  messagingSenderId: "432738818959",
  appId: "1:432738818959:web:f3a39f2f276233d05549fa",
  measurementId: "G-CN0VQY3RND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db=getFirestore(app);
export const auth = getAuth(app);