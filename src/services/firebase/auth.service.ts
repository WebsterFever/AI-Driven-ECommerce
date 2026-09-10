import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import type { User } from '../../types'
import { auth, db } from './config'

async function createUserProfile(
  firebaseUser: FirebaseUser,
  displayName?: string,
): Promise<User> {
  const profile: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: displayName ?? firebaseUser.displayName ?? undefined,
    role: 'customer',
    createdAt: new Date().toISOString(),
  }

  await setDoc(doc(db, 'users', firebaseUser.uid), profile)

  return profile
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snapshot = await getDoc(doc(db, 'users', uid))

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data() as User
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }

  return createUserProfile(credential.user, displayName)
}

export async function loginWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)

  const existingProfile = await getUserProfile(credential.user.uid)
  if (existingProfile) {
    return existingProfile
  }

  return createUserProfile(credential.user)
}

export async function logout(): Promise<void> {
  await signOut(auth)
}
