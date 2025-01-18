import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '@/firebase';

export const fetchUserBooks = async user => {
  try {
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const userRef = doc(db, 'users', user.uid);
    console.log('Referencja użytkownika:', userRef.path);

    const booksRef = collection(db, 'books');
    const q = query(booksRef, where('user', '==', userRef));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Brak książek dla użytkownika:', user.uid);
      return [];
    }

    const books = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('Pobrane książki:', books);
    return books;
  } catch (err) {
    console.error('Błąd podczas pobierania książek:', err.message);
    throw err;
  }
};
