import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, CssBaseline } from '@mui/material';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

// Your Firebase project configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
      alert("Failed to sign out: " + error.message);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Next.js MUI Google Sign-Up
        </Typography>
        {!user ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleSignIn}
            sx={{ mt: 4 }}
          >
            Sign Up with Google
          </Button>
        ) : (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Welcome, {user.displayName}</Typography>
            <Typography variant="body1">{user.email}</Typography>
            <Button variant="outlined" onClick={handleSignOut} sx={{ mt: 2 }}>
              Sign Out
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}

