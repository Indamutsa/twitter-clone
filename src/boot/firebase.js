import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFeiKnaLn1QXQkGZLMTBaiOpvP0YLX5r0",
  authDomain: "twitter-clone-2722d.firebaseapp.com",
  projectId: "twitter-clone-2722d",
  storageBucket: "twitter-clone-2722d.appspot.com",
  messagingSenderId: "727984118131",
  appId: "1:727984118131:web:68e7b22a33196fdfe80d06"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore()

export default db;

