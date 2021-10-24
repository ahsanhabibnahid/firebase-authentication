import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';

const app = initializeApp(firebaseConfig)

function App() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    userName: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false,
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

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      const signOutUser = {
        isSignedIn: false,
        userName: '',
        email: '',
        photo: '',
        error: ''
      }
      setUser(signOutUser)
    }).catch((error) => {
      console.log(error)
    });
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value)

    }
    if (event.target.name === 'password') {
      const isPassValid = event.target.value.length > 6
      const passwordHasNumber = /\d{1}/.test(event.target.value)
      isFieldValid = isPassValid && passwordHasNumber

    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[event.target.name] = event.target.value
      setUser(newUserInfo)
    }
  }

  const handleSubmit = (e) => {
    console.log(user.email, user.password)
    // if new user and  user.name = true and user.password = true
    if (newUser && user.name && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user }
          newUserInfo.success = true
          newUserInfo.error = ""
          setUser(newUserInfo)
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
    }
    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const newUserInfo = { ...user }
          newUserInfo.success = true
          newUserInfo.error = ""
          setUser(newUserInfo)
        })
        .catch((error) => {
          const newUserInfo = { ...user }
          newUserInfo.error = error.message
          newUserInfo.success = false
          setUser(newUserInfo)
        });
    }
    e.preventDefault()
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome {user.userName}</p>
          <p>Your Email {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newuser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {
          newUser &&
          <input type="text" name="name" onBlur={handleBlur} placeholder='your name' required />

        }
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder='your email' required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder='your password' required />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <p>{user.error}</p>
      {
        user.success && <p>User {newUser ?'create' : 'logged In'} successfully</p>
      }
    </div>
  );
}

export default App;
