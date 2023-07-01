import React, { useContext } from 'react';
import { UserContext } from '../lib/usercontext';
import styles from '../styles/Login.module.css';
import { useRouter } from 'next/router';
import ShoppingList from './shoppingList';

export default function Login() {
  const Router = useRouter();
  const { user, updateUser } = useContext(UserContext);

  const userCredentials = {
    users: [
      {
        _id: '64a03e5f0aa1e53602449dc9',
        name: 'Dad',
        email: 'dad@dad.com',
        password: 'dddddddd',
        shoppingList: []
      },
      {
        _id: '64a03e6a0aa1e53602449dcb',
        name: 'Mom',
        email: 'mom@mom.com',
        password: 'mmmmmmmm',
        shoppingList: []
      },
      {
        _id: '64a03e720aa1e53602449dcd',
        name: 'Tim',
        email: 'tim@tim.com',
        password: 'tttttttt',
        shoppingList: []
      },
      {
        _id: '64a03e7b0aa1e53602449dcf',
        name: 'Mit',
        email: 'mit@mit.com',
        password: 'mmmmmmmm',
        shoppingList: []
      }
    ]
  };

  const handleLogin = (event) => {
    const clickedUser = userCredentials.users.find(user => user.name.toLowerCase() === event.target.id);
    if (clickedUser) {
      updateUser(clickedUser);
      Router.push({
        pathname: '/shoppingList',
        query: { id: clickedUser._id },
      });
    }
  };
  

  return (
    <div>
        <div className={styles.container}>
          <h1>Login</h1>
          <button id="dad" onClick={handleLogin}>Dad</button>
          <button id="mom" onClick={handleLogin}>Mom</button>
          <button id="tim" onClick={handleLogin}>Tim</button>
          <button id="mit" onClick={handleLogin}>Mit</button>
        </div>
    </div>
  );
}
