import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="services" />
      <Stack.Screen name="library" />
      <Stack.Screen name="fees" />
      <Stack.Screen name="student-support" />
      <Stack.Screen name="leave-request" />
      <Stack.Screen name="assignments" />
      <Stack.Screen name="results" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="campus-transport" />
      <Stack.Screen name="cafeteria" />
      <Stack.Screen name="hostel" />
      <Stack.Screen name="maintenance" />
      <Stack.Screen name="certificates" />
      <Stack.Screen name="events" />
    </Stack>
  );
}
