import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  writeBatch,
  updateDoc,
  setDoc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

interface IObservationUpdate {
  species?: string;
  latitude?: number;
  longitude?: number;
  img?: string;
  timestamp?: Timestamp 
}

export async function loginUser(username: string, password: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, username, password);
    console.log(res);
    return res.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function isUserEmailVerified(user) {
  try {
    await user.reload();
    return user.emailVerified;
  } catch (error) {
    console.error("Failed to reload user data: ", error);
    throw error;
  }
}

export async function registerUser(username: string, password: string) {
  try {
    const res = await createUserWithEmailAndPassword(auth, username, password);
    console.log(res);

    // Send verification email
    if (res.user) {
      await sendVerificationEmail(res.user);
    }

    return res.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function loginWithGoogle(idToken: string) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const res = await signInWithCredential(auth, credential);
    console.log(res);
    return res.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// For Google, registration and login is the same process
// If the Google account is not linked with Firebase yet, it'll automatically create a new account
export const registerWithGoogle = loginWithGoogle;

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function sendVerificationEmail(user) {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function savePictureToStorage(base64Image) {
  try {
    // Create a storage reference
    const imageRef = ref(storage, "observations/" + Date.now() + ".jpg");

    // Convert the base64 image to a Blob
    const response = await fetch(base64Image);
    const blob = await response.blob();

    // Upload the image
    const uploadTask = uploadBytesResumable(imageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error function
          console.log("Failed to upload image: ", error);
          reject(error);
        },
        async () => {
          // Complete function
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveObservation(observation) {
  try {
    // Add a new document with a generated ID
    const docRef = await addDoc(collection(db, "observations"), observation);

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export function getCurrentUserUID() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

export async function fetchUserObservations(userUID: string) {
  try {
    const q = query(
      collection(db, "observations"),
      where("userUID", "==", userUID),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const observations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(observations); // Log the fetched observations here for debugging
    return observations;
  } catch (error) {
    console.error("Failed to fetch user observations: ", error);
    throw error;
  }
}

export async function fetchUserObservationsBySpecies(
  userUID: string,
  species: string
) {
  try {
    const q = query(
      collection(db, "observations"),
      where("userUID", "==", userUID),
      where("species", "==", species),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const observations = querySnapshot.docs.map((doc) => doc.data());
    return observations;
  } catch (error) {
    console.error("Failed to fetch user observations by species: ", error);
    throw error;
  }
}

export async function fetchAllObservations() {
  try {
    const querySnapshot = await getDocs(collection(db, "observations"));
    const observations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(observations); // Log the fetched observations here for debugging
    return observations;
  } catch (error) {
    console.error("Failed to fetch all observations: ", error);
    throw error;
  }
}

export async function deleteObservations(observationIDs: string[]) {
  try {
    const batch = writeBatch(db);

    observationIDs.forEach((id) => {
      const ref = doc(db, "observations", id);
      batch.delete(ref);
    });

    await batch.commit();

    console.log("Deleted observations: ", observationIDs);
  } catch (error) {
    console.error("Failed to delete observations: ", error);
    throw error;
  }
}

export async function updateObservation(id: string, newData: IObservationUpdate) {
  try {
    const docRef = doc(db, "observations", id);
    await updateDoc(docRef, { ...newData });
    console.log(`Observation with ID: ${id} has been updated.`);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}
