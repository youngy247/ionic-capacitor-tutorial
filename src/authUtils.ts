import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';

export const useAuthentication = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setLoading(false)
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, loading };
};
