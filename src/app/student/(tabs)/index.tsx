import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const C = {
  navy: "#202B49",
  blue: "#6478E8",
  muted: "#8992A6",
  border: "#E8ECF4",
  bg: "#F5F7FC",
  white: "#FFFFFF",
  green: "#259B78",
  orange: "#D99035",
  red: "#DC626B",
  purple: "#9277D6",
  paleBlue: "#EEF1FF",
  paleGreen: "#EAF8F1",
  paleOrange: "#FFF5E8",
  palePurple: "#F3EFFF",
  darkBlue: "#263653",
};

type CabinRole = "Principal" | "HOD";

const CABINS = [
  {
    id: "principal",
    role: "Principal" as CabinRole,
    name: "Dr. Principal Name",
    department: "Principal Office",
    room: "Admin Block · Room 101",
    hours: "10:00 AM – 12:00 PM",
    days: "Monday – Friday",
    icon: "business-outline" as const,
    color: C.purple,
    tint: C.palePurple,
    description:
      "For academic concerns, college administration, official permissions and student welfare.",
    topics: ["Academic concerns", "Official permissions", "Student welfare"],
  },
  {
    id: "hod",
    role: "HOD" as CabinRole,
    name: "Dr. HOD Name",
    department: "Head of Department",
    room: "Department Block · Room 204",
    hours: "2:00 PM – 4:00 PM",
    days: "Monday – Friday",
    icon: "school-outline" as const,
    color: C.blue,
    tint: C.paleBlue,
    description:
      "For project guidance, department approvals, subject-related concerns and academic support.",
    topics: ["Project guidance", "Department approvals", "Academic support"],
  },
];

const ACADEMICS = [
  {
    title: "Assignments",
    subtitle: "Tasks & deadlines",
    detail: "Access your academic work",
    icon: "document-text-outline" as const,
    color: C.blue,
    tint: C.paleBlue,
    route: "/student/assignments",
  },
  {
    title: "Exam results",
    subtitle: "Marks & grades",
    detail: "Review your results",
    icon: "ribbon-outline" as const,
    color: C.green,
    tint: C.paleGreen,
    route: "/student/results",
  },
  {
    title: "Study materials",
    subtitle: "Notes & PDFs",
    detail: "Your learning resources",
    icon: "library-outline" as const,
    color: C.purple,
    tint: C.palePurple,
    route: "/student/studyMaterials",
  },
  {
    title: "Attendance",
    subtitle: "Subject-wise record",
    detail: "Track your attendance",
    icon: "calendar-outline" as const,
    color: C.orange,
    tint: C.paleOrange,
    route: "/student/attendance",
  },
  {
    title: "My subjects",
    subtitle: "Subjects & faculty",
    detail: "Explore your subjects",
    icon: "book-outline" as const,
    color: C.blue,
    tint: C.paleBlue,
    route: "/student/subjects",
  },
  {
    title: "Exam timetable",
    subtitle: "Upcoming exams",
    detail: "Check exam schedules",
    icon: "time-outline" as const,
    color: C.orange,
    tint: C.paleOrange,
    route: "/student/exam-timetable",
  },
    {
    title: "Syllabus",
    subtitle: "Semester syllabus & topics",
    detail: "Your semester syllabus and course topics",
    icon: "reader-outline" as const,
    color: C.green,
    tint: C.paleGreen,
    route: "/student/syllabus",
  },
    {
    title: "Question papers",
    subtitle: "Previous year exam papers",
    detail: "Practice with previous examination papers",
    icon: "documents-outline" as const,
    color: C.blue,
    tint: C.paleBlue,
    route: "/student/question-papers",
  },
  {
    title: "Performance analytics",
    subtitle: "Academic progress & insights",
    detail: "Your academic performance and progress",
    icon: "analytics-outline" as const,
    color: C.purple,
    tint: C.palePurple,
    route: "/student/performance-analytics",
  },
];

const SERVICES = [
  {
    title: "Library",
    subtitle: "Books & resources",
    description: "Explore learning resources",
    icon: "book-outline" as const,
    color: C.blue,
    tint: C.paleBlue,
    route: "/student/library",
  },
  {
    title: "Fee details",
    subtitle: "Fees & payments",
    description: "View your fee information",
    icon: "wallet-outline" as const,
    color: C.green,
    tint: C.paleGreen,
    route: "/student/fees",
  },
  {
    title: "Leave request",
    subtitle: "Apply for leave",
    description: "Manage leave applications",
    icon: "calendar-clear-outline" as const,
    color: C.orange,
    tint: C.paleOrange,
    route: "/student/leave-request",
  },
  {
    title: "Student support",
    subtitle: "Get campus help",
    description: "Find help when you need it",
    icon: "chatbubbles-outline" as const,
    color: C.purple,
    tint: C.palePurple,
    route: "/student/student-support",
  },
];

