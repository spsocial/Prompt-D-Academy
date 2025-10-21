/**
 * Script แก้ไขข้อมูล progress ของ user
 * แก้จาก Array เป็น Object
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const USER_ID = 'zIu5TKUQsLh2G0ECabcpAcuieYV2';

async function fixUserProgress() {
  console.log('🔧 Starting to fix user progress...');
  console.log('User ID:', USER_ID);

  try {
    const userRef = doc(db, 'users', USER_ID);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('❌ User not found!');
      return;
    }

    const userData = userSnap.data();
    console.log('📊 Current user data:', userData);
    console.log('📊 Current progress:', userData.progress);
    console.log('📊 Progress type:', Array.isArray(userData.progress) ? 'Array ❌' : 'Object ✅');

    // ถ้า progress เป็น Array หรือไม่มี ให้สร้างใหม่เป็น Object
    if (Array.isArray(userData.progress) || !userData.progress) {
      console.log('⚠️ Progress is Array or undefined. Fixing...');

      // สร้าง progress object ใหม่
      const newProgress = {};

      console.log('✅ Setting progress to empty object:', newProgress);

      await updateDoc(userRef, {
        progress: newProgress
      });

      console.log('✅ Progress fixed successfully!');
      console.log('🔄 New structure:', newProgress);
    } else {
      console.log('✅ Progress is already an object. No fix needed.');
      console.log('📊 Current progress structure:', userData.progress);
    }

  } catch (error) {
    console.error('❌ Error fixing progress:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message
    });
  }
}

// Run the script
fixUserProgress()
  .then(() => {
    console.log('🎉 Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
