import { auth } from './firebase-config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { useEffect, useState } from 'react';



// function to signup, returns a promise
function signupUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

// function to login, returns a promise
function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

// function to logout, returns a promise
function logoutUser() {
    return signOut(auth);
}

// function to listen to changes in user
function useAuth() {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user));

        return () => {
            unsubscribe();
        }
    }, []);


    return currentUser;
}

// Export all required auth services
export {
    auth,
    signupUser,
    loginUser,
    logoutUser,
    useAuth
};