import { RatingStars } from '@/components/rating-stars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const PRODUCT_RATING_KEY = '@product_rating';
const SERVICE_RATING_KEY = '@service_rating';

export default function TabTwoScreen() {
  const [productRating, setProductRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);

  useEffect(() => {
    // Load saved ratings
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const product = await AsyncStorage.getItem(PRODUCT_RATING_KEY);
      const service = await AsyncStorage.getItem(SERVICE_RATING_KEY);
      if (product) setProductRating(parseInt(product, 10));
      if (service) setServiceRating(parseInt(service, 10));
    } catch (error) {
      console.log('Error loading ratings:', error);
    }
  };

  const handleProductRatingChange = async (rating: number) => {
    setProductRating(rating);
    try {
      await AsyncStorage.setItem(PRODUCT_RATING_KEY, rating.toString());
    } catch (error) {
      console.log('Error saving product rating:', error);
    }
  };

  const handleServiceRatingChange = async (rating: number) => {
    setServiceRating(rating);
    try {
      await AsyncStorage.setItem(SERVICE_RATING_KEY, rating.toString());
    } catch (error) {
      console.log('Error saving service rating:', error);
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.section}>
        <ThemedText type="title">Valoraciones</ThemedText>
        <ThemedText style={styles.help}>Personaliza estilo y captura cambios con onRatingChange</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Producto</ThemedText>
        <RatingStars
          initialRating={productRating}
          starSize={34}
          filledColor="#F59E0B"
          emptyColor="#9CA3AF"
          onRatingChange={handleProductRatingChange}
          accessibilityLabel="Calificación de producto"
        />
        <ThemedText>Resultado: {productRating}/5</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Servicio</ThemedText>
        <RatingStars
          initialRating={serviceRating}
          starSize={30}
          filledColor="#22C55E"
          emptyColor="#A3A3A3"
          onRatingChange={handleServiceRatingChange}
          accessibilityLabel="Calificación de servicio"
        />
        <ThemedText>Resultado: {serviceRating}/5</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  help: {
    opacity: 0.8,
  },
});
