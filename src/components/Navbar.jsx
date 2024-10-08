import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { auth } from '../config/firebase';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up the auth state observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">MyApp</h1>
        <div className="space-x-4">
          {/* Conditional rendering based on user authentication status */}
          {user ? (
            <>
              <Link to="/userblog" className="text-white hover:bg-blue-600 px-3 py-2 rounded">userblog</Link>
              <Link to="/addblog" className="text-white hover:bg-blue-600 px-3 py-2 rounded">Blog</Link>
              <button
                onClick={() => auth.signOut()} // Sign out functionality
                className="text-white hover:bg-blue-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:bg-blue-600 px-3 py-2 rounded">Login</Link>
              <Link to="/signup" className="text-white hover:bg-blue-600 px-3 py-2 rounded">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
