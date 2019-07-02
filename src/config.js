import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBQ_SuZzRviSNuBfpKVObMkXz3OhOH4nJk",
    authDomain: "weighttracker-ffaf8.firebaseapp.com",
    databaseURL: "https://weighttracker-ffaf8.firebaseio.com",
    projectId: "weighttracker-ffaf8",
    storageBucket: "weighttracker-ffaf8.appspot.com",
    messagingSenderId: "859199368073",
    appId: "1:859199368073:web:cf1387cdca87761f"
};

firebase.initializeApp(firebaseConfig);

export default firebase
