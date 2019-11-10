import firebase from 'firebase'


const app = firebase.initializeApp({
  apiKey: 'AIzaSyBE9N72hl6q78zTBVUZVCwYplZ9iDOG8e8',
  authDomain: 'golfroster.firebaseapp.com',
  projectId: 'golfroster',
  databaseURL: 'https://golfroster.firebaseio.com',
  storageBucket: 'golfroster.appspot.com',
})

export default app
