import React, { useContext } from 'react';
import { UserContext } from '../lib/usercontext';
import styles from '../styles/Login.module.css';
import { useRouter } from 'next/router';
import { UserContextProvider } from '../lib/usercontext';
import  ShoppingList  from './shoppingList';

export default function Login() {
  const Router = useRouter();
  const {user, setUser} = useContext(UserContext);

  const handleLogin = () => {
    const user = {
      _id: '649f02293f5c043e65c78e29',
      name: 'mom',
      email: 'mom@mom.com',
      password: 'mmmmmmmm',
    };
    setUser(user);
    Router.push('/shoppingList');
  };

  return (
    <UserContextProvider>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <ShoppingList />
        </div>
      ) : (
        <div className={styles.container}>
          <h1>Login</h1>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </UserContextProvider>
  );
}
