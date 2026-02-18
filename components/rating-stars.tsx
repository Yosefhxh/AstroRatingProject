import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

export type RatingStarsProps = {
  maxStars?: number;
  initialRating?: number;
  starSize?: number;
  filledColor?: string;
  emptyColor?: string;
  style?: ViewStyle;
  onRatingChange?: (rating: number) => void;
  accessibilityLabel?: string;
};

export function RatingStars({
  maxStars = 5,
  initialRating = 0,
  starSize = 28,
  filledColor = '#f1c40f',
  emptyColor = '#bdbdbd',
  style,
  onRatingChange,
  accessibilityLabel = 'Rating',
}: RatingStarsProps) {
  const [rating, setRating] = useState<number>(Math.min(maxStars, Math.max(0, Math.round(initialRating))));

  // Animated scale values per star
  const scalesRef = useRef<Animated.Value[]>([]);
  if (scalesRef.current.length !== maxStars) {
    scalesRef.current = Array.from({ length: maxStars }, () => new Animated.Value(1));
  }

  // skip the initial mount when running the global animation
  const mountedRef = useRef(false);

  useEffect(() => {
    // keep internal rating in sync if initialRating prop changes
    setRating(Math.min(maxStars, Math.max(0, Math.round(initialRating))));
  }, [initialRating, maxStars]);

  // run a small staggered pop animation when rating changes (not on first mount)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const animations = scalesRef.current.map((scale) =>
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.25, duration: 120, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
      ])
    );

    Animated.stagger(40, animations).start();
  }, [rating]);

  const handlePress = (index: number) => {
    const newRating = index + 1;
    setRating(newRating);
    onRatingChange?.(newRating);

    // animate the pressed star: quick pop
    const scale = scalesRef.current[index];
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={[styles.container, style]} accessible accessibilityRole="adjustable" accessibilityLabel={accessibilityLabel}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < rating;
        const color = filled ? filledColor : emptyColor;
        const scale = scalesRef.current[i] ?? new Animated.Value(1);

        return (
          <Pressable
            key={`star-${i}`}
            onPress={() => handlePress(i)}
            android_ripple={{ color: 'rgba(0,0,0,0.08)', radius: starSize }}
            accessibilityRole="button"
            accessibilityLabel={`${accessibilityLabel} ${i + 1} of ${maxStars}`}
          >
            <Animated.View style={{ transform: [{ scale }], marginHorizontal: 4 }}>
              <MaterialIcons name={filled ? 'star' : 'star-border'} size={starSize} color={color} />
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default RatingStars;
