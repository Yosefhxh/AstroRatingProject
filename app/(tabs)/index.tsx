import { RatingStars } from '@/components/rating-stars';
import { ExtensionStorage } from '@bacons/apple-targets';
import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Initialize storage with your group ID
const storage = new ExtensionStorage('group.codeyosef.AstroRatingProject');
const STORAGE_KEY = 'currentRating';

export default function HomeScreen() {
  const [rating, setRating] = useState(0);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load initial rating from storage
    const savedRating = storage.get(STORAGE_KEY) ?? 0;
    setRating(savedRating);

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', (status) => {
      if (status === 'background') {
        // Reload widget when app goes to background
        ExtensionStorage.reloadWidget();
      } else if (status === 'active') {
        // Reload rating from storage when app comes to foreground (widget may have changed it)
        const updatedRating = storage.get(STORAGE_KEY) ?? 0;
        setRating(updatedRating);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (rating === 0) return;
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [rating, scale]);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    storage.set(STORAGE_KEY, newRating);
    ExtensionStorage.reloadWidget();
  };

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.card}>
        <ThemedText type="title">Califica tu experiencia</ThemedText>
        <ThemedText style={styles.subtitle}>Selecciona de 1 a 5 estrellas</ThemedText>

        <RatingStars
          initialRating={rating}
          starSize={42}
          filledColor="#FFB300"
          emptyColor="#B0B0B0"
          onRatingChange={handleRatingChange}
          accessibilityLabel="Calificación principal"
        />

        <Animated.View style={{ transform: [{ scale }] }}>
          <ThemedText type="subtitle">Puntuación actual: {rating}/5</ThemedText>
        </Animated.View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  subtitle: {
    opacity: 0.8,
  },
});
