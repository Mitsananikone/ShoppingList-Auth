// import React, { useContext, useEffect } from 'react';
// import { getAllUsers } from '../lib/dal';
// import { connectToDatabase } from '../lib/mongodb';
// import { UserContext, UserContextProvider } from '../lib/usercontext';
// import ShoppingList from './shoppingList';


// require('dotenv').config();

import React, { useContext, useEffect } from 'react';
import { connectToDatabase } from '../lib/mongodb';
import { UserContext, UserContextProvider } from '../lib/usercontext';
import Login from './login';

require('dotenv').config();

export default function App({ users }) {
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('Index user:', user); // Log the user to the console
  }, [user]);

  return (
    <div className="root" style={{width: '100%'}}>
      <UserContextProvider>
        <Login/>
      </UserContextProvider>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { db } = await connectToDatabase();
    const users = await db.collection('users').find().toArray();
    const parsedUsers = JSON.parse(JSON.stringify(users));

    return { 
      props: { users: parsedUsers },
      revalidate: 1, // In seconds
    };
  } catch (error) {
    console.error(error);
    return { 
      props: { users: parsedUsers},
      revalidate: 1,
   };
  }
}

