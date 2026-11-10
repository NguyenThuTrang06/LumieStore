import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { FeedbackProvider } from '@/context/FeedbackContext';
import { initializeDatabase } from '@/database/db';
import { C } from '@/constants/colors';

export default function RootLayout(){
 return <SQLiteProvider databaseName="lumie-store.db" onInit={initializeDatabase}>
  <FeedbackProvider>
   <AppProvider>
    <StatusBar style="dark"/>
    <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.cream},animation:'slide_from_right'}}/>
   </AppProvider>
  </FeedbackProvider>
 </SQLiteProvider>;
}
