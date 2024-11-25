import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP7r-qSq6UGrQEg-_sc68BRj0xKNneup8",
    authDomain: "data-base-ee506.firebaseapp.com",
    projectId: "data-base-ee506",
    storageBucket: "data-base-ee506.appspot.com",
    messagingSenderId: "1006198489804",
    appId: "1:1006198489804:web:2f7b6db02659b5d1123869",
    measurementId: "G-RF9M16FNPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);