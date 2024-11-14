import { collection, getDocs, doc, setDoc, writeBatch, QueryDocumentSnapshot,
  enableNetwork, disableNetwork,getDoc } from 'firebase/firestore';
import { db } from './config';
import type { Mediator } from '../types';
import { mediatorData } from '../data/mediators';

let isOffline = false;

export const getMediators = async (): Promise<Mediator[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'mediators'));
    if (querySnapshot.empty) {
      await seedMediators();
      return mediatorData;
    }
    console.log('met:',querySnapshot.docs);
    return querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    } as Mediator));
  } catch (error) {
    console.error('Error fetching mediators:', error);
    // If we're offline, return the local data
    if (!isOffline) {
      isOffline = true;
      console.log('Switching to offline mode, using local data');
      // Disable network to prevent unnecessary retries
      await disableNetwork(db);
    }
    return mediatorData;
  }
};
export const getMediatorById = async (id: string): Promise<Mediator | null> => {
  try {
    console.log('id:',id);
    const docRef = doc(db, 'mediators', id);
    const docSnap = await getDoc(docRef);
    console.log('doncSnap:',docSnap);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Mediator;
    } else {
      console.log('No mediator found with this ID');
      return mediatorData.find(med=>med.id===id) || null;
    }
  } catch (error) {
    console.error('Error fetching mediator:', error);
    return null;
  }
}
export const updateMediatorProfile = async (userId: string, data: Omit<Mediator, 'id'>) => {
  try {
    if (isOffline) {
      // Try to reconnect if we were offline
      await enableNetwork(db);
      isOffline = false;
    }
    
    await setDoc(doc(db, 'mediators', userId), {
      ...data,
      expertise: Array.isArray(data.expertise) ? data.expertise : [data.expertise],
      education: Array.isArray(data.education) ? data.education : [data.education],
      licenses: Array.isArray(data.licenses) ? data.licenses : [data.licenses],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile. Please check your internet connection and try again.');
  }
};

export const createInitialProfile = async (userId: string, data: Partial<Mediator>) => {
  try {
    if (isOffline) {
      await enableNetwork(db);
      isOffline = false;
    }

    await setDoc(doc(db, 'mediators', userId), {
      id: userId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating initial profile:', error);
    throw new Error('Failed to create initial profile. Please check your internet connection and try again.');
  }
};

const seedMediators = async () => {
  const batch = writeBatch(db);
  try {
    mediatorData.forEach((mediator) => {
      const docRef = doc(collection(db, 'mediators'));
      const {  ...mediatorWithoutId } = mediator;
      batch.set(docRef, {
        ...mediatorWithoutId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error seeding mediators:', error);
    throw new Error('Failed to seed mediators. Please check your internet connection and try again.');
  }
};