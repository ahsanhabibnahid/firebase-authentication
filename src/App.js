import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from 'react';

const app = initializeApp(firebaseConfig)

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    userName: '',
    email: '',
    photo: ''
  })
  const provider = new GoogleAuthProvider();

  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(result => {
        const { displayName, email, photoURL } = result.user
        const signedInUser = {
          isSignedIn: true,
          userName: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser)

      })
      .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage)
      })
  }

  return (
    <div className="App">
      <button onClick={handleSignIn}>Sign In</button>
      {
        user.isSignedIn && <div>
          <p>Welcome {user.userName}</p>
          <p>Your Email {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
