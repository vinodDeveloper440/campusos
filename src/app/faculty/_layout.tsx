import { Stack } from 'expo-router';

export default function FacultyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="timetable" />
      <Stack.Screen name="attendance" />
      <Stack.Screen name="attendance-history" />
      <Stack.Screen name="attendance-reports" />
      <Stack.Screen name="subjects" />
      <Stack.Screen name="assignments" />
      <Stack.Screen name="create-assignment" />
      <Stack.Screen name="materials" />
      <Stack.Screen name="marks" />
      <Stack.Screen name="students" />
      <Stack.Screen name="announcements" />
      <Stack.Screen name="leave-request" />
      <Stack.Screen name="performance" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="exams" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="updates" />
    </Stack>
  );
}
