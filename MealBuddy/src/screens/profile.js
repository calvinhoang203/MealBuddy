import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { db, auth } from "../services/firebase_config";
import { doc, getDoc } from "firebase/firestore";
import styles from '../styles/profile_styles'; // Import Styles
import { signOut } from 'firebase/auth';
import { TouchableOpacity } from 'react-native';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase sign out
      navigation.replace('Auth'); // Navigate back to AuthScreen
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Text style={styles.subtitle}>Age: {user.age}</Text>
          <Text style={styles.subtitle}>Gender: {user.gender}</Text>
          <Text style={styles.subtitle}>Height: {user.height} </Text>
          <Text style={styles.subtitle}>Weight: {user.weight} pounds</Text>
        </>
      ) : (
        <Text style={styles.noDataText}>No profile data found.</Text>
      )}
    </View>
  );
};

export default Profile;
