import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyD1jkdbxNaqQYpSciYsDxGc5PSjNOIpQLg',
  authDomain: 'chatapp-1b6fb.firebaseapp.com',
  databaseURL: 'https://chatapp-1b6fb.firebaseio.com',
  projectId: 'chatapp-1b6fb',
  storageBucket: 'chatapp-1b6fb.appspot.com',
  messagingSenderId: '468479202071',
  appId: '1:468479202071:web:a58cd9db2ad795a5171d52',
};

firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const FieldValue = firebase.firestore.FieldValue;
