
import { useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  Easing,
  useAnimatedValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();

  const logoScale = useAnimatedValue(0.65);
  const logoOpacity = useAnimatedValue(0);
  const logoFloat = useAnimatedValue(0);

  const titleOpacity = useAnimatedValue(0);
  const titleTranslate = useAnimatedValue(18);

  const taglineOpacity = useAnimatedValue(0);
  const loaderPosition = useAnimatedValue(-35);

  useEffect(() => {
    // Logo entrance
    const logoEntrance = Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 75,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    // App name entrance
    const textEntrance = Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);

    logoEntrance.start();
    textEntrance.start();

    // Gentle floating logo
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -5,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    floatingAnimation.start();

    // Moving loading indicator
    const loadingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(loaderPosition, {
          toValue: 48,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(loaderPosition, {
          toValue: -35,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loadingAnimation.start();

    // Navigate to onboarding
    const timer = setTimeout(() => {
      router.replace('/onboardingScreen');
    }, 2500);

    return () => {
      clearTimeout(timer);
      logoEntrance.stop();
      textEntrance.stop();
      floatingAnimation.stop();
      loadingAnimation.stop();
    };
  }, [
    router,
    logoScale,
    logoOpacity,
    logoFloat,
    titleOpacity,
    titleTranslate,
    taglineOpacity,
    loaderPosition,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
      />

      <View className="flex-1 items-center justify-center px-6">
        {/* Animated logo */}
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [
              { scale: logoScale },
              { translateY: logoFloat },
            ],
          }}
          className="mb-7"
        >
          <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-[#111A35]">
            <View className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-[#6478E8]">
              <Ionicons
                name="sparkles"
                size={15}
                color="#FFFFFF"
              />
            </View>

            <Text className="text-5xl font-extrabold text-white">
              C
            </Text>
          </View>
        </Animated.View>

        {/* Animated app name */}
        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          }}
          className="items-center"
        >
          <Text className="text-3xl font-extrabold tracking-tight text-[#111A35]">
            CampusOS
          </Text>
        </Animated.View>

        {/* Animated tagline */}
        <Animated.Text
          style={{ opacity: taglineOpacity }}
          className="mt-3 text-base font-medium text-[#8992A6]"
        >
          Your campus, connected.
        </Animated.Text>

        {/* Animated loading bar */}
        <View className="mt-12 h-1 w-16 overflow-hidden rounded-full bg-[#E8EBF2]">
          <Animated.View
            style={{
              transform: [{ translateX: loaderPosition }],
            }}
            className="h-1 w-8 rounded-full bg-[#6478E8]"
          />
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8">
        <Text className="text-center text-[10px] font-bold tracking-[3px] text-[#A1A8B8]">
          MADE FOR CAMPUS LIFE
        </Text>
      </View>
    </SafeAreaView>
  );
}
