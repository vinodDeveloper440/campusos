import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "student" | "faculty" | "parent" | "hod" | "principal";

const ROLE_CONFIG = {
  student: {
    title: "Welcome, Student!",
    subtitle: "Your learning journey starts here.",
    color: "#6478E8",
    light: "#F0F2FF",
    icon: "school-outline" as const,
    cardTitle: "Ready to learn?",
    cardText: "Your classes, attendance and assignments await.",
    dashboard: "/student" as const,
  },
  faculty: {
    title: "Welcome, Faculty!",
    subtitle: "Inspiring minds, every day.",
    color: "#159A75",
    light: "#E9F8F2",
    icon: "book-outline" as const,
    cardTitle: "Your classroom awaits",
    cardText: "Manage classes, attendance and student progress.",
    dashboard: "/faculty" as const,
  },
  parent: {
    title: "Welcome, Parent!",
    subtitle: "Stay connected to their journey.",
    color: "#8B63D9",
    light: "#F3EDFF",
    icon: "heart-outline" as const,
    cardTitle: "Growing together",
    cardText: "Keep up with attendance and academic updates.",
    dashboard: "/parent" as const,
  },
  hod: {
    title: "Welcome, HOD!",
    subtitle: "Your department is ready for you.",
    color: "#6478E8",
    light: "#EEF1FF",
    icon: "school-outline" as const,
    cardTitle: "Department overview",
    cardText:
      "Review faculty requests, course progress and department updates.",
    dashboard: "/hod" as const,
  },
  principal: {
    title: "Welcome, Principal!",
    subtitle: "Lead your campus with confidence.",
    color: "#B68A37",
    light: "#FFF6E5",
    icon: "business-outline" as const,
    cardTitle: "Your campus at a glance",
    cardText: "Stay on top of school operations and performance.",
    dashboard: "/principal" as const,
  },
};

export default function LoginSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();

  const rawRole = (params.role || "").toLowerCase();
  const isValidRole = Object.prototype.hasOwnProperty.call(
    ROLE_CONFIG,
    rawRole,
  );

  const role: Role = isValidRole ? (rawRole as Role) : "student";

  const config = ROLE_CONFIG[role];

  const float = useSharedValue(0);
  const rotate = useSharedValue(-3);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1600 }),
        withTiming(-3, { duration: 1600 }),
      ),
      -1,
      false,
    );
  }, [float, rotate]);

  useEffect(() => {
    if (!isValidRole) {
      router.replace("/login");
      return;
    }

    const timer = setTimeout(() => {
      router.replace(config.dashboard as never);
    }, 1000);

    return () => clearTimeout(timer);
  }, [config.dashboard, isValidRole, router]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* Brand */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.brandRow}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandLetter}>C</Text>
            <View style={styles.brandDot} />
          </View>

          <View>
            <Text style={styles.brandName}>CampusOS</Text>
            <Text style={styles.brandTag}>CAMPUS, CONNECTED</Text>
          </View>
        </Animated.View>

        {/* Animated hero illustration */}
        <View style={styles.hero}>
          <Animated.View
            entering={ZoomIn.duration(700).springify()}
            style={[
              styles.orbit,
              {
                backgroundColor: config.light,
                borderColor: config.color + "25",
              },
            ]}
          >
            <Animated.View
              style={[
                styles.iconCircle,
                { backgroundColor: config.color },
                floatingStyle,
              ]}
            >
              <Ionicons name={config.icon} size={70} color="#FFFFFF" />
            </Animated.View>

            {/* Floating decorative bubbles */}
            <Animated.View
              entering={FadeIn.delay(350).duration(500)}
              style={[
                styles.bubble,
                styles.bubbleTop,
                { backgroundColor: config.color },
              ]}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </Animated.View>

            <Animated.View
              entering={FadeIn.delay(550).duration(500)}
              style={[styles.bubble, styles.bubbleBottom]}
            >
              <Ionicons name="checkmark" size={22} color={config.color} />
            </Animated.View>

            <View
              style={[
                styles.smallDot,
                styles.dotLeft,
                { backgroundColor: config.color },
              ]}
            />
            <View
              style={[
                styles.smallDot,
                styles.dotRight,
                { backgroundColor: config.color },
              ]}
            />
          </Animated.View>
        </View>

        {/* Role-specific welcome */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(700)}
          style={styles.welcome}
        >
          <View style={[styles.roleBadge, { backgroundColor: config.light }]}>
            <View
              style={[styles.roleIndicator, { backgroundColor: config.color }]}
            />
            <Text style={[styles.roleText, { color: config.color }]}>
              {role.toUpperCase()} PORTAL
            </Text>
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </Animated.View>

        {/* Role-specific preview card */}
        <Animated.View
          entering={FadeInDown.delay(550).duration(700)}
          style={[styles.previewCard, { borderColor: config.color + "25" }]}
        >
          <View style={[styles.previewIcon, { backgroundColor: config.light }]}>
            <Ionicons name="grid-outline" size={24} color={config.color} />
          </View>

          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>{config.cardTitle}</Text>
            <Text style={styles.previewText}>{config.cardText}</Text>
          </View>

          <Ionicons
            name="arrow-forward-circle"
            size={28}
            color={config.color}
          />
        </Animated.View>

        {/* Loading indicator */}
        <Animated.View
          entering={FadeIn.delay(850).duration(600)}
          style={styles.loading}
        >
          <View
            style={[styles.loadingDot, { backgroundColor: config.color }]}
          />
          <Text style={styles.loadingText}>Preparing your dashboard...</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>YOUR CAMPUS. YOUR SPACE.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandLogo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#111A35",
    alignItems: "center",
    justifyContent: "center",
  },
  brandLetter: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "900",
  },
  brandDot: {
    position: "absolute",
    right: 3,
    bottom: 3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#6478E8",
    borderWidth: 1,
    borderColor: "#111A35",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111A35",
  },
  brandTag: {
    fontSize: 8,
    letterSpacing: 1.7,
    fontWeight: "700",
    color: "#8992A6",
    marginTop: 3,
  },
  hero: {
    flex: 1,
    minHeight: 210,
    maxHeight: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  orbit: {
    width: 218,
    height: 218,
    borderRadius: 109,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 136,
    height: 136,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    elevation: 12,
    shadowColor: "#111A35",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  bubble: {
    position: "absolute",
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  bubbleTop: {
    top: 18,
    right: 20,
  },
  bubbleBottom: {
    bottom: 18,
    left: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EBF2",
  },
  smallDot: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotLeft: {
    top: 42,
    left: 17,
  },
  dotRight: {
    right: 18,
    bottom: 44,
  },
  welcome: {
    alignItems: "center",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 13,
    paddingVertical: 8,
    gap: 7,
  },
  roleIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },
  title: {
    color: "#111A35",
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
  },
  subtitle: {
    color: "#8992A6",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    gap: 12,
    marginTop: 25,
    backgroundColor: "#FFFFFF",
  },
  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    color: "#111A35",
    fontSize: 14,
    fontWeight: "700",
  },
  previewText: {
    color: "#8992A6",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 24,
  },
  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  loadingText: {
    color: "#8992A6",
    fontSize: 12,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#A0A7B6",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