function SectionTitle({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-1 pr-2">
        <Text
          className="text-[18px] font-extrabold tracking-tight"
          style={{ color: C.navy }}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text className="mt-1 text-[11px]" style={{ color: C.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action && onAction ? (
        <Pressable
          onPress={onAction}
          className="flex-row items-center rounded-full px-3 py-2"
          style={{ backgroundColor: C.paleBlue }}
        >
          <Text className="text-[10px] font-extrabold" style={{ color: C.blue }}>
            {action}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={12}
            color={C.blue}
            style={{ marginLeft: 3 }}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

function QuickAction({
  title,
  icon,
  color,
  tint,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center rounded-[20px] px-1 py-4"
      style={{
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <View
        className="mb-2.5 h-12 w-12 items-center justify-center rounded-[17px]"
        style={{ backgroundColor: tint }}
      >
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <Text
        className="text-center text-[10px] font-extrabold"
        style={{ color: C.navy }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function AcademicCard({
  item,
  onPress,
}: {
  item: (typeof ACADEMICS)[number];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-[22px] p-4"
      style={{
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View
          className="h-11 w-11 items-center justify-center rounded-[15px]"
          style={{ backgroundColor: item.tint }}
        >
          <Ionicons name={item.icon} size={22} color={item.color} />
        </View>

        <View
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F5F6FA" }}
        >
          <Ionicons name="arrow-forward" size={14} color={C.blue} />
        </View>
      </View>

      <Text className="text-[13px] font-extrabold" style={{ color: C.navy }}>
        {item.title}
      </Text>

      <Text className="mt-1.5 text-[10px]" style={{ color: C.muted }}>
        {item.subtitle}
      </Text>

      <Text
        className="mt-2 text-[9px]"
        style={{ color: item.color }}
      >
        {item.detail}
      </Text>
    </Pressable>
  );
}

function ServiceRow({
  item,
  onPress,
}: {
  item: (typeof SERVICES)[number];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-[20px] p-3.5"
      style={{
        backgroundColor: C.white,
        borderWidth: 1,
        borderColor: C.border,
      }}
    >
      <View
        className="mr-3.5 h-12 w-12 items-center justify-center rounded-[16px]"
        style={{ backgroundColor: item.tint }}
      >
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>

      <View className="flex-1">
        <Text className="text-[13px] font-extrabold" style={{ color: C.navy }}>
          {item.title}
        </Text>

        <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
          {item.subtitle}
        </Text>

        <Text className="mt-1 text-[9px]" style={{ color: item.color }}>
          {item.description}
        </Text>
      </View>

      <View
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: "#F5F6FA" }}
      >
        <Ionicons name="chevron-forward" size={15} color={C.muted} />
      </View>
    </Pressable>
  );
}

export default function StudentDashboard() {
  const [expandedCabin, setExpandedCabin] = useState<string | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<CabinRole>("HOD");
  const [appointmentModal, setAppointmentModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [modalError, setModalError] = useState("");

  const navigate = (path: string) => {
    router.push(path as never);
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const selectedCabinInfo = CABINS.find(
    (cabin) => cabin.role === selectedCabin,
  );

  const openAppointment = (role: CabinRole) => {
    setSelectedCabin(role);
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentNote("");
    setModalError("");
    setAppointmentModal(true);
  };

  const submitAppointment = () => {
    if (
      !appointmentDate.trim() ||
      !appointmentTime.trim() ||
      !appointmentNote.trim()
    ) {
      setModalError("Please complete all the fields.");
      return;
    }

    setAppointmentModal(false);

    Alert.alert(
      "Request prepared",
      `Your ${selectedCabin} appointment is a demo. Connect a backend to send this request to college staff.`,
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: C.bg }}
      edges={["top",'bottom']}
    >
      <StatusBar barStyle="dark-content"  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* HEADER */}

        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <LinearGradient
                colors={["#263653", "#536B9A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text className="text-[24px] font-extrabold text-white">
                  C
                </Text>
              </LinearGradient>

              <View>
                <Text
                  className="text-[10px] font-extrabold tracking-[2.5px]"
                  style={{ color: C.muted }}
                >
                  CAMPUSOS
                </Text>

                <Text
                  className="mt-0.5 text-[16px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Student Portal
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2.5">
              <Pressable
                onPress={() => navigate("/student/notifications")}
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: C.white,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color={C.navy}
                />
                <View
                  className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: C.red,
                    borderWidth: 1,
                    borderColor: C.white,
                  }}
                />
              </Pressable>

              <Pressable
                onPress={() => navigate("/student/profile")}
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: C.paleBlue,
                  borderWidth: 1,
                  borderColor: "#E2E7FF",
                }}
              >
                <Ionicons name="person-outline" size={21} color={C.blue} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* WELCOME HERO */}

        <View className="mt-6 px-5">
          <LinearGradient
            colors={["#E8EDFF", "#F2F4FF", "#EEF5FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 28,
              padding: 19,
              borderWidth: 1,
              borderColor: "#E1E7FF",
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <View
                  className="self-start rounded-full px-3 py-1.5"
                  style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
                >
                  <Text
                    className="text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.blue }}
                  >
                    {formattedDate.toUpperCase()}
                  </Text>
                </View>

                <Text
                  className="mt-4 text-[27px] font-extrabold tracking-tight"
                  style={{ color: C.navy }}
                >
                  Hello, Student
                </Text>

                <Text
                  className="mt-1 text-[12px] font-semibold"
                  style={{ color: "#73809B" }}
                >
                  Welcome back to your campus 👋
                </Text>

                <Text
                  className="mt-3 max-w-[230px] text-[11px] leading-5"
                  style={{ color: C.muted }}
                >
                  Stay organised, keep learning and make every day count.
                </Text>
              </View>

              <View
                className="h-[68px] w-[68px] items-center justify-center rounded-[23px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderWidth: 1,
                  borderColor: "#FFFFFF",
                }}
              >
                <Ionicons name="school-outline" size={35} color={C.blue} />
              </View>
            </View>

            <View
              className="mt-6 flex-row items-center rounded-[19px] p-3.5"
              style={{
                backgroundColor: "rgba(255,255,255,0.85)",
                borderWidth: 1,
                borderColor: "#FFFFFF",
              }}
            >
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons
                    name="book-outline"
                    size={13}
                    color={C.blue}
                  />
                  <Text
                    className="ml-1.5 text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    PROGRAM
                  </Text>
                </View>

                <Text
                  className="mt-1.5 text-[11px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  B.Tech Computer Science
                </Text>
              </View>

              <View
                className="mx-3 h-9 w-px"
                style={{ backgroundColor: "#E5E9F3" }}
              />

              <View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="layers-outline"
                    size={13}
                    color={C.blue}
                  />
                  <Text
                    className="ml-1.5 text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    SEMESTER
                  </Text>
                </View>

                <Text
                  className="mt-1.5 text-[11px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Semester 5
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row items-center">
              <View className="flex-row items-center">
                <Ionicons name="school" size={13} color={C.blue} />
                <Text
                  className="ml-1.5 text-[10px] font-semibold"
                  style={{ color: "#73809B" }}
                >
                  Undergraduate
                </Text>
              </View>

              <View
                className="mx-3 h-1 w-1 rounded-full"
                style={{ backgroundColor: "#AAB4CD" }}
              />

              <Text
                className="text-[10px] font-semibold"
                style={{ color: "#73809B" }}
              >
                3rd Year
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* QUICK ACCESS */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="Quick access"
            subtitle="Your frequently used services"
          />

          <View className="flex-row gap-2.5">
            <QuickAction
              title="Assignments"
              icon="document-text-outline"
              color={C.blue}
              tint={C.paleBlue}
              onPress={() => navigate("/student/assignments")}
            />

            <QuickAction
              title="Results"
              icon="ribbon-outline"
              color={C.green}
              tint={C.paleGreen}
              onPress={() => navigate("/student/results")}
            />

            <QuickAction
              title="Attendance"
              icon="calendar-outline"
              color={C.orange}
              tint={C.paleOrange}
              onPress={() => navigate("/student/attendance")}
            />

            <QuickAction
              title="Materials"
              icon="book-outline"
              color={C.purple}
              tint={C.palePurple}
              onPress={() => navigate("/student/studyMaterials")}
            />
          </View>
        </View>

        {/* TODAY'S SCHEDULE */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="Today's schedule"
            subtitle="Your next classroom session"
            action="Full timetable"
            onAction={() => navigate("/student/timetable")}
          />

          <LinearGradient
            colors={["#E7EDFF", "#F4F6FF", "#EDF4FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 27,
              padding: 10,
              borderWidth: 1,
              borderColor: "#E1E8FF",
            }}
          >
            <View
              className="rounded-[21px] p-4"
              style={{
                backgroundColor: C.white,
                borderWidth: 1,
                borderColor: "#E9EDF6",
              }}
            >
              <View className="flex-row items-center justify-between">
                <View
                  className="flex-row items-center rounded-full px-3 py-1.5"
                  style={{ backgroundColor: C.paleGreen }}
                >
                  <View
                    className="mr-1.5 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: C.green }}
                  />
                  <Text
                    className="text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.green }}
                  >
                    UPCOMING CLASS
                  </Text>
                </View>

                <View
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: C.paleBlue }}
                >
                  <Ionicons name="time-outline" size={19} color={C.blue} />
                </View>
              </View>

              <Text
                className="mt-4 text-[22px] font-extrabold tracking-tight"
                style={{ color: C.navy }}
              >
                Data Structures
              </Text>

              <Text className="mt-1 text-[11px]" style={{ color: C.muted }}>
                Lecture · Computer Science
              </Text>

              <View
                className="my-4 h-px"
                style={{ backgroundColor: C.border }}
              />

              <View className="flex-row">
                <View className="flex-1 flex-row items-center">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: C.paleBlue }}
                  >
                    <Ionicons name="time-outline" size={19} color={C.blue} />
                  </View>

                  <View className="ml-2.5">
                    <Text
                      className="text-[9px] font-bold tracking-wider"
                      style={{ color: C.muted }}
                    >
                      CLASS TIME
                    </Text>
                    <Text
                      className="mt-1 text-[11px] font-extrabold"
                      style={{ color: C.navy }}
                    >
                      10:30–11:30 AM
                    </Text>
                  </View>
                </View>

                <View className="flex-1 flex-row items-center">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-[14px]"
                    style={{ backgroundColor: C.palePurple }}
                  >
                    <Ionicons
                      name="location-outline"
                      size={19}
                      color={C.purple}
                    />
                  </View>

                  <View className="ml-2.5">
                    <Text
                      className="text-[9px] font-bold tracking-wider"
                      style={{ color: C.muted }}
                    >
                      CLASSROOM
                    </Text>
                    <Text
                      className="mt-1 text-[11px] font-extrabold"
                      style={{ color: C.navy }}
                    >
                      Block B · 204
                    </Text>
                  </View>
                </View>
              </View>

              <View
                className="mt-4 flex-row items-center rounded-[16px] p-3"
                style={{ backgroundColor: "#F7F8FC" }}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: C.palePurple }}
                >
                  <Ionicons name="person-outline" size={18} color={C.purple} />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    className="text-[9px] font-bold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    FACULTY
                  </Text>
                  <Text
                    className="mt-1 text-[11px] font-extrabold"
                    style={{ color: C.navy }}
                  >
                    Dr. Priya Sharma
                  </Text>
                </View>

                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={C.green}
                />
              </View>
            </View>

            <View className="flex-row px-3 py-4">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={C.blue}
                  />
                  <Text
                    className="ml-1.5 text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    CLASSES TODAY
                  </Text>
                </View>

                <Text
                  className="mt-1.5 text-[18px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  6 classes
                </Text>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons
                    name="restaurant-outline"
                    size={14}
                    color={C.orange}
                  />
                  <Text
                    className="ml-1.5 text-[9px] font-extrabold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    LUNCH BREAK
                  </Text>
                </View>

                <Text
                  className="mt-1.5 text-[18px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  12:30 PM
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ATTENDANCE */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="Attendance overview"
            subtitle="Your current academic attendance"
            action="View details"
            onAction={() => navigate("/student/attendance")}
          />

          <Pressable
            onPress={() => navigate("/student/attendance")}
            className="rounded-[24px] p-4"
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-[16px]"
                style={{ backgroundColor: C.paleGreen }}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={23}
                  color={C.green}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[13px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Overall attendance
                </Text>

                <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                  92 of 100 sessions attended
                </Text>
              </View>

              <Text
                className="text-[26px] font-extrabold"
                style={{ color: C.green }}
              >
                92%
              </Text>
            </View>

            <View
              className="mt-5 h-2.5 overflow-hidden rounded-full"
              style={{ backgroundColor: "#EDF0F6" }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: "92%",
                  backgroundColor: C.green,
                }}
              />
            </View>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={C.green}
                />
                <Text
                  className="ml-1.5 text-[10px] font-bold"
                  style={{ color: C.green }}
                >
                  Good attendance
                </Text>
              </View>

              <Text className="text-[10px]" style={{ color: C.muted }}>
                Subject-wise details
              </Text>
            </View>

            <View
              className="mt-4 flex-row rounded-[15px] p-3"
              style={{ backgroundColor: "#F7F9FC" }}
            >
              <View className="flex-1">
                <Text className="text-[9px]" style={{ color: C.muted }}>
                  ATTENDED
                </Text>
                <Text
                  className="mt-1 text-[13px] font-extrabold"
                  style={{ color: C.green }}
                >
                  92 sessions
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-[9px]" style={{ color: C.muted }}>
                  MISSED
                </Text>
                <Text
                  className="mt-1 text-[13px] font-extrabold"
                  style={{ color: C.red }}
                >
                  8 sessions
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* ACADEMICS */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="My academics"
            subtitle="Your academic resources in one place"
          />

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {ACADEMICS.map((item) => (
              <View key={item.title} style={{ width: "48.5%" }}>
                <AcademicCard
                  item={item}
                  onPress={() => navigate(item.route)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* SERVICES */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="Student services"
            subtitle="Manage your campus activities"
            action="Explore"
            onAction={() => navigate("/student/services")}
          />

          <View className="gap-3">
            {SERVICES.map((item) => (
              <ServiceRow
                key={item.title}
                item={item}
                onPress={() => navigate(item.route)}
              />
            ))}
          </View>
        </View>

        {/* COLLEGE AUTHORITIES */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="College authorities"
            subtitle="Connect with your college leadership"
          />

          <LinearGradient
            colors={["#EEF0FF", "#F8F7FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              padding: 14,
              marginBottom: 13,
              borderWidth: 1,
              borderColor: "#E9E8FF",
            }}
          >
            <View className="flex-row items-center">
              <View
                className="h-10 w-10 items-center justify-center rounded-[14px]"
                style={{ backgroundColor: C.white }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={C.blue}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text
                  className="text-[12px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Need personal guidance?
                </Text>
                <Text
                  className="mt-1 text-[10px] leading-4"
                  style={{ color: C.muted }}
                >
                  Check the office location and timings before planning your
                  visit.
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View className="gap-3">
            {CABINS.map((cabin) => {
              const expanded = expandedCabin === cabin.id;

              return (
                <View
                  key={cabin.id}
                  className="overflow-hidden rounded-[22px]"
                  style={{
                    backgroundColor: C.white,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  <Pressable
                    onPress={() =>
                      setExpandedCabin(expanded ? null : cabin.id)
                    }
                    className="flex-row items-center p-4"
                  >
                    <View
                      className="mr-3.5 h-12 w-12 items-center justify-center rounded-[16px]"
                      style={{ backgroundColor: cabin.tint }}
                    >
                      <Ionicons
                        name={cabin.icon}
                        size={23}
                        color={cabin.color}
                      />
                    </View>

                    <View className="flex-1">
                      <Text
                        className="text-[14px] font-extrabold"
                        style={{ color: C.navy }}
                      >
                        {cabin.role}
                      </Text>

                      <Text
                        className="mt-1 text-[11px]"
                        style={{ color: C.muted }}
                      >
                        {cabin.name}
                      </Text>

                      <Text
                        className="mt-1 text-[10px]"
                        style={{ color: C.muted }}
                      >
                        {cabin.room}
                      </Text>
                    </View>

                    <View
                      className="h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#F5F6FA" }}
                    >
                      <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={C.muted}
                      />
                    </View>
                  </Pressable>

                  {expanded && (
                    <View className="px-4 pb-4">
                      <View
                        className="mb-3 h-px"
                        style={{ backgroundColor: C.border }}
                      />

                      <Text
                        className="text-[11px] leading-5"
                        style={{ color: C.muted }}
                      >
                        {cabin.description}
                      </Text>

                      <View
                        className="mt-4 rounded-[16px] p-3.5"
                        style={{ backgroundColor: C.bg }}
                      >
                        <View className="flex-row items-center">
                          <View
                            className="h-9 w-9 items-center justify-center rounded-xl"
                            style={{ backgroundColor: cabin.tint }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={18}
                              color={cabin.color}
                            />
                          </View>

                          <View className="ml-3 flex-1">
                            <Text
                              className="text-[11px] font-extrabold"
                              style={{ color: C.navy }}
                            >
                              {cabin.hours}
                            </Text>

                            <Text
                              className="mt-1 text-[10px]"
                              style={{ color: C.muted }}
                            >
                              {cabin.days}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <Text
                        className="mb-2.5 mt-4 text-[12px] font-extrabold"
                        style={{ color: C.navy }}
                      >
                        You can visit for
                      </Text>

                      <View className="flex-row flex-wrap gap-2">
                        {cabin.topics.map((topic) => (
                          <View
                            key={topic}
                            className="rounded-xl px-3 py-2"
                            style={{ backgroundColor: cabin.tint }}
                          >
                            <Text
                              className="text-[10px] font-bold"
                              style={{ color: cabin.color }}
                            >
                              {topic}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <Pressable
                        onPress={() => openAppointment(cabin.role)}
                        className="mt-4 flex-row items-center justify-center rounded-[15px] py-3.5"
                        style={{ backgroundColor: C.navy }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={17}
                          color={C.white}
                        />
                        <Text className="ml-2 text-[11px] font-extrabold text-white">
                          Request an appointment
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <Text
            className="mt-3 text-[9px] leading-4"
            style={{ color: C.muted }}
          >
            Office details shown are sample information. Confirm actual
            timings with your college.
          </Text>
        </View>

        {/* CAMPUS UPDATES */}

        <View className="mt-8 px-5">
          <SectionTitle
            title="Campus updates"
            subtitle="What's happening around your campus"
            action="View all"
            onAction={() => navigate("/student/notifications")}
          />

          <Pressable
            onPress={() => navigate("/student/events")}
            className="overflow-hidden rounded-[23px]"
            style={{
              backgroundColor: C.white,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <LinearGradient
              colors={["#F0ECFF", "#F8F7FF", "#EEF3FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
              }}
            >
              <View
                className="mr-3.5 h-[52px] w-[52px] items-center justify-center rounded-[17px]"
                style={{
                  backgroundColor: C.white,
                  borderWidth: 1,
                  borderColor: "#FFFFFF",
                }}
              >
                <Ionicons
                  name="megaphone-outline"
                  size={24}
                  color={C.purple}
                />
              </View>

              <View className="flex-1">
                <Text
                  className="text-[9px] font-extrabold tracking-wider"
                  style={{ color: C.purple }}
                >
                  CAMPUS EVENT
                </Text>

                <Text
                  className="mt-1.5 text-[14px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  TechFest 2026
                </Text>

                <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                  Events, workshops and announcements
                </Text>
              </View>

              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: C.white }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={C.muted}
                />
              </View>
            </LinearGradient>
          </Pressable>
        </View>

        {/* FOOTER */}

        <View className="items-center px-5 pt-9">
          <View
            className="mb-5 h-px w-full"
            style={{ backgroundColor: C.border }}
          />

          <LinearGradient
            colors={["#263653", "#536B9A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-[19px] font-extrabold text-white">C</Text>
          </LinearGradient>

          <Text
            className="mt-3 text-[10px] font-extrabold tracking-[2px]"
            style={{ color: C.navy }}
          >
            CAMPUSOS
          </Text>

          <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
            Your campus, connected.
          </Text>

          <Text className="mt-1.5 text-[9px]" style={{ color: "#B0B7C5" }}>
            Student Portal
          </Text>
        </View>
      </ScrollView>

      {/* APPOINTMENT MODAL */}

    
<Modal
  visible={appointmentModal}
  transparent
  animationType="slide"
  statusBarTranslucent
  onRequestClose={() => setAppointmentModal(false)}
>
  <View
    className="flex-1 justify-end"
    style={{ backgroundColor: "rgba(15,25,48,0.60)" }}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 justify-end"
    >
      <View
        className="overflow-hidden rounded-t-[30px]"
        style={{
          backgroundColor: C.white,
          maxHeight: "94%",
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top indicator */}
          <View className="items-center pt-3">
            <View
              className="h-1 w-11 rounded-full"
              style={{ backgroundColor: C.border }}
            />
          </View>

          {/* Header */}
          <View className="px-5 pb-5 pt-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-[10px] font-extrabold tracking-[2px]"
                  style={{ color: C.blue }}
                >
                  STUDENT SERVICES
                </Text>
                <Text
                  className="mt-1 text-[23px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Appointment booking
                </Text>
                <Text
                  className="mt-1 text-[11px]"
                  style={{ color: C.muted }}
                >
                  Connect with your college authorities.
                </Text>
              </View>

              <Pressable
                onPress={() => setAppointmentModal(false)}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>
          </View>

          {/* Staff profile */}
          <View className="mx-5 mb-5">
            <View
              className="overflow-hidden rounded-[22px]"
              style={{
                backgroundColor: "#F0F3FF",
                borderWidth: 1,
                borderColor: "#E1E7FF",
              }}
            >
              <View className="flex-row items-center p-4">
                <View
                  className="h-[58px] w-[58px] items-center justify-center rounded-[19px]"
                  style={{ backgroundColor: "#DDE5FF" }}
                >
                  <Ionicons
                    name="person"
                    size={28}
                    color={C.blue}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text
                    className="text-[14px] font-extrabold"
                    style={{ color: C.navy }}
                  >
                    {selectedCabinInfo?.name || "College Authority"}
                  </Text>
                  <Text
                    className="mt-1 text-[10px]"
                    style={{ color: C.muted }}
                  >
                    {selectedCabinInfo?.role}
                  </Text>
                  <Text
                    className="mt-1 text-[10px] font-bold"
                    style={{ color: C.blue }}
                  >
                    {selectedCabinInfo?.department}
                  </Text>
                </View>

                <View
                  className="rounded-full px-2.5 py-1.5"
                  style={{ backgroundColor: "#E4F6EC" }}
                >
                  <Text
                    className="text-[9px] font-extrabold"
                    style={{ color: "#21966F" }}
                  >
                    SELECTED
                  </Text>
                </View>
              </View>

              <View
                className="flex-row flex-wrap border-t px-4 py-3"
                style={{ borderColor: "#DDE5FF" }}
              >
                <View className="w-1/2 flex-row items-center py-1">
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={C.blue}
                  />
                  <Text
                    className="ml-2 text-[10px]"
                    style={{ color: C.navy }}
                  >
                    Main Campus
                  </Text>
                </View>

                <View className="w-1/2 flex-row items-center py-1">
                  <Ionicons
                    name="business-outline"
                    size={14}
                    color={C.blue}
                  />
                  <Text
                    className="ml-2 text-[10px]"
                    style={{ color: C.navy }}
                  >
                    Staff Cabin
                  </Text>
                </View>

                <View className="w-1/2 flex-row items-center py-1">
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={C.blue}
                  />
                  <Text
                    className="ml-2 text-[10px]"
                    style={{ color: C.navy }}
                  >
                    Office hours
                  </Text>
                </View>

                <View className="w-1/2 flex-row items-center py-1">
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={C.blue}
                  />
                  <Text
                    className="ml-2 text-[10px]"
                    style={{ color: C.navy }}
                  >
                    By appointment
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="px-5 pb-7">

            {/* Appointment information */}
            <View className="mb-5">
              <Text
                className="mb-1 text-[15px] font-extrabold"
                style={{ color: C.navy }}
              >
                Appointment details
              </Text>
              <Text
                className="text-[10px]"
                style={{ color: C.muted }}
              >
                Tell us what kind of assistance you need.
              </Text>
            </View>

            {/* Appointment purpose */}
            <View className="mb-5">
              <Text
                className="mb-3 text-[12px] font-extrabold"
                style={{ color: C.navy }}
              >
                Purpose of appointment *
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {[
                  "Academic guidance",
                  "Fee enquiry",
                  "Personal concern",
                  "Document request",
                  "Attendance issue",
                  "Other",
                ].map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setAppointmentNote(item + ": ");
                      setModalError("");
                    }}
                    className="rounded-xl px-3 py-3"
                    style={{
                      backgroundColor: appointmentNote.startsWith(item)
                        ? C.paleBlue
                        : C.bg,
                      borderWidth: 1,
                      borderColor: appointmentNote.startsWith(item)
                        ? C.blue
                        : C.border,
                    }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{
                        color: appointmentNote.startsWith(item)
                          ? C.blue
                          : C.navy,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Meeting type */}
            <View className="mb-5">
              <Text
                className="mb-3 text-[12px] font-extrabold"
                style={{ color: C.navy }}
              >
                Meeting preference
              </Text>

              <View className="flex-row gap-3">
                <View
                  className="flex-1 flex-row items-center rounded-2xl p-3"
                  style={{
                    backgroundColor: C.paleBlue,
                    borderWidth: 1,
                    borderColor: C.blue,
                  }}
                >
                  <Ionicons
                    name="business-outline"
                    size={19}
                    color={C.blue}
                  />
                  <View className="ml-2 flex-1">
                    <Text
                      className="text-[11px] font-extrabold"
                      style={{ color: C.navy }}
                    >
                      In-person
                    </Text>
                    <Text
                      className="mt-1 text-[9px]"
                      style={{ color: C.muted }}
                    >
                      Visit staff cabin
                    </Text>
                  </View>
                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color={C.blue}
                  />
                </View>

                <View
                  className="flex-1 flex-row items-center rounded-2xl p-3"
                  style={{
                    backgroundColor: C.bg,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  <Ionicons
                    name="videocam-outline"
                    size={19}
                    color={C.muted}
                  />
                  <View className="ml-2 flex-1">
                    <Text
                      className="text-[11px] font-extrabold"
                      style={{ color: C.navy }}
                    >
                      Online
                    </Text>
                    <Text
                      className="mt-1 text-[9px]"
                      style={{ color: C.muted }}
                    >
                      Virtual meeting
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Date */}
            <View className="mb-5">
              <Text
                className="mb-2.5 text-[12px] font-extrabold"
                style={{ color: C.navy }}
              >
                Preferred appointment date *
              </Text>

              <View
                className="flex-row items-center rounded-2xl px-4"
                style={{
                  height: 54,
                  backgroundColor: C.bg,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Ionicons
                  name="calendar"
                  size={19}
                  color={C.blue}
                />

                <TextInput
                  value={appointmentDate}
                  onChangeText={(value) => {
                    setAppointmentDate(value);
                    setModalError("");
                  }}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={C.muted}
                  className="ml-3 flex-1 text-[12px] font-semibold"
                  style={{ color: C.navy }}
                />
              </View>

              <Text
                className="mt-2 text-[9px]"
                style={{ color: C.muted }}
              >
                Choose a working day based on the staff&apos;s availability.
              </Text>
            </View>

            {/* Time */}
            <View className="mb-5">
              <View className="mb-3 flex-row items-center justify-between">
                <Text
                  className="text-[12px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Available time slots *
                </Text>
                <Text
                  className="text-[9px]"
                  style={{ color: C.muted }}
                >
                  Select preferred time
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {[
                  "09:00 AM",
                  "10:00 AM",
                  "11:00 AM",
                  "12:00 PM",
                  "02:00 PM",
                  "03:00 PM",
                  "04:00 PM",
                ].map((time) => {
                  const active = appointmentTime === time;

                  return (
                    <Pressable
                      key={time}
                      onPress={() => {
                        setAppointmentTime(time);
                        setModalError("");
                      }}
                      className="w-[23%] items-center rounded-xl py-3"
                      style={{
                        backgroundColor: active ? C.blue : C.bg,
                        borderWidth: 1,
                        borderColor: active ? C.blue : C.border,
                      }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{
                          color: active ? C.white : C.navy,
                        }}
                      >
                        {time}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Duration */}
            <View className="mb-5">
              <Text
                className="mb-3 text-[12px] font-extrabold"
                style={{ color: C.navy }}
              >
                Expected meeting duration
              </Text>

              <View
                className="flex-row items-center justify-between rounded-2xl p-4"
                style={{
                  backgroundColor: C.bg,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="hourglass-outline"
                    size={19}
                    color={C.blue}
                  />
                  <View className="ml-3">
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: C.navy }}
                    >
                      Standard consultation
                    </Text>
                    <Text
                      className="mt-1 text-[9px]"
                      style={{ color: C.muted }}
                    >
                      Estimated meeting time
                    </Text>
                  </View>
                </View>

                <Text
                  className="text-[12px] font-extrabold"
                  style={{ color: C.blue }}
                >
                  15–30 min
                </Text>
              </View>
            </View>

            {/* Reason / message */}
            <View className="mb-5">
              <Text
                className="mb-2 text-[12px] font-extrabold"
                style={{ color: C.navy }}
              >
                Additional information *
              </Text>

              <TextInput
                value={appointmentNote}
                onChangeText={(value) => {
                  setAppointmentNote(value);
                  setModalError("");
                }}
                placeholder="Describe your concern, questions or any documents you want to discuss..."
                placeholderTextColor={C.muted}
                multiline
                maxLength={300}
                textAlignVertical="top"
                className="rounded-2xl px-4 py-3.5 text-[12px]"
                style={{
                  minHeight: 110,
                  backgroundColor: C.bg,
                  borderWidth: 1,
                  borderColor: C.border,
                  color: C.navy,
                }}
              />

              <Text
                className="mt-1 text-right text-[9px]"
                style={{ color: C.muted }}
              >
                {appointmentNote.length}/300
              </Text>
            </View>

            {/* Before appointment */}
            <View
              className="mb-5 rounded-2xl p-4"
              style={{
                backgroundColor: "#FFF7EA",
                borderWidth: 1,
                borderColor: "#F5E6C9",
              }}
            >
              <View className="mb-2 flex-row items-center">
                <Ionicons
                  name="alert-circle-outline"
                  size={17}
                  color="#C78B32"
                />
                <Text
                  className="ml-2 text-[11px] font-extrabold"
                  style={{ color: "#9A681E" }}
                >
                  Before your appointment
                </Text>
              </View>

              {[
                "Arrive 5–10 minutes before your scheduled time.",
                "Carry your student ID card.",
                "Bring relevant documents if required.",
                "Wait for appointment confirmation before visiting.",
              ].map((item, index) => (
                <View
                  key={index}
                  className="mb-2 flex-row items-start"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={14}
                    color="#B78335"
                  />
                  <Text
                    className="ml-2 flex-1 text-[10px] leading-4"
                    style={{ color: "#795B30" }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            {/* Appointment policy */}
            <View
              className="mb-5 flex-row items-start rounded-2xl p-3.5"
              style={{ backgroundColor: C.paleBlue }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={C.blue}
              />
              <View className="ml-2 flex-1">
                <Text
                  className="text-[10px] font-extrabold"
                  style={{ color: C.navy }}
                >
                  Appointment request policy
                </Text>
                <Text
                  className="mt-1 text-[9px] leading-4"
                  style={{ color: C.muted }}
                >
                  Submitting a request does not guarantee a confirmed
                  appointment. The concerned authority will review your
                  preferred schedule and provide confirmation or an
                  alternative time.
                </Text>
              </View>
            </View>

            {/* Error */}
            {modalError ? (
              <View
                className="mb-4 flex-row items-center rounded-xl p-3"
                style={{ backgroundColor: "#FFF0F0" }}
              >
                <Ionicons
                  name="alert-circle"
                  size={17}
                  color={C.red}
                />
                <Text
                  className="ml-2 flex-1 text-[10px]"
                  style={{ color: C.red }}
                >
                  {modalError}
                </Text>
              </View>
            ) : null}

            {/* Submit */}
            <Pressable
              onPress={submitAppointment}
              className="overflow-hidden rounded-2xl"
              style={{
                shadowColor: C.blue,
                shadowOpacity: 0.2,
                shadowRadius: 9,
                elevation: 3,
              }}
            >
              <LinearGradient
                colors={["#7185F0", "#5368D5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 16,
                }}
              >
                <Ionicons
                  name="send-outline"
                  size={17}
                  color="#FFFFFF"
                />
                <Text className="ml-2 text-[12px] font-extrabold text-white">
                  Submit appointment request
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => setAppointmentModal(false)}
              className="mt-3 items-center py-3"
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: C.muted }}
              >
                Cancel request
              </Text>
            </Pressable>

            <Text
              className="mb-2 text-center text-[9px]"
              style={{ color: C.muted }}
            >
              CampusOS • Student appointment management
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </View>
</Modal>

    </SafeAreaView>
  );
}
