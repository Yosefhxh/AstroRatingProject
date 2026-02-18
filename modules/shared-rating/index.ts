import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter, NativeModulesProxy, Subscription } from 'expo-modules-core';

const SharedRatingModule = NativeModulesProxy.SharedRating;
const RATING_KEY = '@main_rating';

export function getRating(): number {
  if (!SharedRatingModule) {
    return 0;
  }
  return SharedRatingModule.getRating();
}

export function setRating(rating: number): void {
  if (!SharedRatingModule) {
    AsyncStorage.setItem(RATING_KEY, rating.toString()).catch(() => {});
    return;
  }
  SharedRatingModule.setRating(rating);
  AsyncStorage.setItem(RATING_KEY, rating.toString()).catch(() => {});
}

export async function loadRating(): Promise<number> {
  if (SharedRatingModule) {
    return SharedRatingModule.getRating();
  }
  try {
    const value = await AsyncStorage.getItem(RATING_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export function addRatingChangeListener(listener: (event: { rating: number }) => void): Subscription {
  if (!SharedRatingModule) {
    return { remove: () => {} };
  }
  const emitter = new EventEmitter(SharedRatingModule);
  return emitter.addListener('onRatingChanged', listener);
}
