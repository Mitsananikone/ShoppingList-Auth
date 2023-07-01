import { useState, useContext, useEffect } from 'react';
import styles from '../styles/ShoppingList.module.css';
import { UserContext } from '../lib/usercontext';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserContextProvider } from '../lib/usercontext';
import { useRouter } from 'next/router';

const ShoppingList = ({ items }) => {
  const { user, updateUser } = useContext(UserContext);
  const [shoppingList, setShoppingList] = useState(items || []);
  const [input, setInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const router = useRouter();
  const { id } = router.query;


  const fetchShoppingList = async () => {
    try {
      const userId = id;
      if (!userId) {
        return;
      }

      const response = await fetch(`/api/user/${userId}`);  // fetch Mit's 
      if (response.ok) {
        const userData = await response.json();
        setShoppingList(userData.shoppingList || []);
        console.log("userdata: " + userData)
      } else {
        throw new Error('Failed to fetch shopping list');
      }
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (router.pathname !== '/login') {
      fetchShoppingList();
    }
  }, []);


  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = id;
    try {
      const response = await fetch('/api/addItem', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          item: input,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setShoppingList(prevList => [...prevList, input]);
        const updatedShoppingList = user && user.shoppingList ? user.shoppingList.filter(i => i !== input) : [];
        updateUser({ ...user, shoppingList: updatedShoppingList });

        setInput("");
      } else {
        throw new Error('Failed to add item');
        setInput("");
      }
    } catch (error) {
      console.error(`An error occurred while adding the item: ${error.message}`);
      setInput("");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const userId = id;

      const response = await fetch('/api/deleteItem', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId,
          item: item,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUploadStatus('Item deleted successfully!');
        setShoppingList(prevList => prevList.filter(i => i !== item));
        const updatedShoppingList = user && user.shoppingList ? user.shoppingList.filter(i => i !== input) : [];
        updateUser({ ...user, shoppingList: updatedShoppingList });

        user.save;

        // Display the alert here instead of using modalContent state
        alert(`${item.charAt(0).toUpperCase() + item.slice(1)} has been removed`);

      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      setUploadStatus(`An error occurred while deleting the item: ${error.message}`);
      console.error(error);
      setTimeout(() => {
        setUploadStatus("");
      }, 3000);  // 3000ms = 3 seconds
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.list_container}>
          <ul className={styles.shoppingList}>
            <UserContextProvider>
              {shoppingList.map((item, index) => (
                <li key={index} className={styles.shoppingItem}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <div className={styles.cartControls}>
                    <div className={styles.removeItem} onClick={() => handleDeleteItem(item)}>
                      <TrashIcon className={styles.trashcan} />
                    </div>
                  </div>
                </li>
              ))}
            </UserContextProvider>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form_inner}>
          <input type="text" value={input} onChange={handleInputChange} className={styles.input} />
          <button type="submit" id={styles.enter}>Add</button>
        </div>
      </form>

    </div>
  );
}

export default ShoppingList;

export async function getServerSideProps() {
  try {
    // Fetch the items from the MongoDB database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
    const users = await response.json();
    const items = users.map((user) => user.shoppingList).flat();

    // Pass the items as props to the component
    return {
      props: {
        items,
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);

    // Return an empty items array if there's an error
    return {
      props: {
        items: [],
      },
    };
  }
}
