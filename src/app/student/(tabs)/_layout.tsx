
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, router, Tabs } from "expo-router";

const C = {
  blue: "#6478E8",
  muted: "#8992A6",
};

function StudentNavbar() {
  const pathname = usePathname();

  const items = [
    {
      label: "Home",
      route: "/student",
      icon: "home" as const,
      outline: "home-outline" as const,
    },
    {
      label: "Timetable",
      route: "/student/timetable",
      icon: "calendar" as const,
      outline: "calendar-outline" as const,
    },
    {
      label: "Planner",
      route: "/student/planner",
      icon: "checkbox" as const,
      outline: "checkbox-outline" as const,
    },
    {
      label: "Profile",
      route: "/student/profile",
      icon: "person" as const,
      outline: "person-outline" as const,
    },
  ];

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFFE9",
          borderRadius: 25,
          borderWidth: 1,
          borderColor: "#EEEEEE",
          paddingHorizontal: 6,
          paddingTop: 7,
          paddingBottom: 2,
          shadowColor: "#6478E8",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 15,
          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {items.map((item) => {
            const selected =
              item.label === "Home"
                ? pathname === "/student" ||
                  pathname === "/student/"
                : pathname === item.route ||
                  pathname.startsWith(item.route + "/");

            return (
              <Pressable
                key={item.label}
                onPress={() => {
                  if (!selected) {
                    router.navigate(item.route as any);
                  }
                }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 5,
                }}
              >
                {selected ? (
                  <LinearGradient
                    colors={["#F0F2FF", "#E6EAFF", "#F2EEFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 48,
                      height: 39,
                      borderRadius: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#E3E7FF",
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={C.blue}
                    />
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      width: 48,
                      height: 39,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={item.outline}
                      size={21}
                      color={C.muted}
                    />
                  </View>
                )}

                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 5,
                    fontSize: 10,
                    fontWeight: selected ? "800" : "600",
                    color: selected ? C.blue : C.muted,
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function StudentTabsLayout() {
  return (
    <Tabs
      tabBar={() => <StudentNavbar />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "#F7F8FC",
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="timetable" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
