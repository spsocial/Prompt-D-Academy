/**
 * Migration Script: Import mockData to Firestore
 *
 * วิธีใช้:
 * 1. เปิด Terminal
 * 2. รันคำสั่ง: npx ts-node scripts/migrateData.ts
 * 3. ข้อมูลจาก mockData จะถูก import เข้า Firestore
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { mockAITools, mockLearningPaths } from '../data/mockData';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  console.log('🚀 Starting migration...\n');

  try {
    // Migrate AI Tools
    console.log('📦 Migrating AI Tools...');
    for (const tool of mockAITools) {
      const toolRef = doc(db, 'aiTools', tool.id);
      await setDoc(toolRef, tool);
      console.log(`   ✅ ${tool.name} (${tool.id})`);
    }
    console.log(`\n✨ Migrated ${mockAITools.length} AI Tools\n`);

    // Migrate Learning Paths
    console.log('📚 Migrating Learning Paths...');
    for (const path of mockLearningPaths) {
      const pathRef = doc(db, 'learningPaths', path.id);
      await setDoc(pathRef, path);
      console.log(`   ✅ ${path.title} (${path.id})`);
    }
    console.log(`\n✨ Migrated ${mockLearningPaths.length} Learning Paths\n`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Go to /admin/tools - you should see all AI Tools');
    console.log('   2. Go to /admin/paths - you should see all Learning Paths');
    console.log('   3. The main website will now load from Firestore\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateData();
