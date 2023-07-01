import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.log(error));
  }, []);

  const contextValue = {
    user,
    updateUser, // Pass the updateUser function to the context value
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
