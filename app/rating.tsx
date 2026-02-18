import RatingStars from '@/components/rating-stars';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';

export default function RatingScreen() {
  const [rating, setRating] = useState(3);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // simple feedback animation when rating changes
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.12, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
  }, [rating, scale]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Animated.Text style={[styles.label, { transform: [{ scale }] }]}>
          Tu calificación: {rating}
        </Animated.Text>

        <RatingStars
          initialRating={rating}
          starSize={44}
          filledColor="#ffb300"
          emptyColor="#e0e0e0"
          onRatingChange={(r) => setRating(r)}
          accessibilityLabel="Calificación"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  label: { fontSize: 18, marginBottom: 16 },
});
