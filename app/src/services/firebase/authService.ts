import { auth } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';

export const registerWithEmail = async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

export const loginWithEmail = async (email: string, password: string): Promise<{ user?: User; error?: string }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

export const logout = async (): Promise<{ error?: string }> => {
  try {
    await signOut(auth);
    return {};
  } catch (error) {
    const authError = error as AuthError;
    return { error: authError.message };
  }
};

export const checkAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};