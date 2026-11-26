
import React, { useMemo, useState } from "react";
import {
  Modal,
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

type Subject = {
  id: string;
  name: string;
  code: string;
  faculty: string;
  credits: number;
  attendance: number;
  present: number;
  absent: number;
  partial: number;
  total: number;
  internal: number;
  maxInternal: number;
  completed: boolean;
  color: string;
  tint: string;
  courseType: string;
  schedule: string;
  room: string;
  syllabusProgress: number;
  assignmentsCompleted: number;
  assignmentsTotal: number;
  nextClass: string;
  nextTopic: string;
  testOne: number;
  testTwo: number;
  assignmentMarks: number;
  maxAssignmentMarks: number;
};

const SUBJECTS: Subject[] = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS501",
    faculty: "Dr. Priya Sharma",
    credits: 4,
    attendance: 92,
    present: 46,
    absent: 3,
    partial: 1,
    total: 50,
    internal: 42,
    maxInternal: 50,
    completed: false,
    color: "#6478E8",
    tint: "#EEF3FF",
    courseType: "Core subject",
    schedule: "Monday · 10:30 AM",
    room: "Block B · Room 204",
    syllabusProgress: 78,
    assignmentsCompleted: 5,
    assignmentsTotal: 6,
    nextClass: "Tomorrow · 10:30 AM",
    nextTopic: "Trees and Binary Search Trees",
    testOne: 20,
    testTwo: 17,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
  {
    id: "2",
    name: "Database Management Systems",
    code: "CS502",
    faculty: "Prof. Arun Kumar",
    credits: 4,
    attendance: 84,
    present: 42,
    absent: 7,
    partial: 1,
    total: 50,
    internal: 38,
    maxInternal: 50,
    completed: false,
    color: "#269B78",
    tint: "#EAF8F1",
    courseType: "Core subject",
    schedule: "Tuesday · 11:30 AM",
    room: "Block A · Room 102",
    syllabusProgress: 65,
    assignmentsCompleted: 4,
    assignmentsTotal: 6,
    nextClass: "Tuesday · 11:30 AM",
    nextTopic: "Database Normalization",
    testOne: 18,
    testTwo: 15,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
  {
    id: "3",
    name: "Operating Systems",
    code: "CS503",
    faculty: "Dr. Meena Raj",
    credits: 3,
    attendance: 72,
    present: 36,
    absent: 13,
    partial: 1,
    total: 50,
    internal: 34,
    maxInternal: 50,
    completed: false,
    color: "#D99035",
    tint: "#FFF5E8",
    courseType: "Core subject",
    schedule: "Wednesday · 09:30 AM",
    room: "Block C · Room 305",
    syllabusProgress: 58,
    assignmentsCompleted: 3,
    assignmentsTotal: 6,
    nextClass: "Wednesday · 09:30 AM",
    nextTopic: "Process Scheduling",
    testOne: 16,
    testTwo: 13,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
  {
    id: "4",
    name: "Computer Networks",
    code: "CS504",
    faculty: "Prof. Karthik S",
    credits: 3,
    attendance: 88,
    present: 44,
    absent: 5,
    partial: 1,
    total: 50,
    internal: 45,
    maxInternal: 50,
    completed: false,
    color: "#9277D6",
    tint: "#F3EFFF",
    courseType: "Core subject",
    schedule: "Thursday · 01:30 PM",
    room: "Block B · Room 210",
    syllabusProgress: 82,
    assignmentsCompleted: 5,
    assignmentsTotal: 6,
    nextClass: "Thursday · 01:30 PM",
    nextTopic: "Network Layer and Routing",
    testOne: 22,
    testTwo: 18,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
  {
    id: "5",
    name: "Software Engineering",
    code: "CS505",
    faculty: "Dr. Anitha R",
    credits: 3,
    attendance: 96,
    present: 48,
    absent: 1,
    partial: 1,
    total: 50,
    internal: 46,
    maxInternal: 50,
    completed: false,
    color: "#D46D87",
    tint: "#FFF0F4",
    courseType: "Core subject",
    schedule: "Friday · 10:30 AM",
    room: "Block A · Room 205",
    syllabusProgress: 90,
    assignmentsCompleted: 6,
    assignmentsTotal: 6,
    nextClass: "Friday · 10:30 AM",
    nextTopic: "Software Testing",
    testOne: 23,
    testTwo: 18,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
  {
    id: "6",
    name: "Professional Communication",
    code: "HS506",
    faculty: "Prof. Divya",
    credits: 2,
    attendance: 100,
    present: 40,
    absent: 0,
    partial: 0,
    total: 40,
    internal: 48,
    maxInternal: 50,
    completed: true,
    color: "#269B78",
    tint: "#EAF8F1",
    courseType: "Elective",
    schedule: "Friday · 02:30 PM",
    room: "Block D · Room 110",
    syllabusProgress: 100,
    assignmentsCompleted: 5,
    assignmentsTotal: 5,
    nextClass: "Course completed",
    nextTopic: "All topics completed",
    testOne: 24,
    testTwo: 19,
    assignmentMarks: 5,
    maxAssignmentMarks: 10,
  },
];

const FILTERS = ["All", "Ongoing", "Completed"] as const;

const COLORS = {
  navy: "#202B49",
  blue: "#6478E8",
  muted: "#8992A6",
  border: "#E4E9F2",
  background: "#F7F8FC",
  lavender: "#9277D6",
  green: "#269B78",
  orange: "#D99035",
  red: "#D96672",
};

export default function MySubjectsScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]>("All");
  const [selectedSubject, setSelectedSubject] =
    useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    return SUBJECTS.filter((subject) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Ongoing" && !subject.completed) ||
        (filter === "Completed" && subject.completed);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const averageAttendance = Math.round(
    SUBJECTS.reduce((sum, item) => sum + item.attendance, 0) /
      SUBJECTS.length
  );

  const averageInternal = Math.round(
    SUBJECTS.reduce(
      (sum, item) =>
        sum + (item.internal / item.maxInternal) * 100,
      0
    ) / SUBJECTS.length
  );

  const totalCredits = SUBJECTS.reduce(
    (sum, item) => sum + item.credits,
    0
  );

  const lowAttendanceCount = SUBJECTS.filter(
    (item) => !item.completed && item.attendance < 75
  ).length;

  const completedAssignments = SUBJECTS.reduce(
    (sum, item) => sum + item.assignmentsCompleted,
    0
  );

  const totalAssignments = SUBJECTS.reduce(
    (sum, item) => sum + item.assignmentsTotal,
    0
  );

  const getAttendanceColor = (value: number) => {
    if (value >= 85) return COLORS.green;
    if (value >= 75) return COLORS.orange;
    return COLORS.red;
  };

  const getAttendanceGradient = (
    value: number
  ): [string, string] => {
    if (value >= 85) return ["#269B78", "#55C69D"];
    if (value >= 75) return ["#D99035", "#F2BD69"];
    return ["#D96672", "#F29AA3"];
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/student");
    }
  };

  const renderProgress = (
    value: number,
    colors: [string, string]
  ) => (
    <View className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8EBF2]">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          borderRadius: 20,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <StatusBar barStyle="dark-content"  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* HEADER */}
        <View className="px-5 pt-3">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={handleBack}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF4] bg-white"
            >
              <Ionicons name="arrow-back" size={21} color={COLORS.navy} />
            </Pressable>

            <View className="flex-1 px-3">
              <Text className="text-[10px] font-extrabold tracking-[1.5px] text-[#6478A8]">
                CAMPUSOS
              </Text>
              <Text className="mt-1 text-[20px] font-extrabold text-[#202B49]">
                My Subjects
              </Text>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E4E9FA] bg-[#EEF3FF]">
              <Ionicons
                name="book-outline"
                size={21}
                color={COLORS.blue}
              />
            </View>
          </View>

          <Text className="mt-4 text-[12px] leading-5 text-[#8992A6]">
            Your semester at a glance. Track subjects, attendance,
            internal marks and learning progress.
          </Text>
        </View>

        {/* SEMESTER OVERVIEW */}
        <View className="mt-5 px-5">
          <LinearGradient
            colors={["#EEF3FF", "#F4F0FF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 26,
              borderWidth: 1,
              borderColor: "#E4E9FA",
              padding: 20,
              overflow: "hidden",
            }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] font-extrabold tracking-[1.5px] text-[#6478A8]">
                  CURRENT SEMESTER
                </Text>
                <Text className="mt-2 text-[26px] font-extrabold text-[#202B49]">
                  Semester 5
                </Text>
                <Text className="mt-1 text-[11px] text-[#8992A6]">
                  B.Tech · Computer Science
                </Text>
              </View>

              <View className="h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/80">
                <Ionicons
                  name="school-outline"
                  size={25}
                  color={COLORS.blue}
                />
              </View>
            </View>

            <View className="mt-5 flex-row gap-2">
              {[
                {
                  label: "Subjects",
                  value: SUBJECTS.length.toString(),
                  icon: "book-outline" as const,
                },
                {
                  label: "Attendance",
                  value: `${averageAttendance}%`,
                  icon: "calendar-outline" as const,
                },
                {
                  label: "Credits",
                  value: totalCredits.toString(),
                  icon: "ribbon-outline" as const,
                },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-1 rounded-2xl border border-white bg-white/75 p-3"
                >
                  <Ionicons
                    name={item.icon}
                    size={17}
                    color={COLORS.blue}
                  />
                  <Text className="mt-2 text-[20px] font-extrabold text-[#202B49]">
                    {item.value}
                  </Text>
                  <Text className="mt-1 text-[9px] font-semibold text-[#8992A6]">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-4 flex-row items-center justify-between border-t border-[#DDE4F5] pt-4">
              <View className="flex-row items-center">
                <Ionicons
                  name="clipboard-outline"
                  size={15}
                  color={COLORS.blue}
                />
                <Text className="ml-2 text-[10px] font-semibold text-[#64718D]">
                  Assignment completion
                </Text>
              </View>

              <Text className="text-[11px] font-extrabold text-[#465A9B]">
                {completedAssignments}/{totalAssignments}
              </Text>
            </View>

            <View className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DFE5F5]">
              <LinearGradient
                colors={["#6478E8", "#9277D6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${
                    totalAssignments
                      ? (completedAssignments / totalAssignments) * 100
                      : 0
                  }%`,
                  height: "100%",
                  borderRadius: 20,
                }}
              />
            </View>
          </LinearGradient>
        </View>

        {/* ATTENDANCE ALERT */}
        {lowAttendanceCount > 0 && (
          <View className="mt-4 px-5">
            <View className="flex-row items-center rounded-2xl border border-[#F4D9D9] bg-[#FFF5F5] p-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFE7E9]">
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color={COLORS.red}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-[11px] font-extrabold text-[#B94C59]">
                  Attendance needs attention
                </Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#A96B72]">
                  {lowAttendanceCount} subject(s) currently have attendance
                  below 75%.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ACADEMIC PERFORMANCE */}
        <View className="mt-6 px-5">
          <Text className="text-[16px] font-extrabold text-[#202B49]">
            Academic performance
          </Text>
          <Text className="mt-1 text-[10px] text-[#8992A6]">
            Your overall semester progress
          </Text>

          <View className="mt-3 flex-row gap-3">
            <View className="flex-1 rounded-[19px] border border-[#E9EDF4] bg-white p-4">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF3FF]">
                <Ionicons
                  name="trending-up-outline"
                  size={18}
                  color={COLORS.blue}
                />
              </View>
              <Text className="mt-3 text-[10px] font-semibold text-[#8992A6]">
                Internal average
              </Text>
              <Text className="mt-1 text-[23px] font-extrabold text-[#202B49]">
                {averageInternal}%
              </Text>
            </View>

            <View className="flex-1 rounded-[19px] border border-[#E9EDF4] bg-white p-4">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F4F0FF]">
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={COLORS.lavender}
                />
              </View>
              <Text className="mt-3 text-[10px] font-semibold text-[#8992A6]">
                Assignments done
              </Text>
              <Text className="mt-1 text-[23px] font-extrabold text-[#202B49]">
                {totalAssignments
                  ? Math.round(
                      (completedAssignments / totalAssignments) * 100
                    )
                  : 0}
                %
              </Text>
            </View>
          </View>
        </View>

        {/* SEARCH */}
        <View className="mt-6 px-5">
          <View className="flex-row items-center rounded-2xl border border-[#E9EDF4] bg-white px-4">
            <Ionicons
              name="search-outline"
              size={19}
              color="#8992A6"
            />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search subject, code or faculty..."
              placeholderTextColor="#A1A8B7"
              className="h-12 flex-1 px-3 text-[12px] text-[#202B49]"
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={19}
                  color="#8992A6"
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* FILTERS */}
        <View className="mt-5 px-5">
          <View className="flex-row items-center gap-2">
            {FILTERS.map((item) => {
              const active = filter === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  className="rounded-xl px-4 py-2.5"
                  style={{
                    backgroundColor: active ? "#6478E8" : "#FFFFFF",
                    borderWidth: active ? 0 : 1,
                    borderColor: "#E9EDF4",
                  }}
                >
                  <Text
                    className="text-[11px] font-bold"
                    style={{
                      color: active ? "#FFFFFF" : "#8992A6",
                    }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}

            <View className="flex-1" />

            <Text className="text-[10px] font-semibold text-[#8992A6]">
              {filteredSubjects.length} subjects
            </Text>
          </View>
        </View>

        {/* SUBJECT LIST */}
        <View className="mt-5 px-5">
          <View className="mb-3">
            <Text className="text-[16px] font-extrabold text-[#202B49]">
              Your subjects
            </Text>
            <Text className="mt-1 text-[10px] text-[#8992A6]">
              Tap a subject for complete details
            </Text>
          </View>

          {filteredSubjects.length === 0 ? (
            <View className="items-center rounded-[22px] border border-[#E9EDF4] bg-white px-5 py-10">
              <Ionicons
                name="search-outline"
                size={30}
                color="#A1A8B7"
              />
              <Text className="mt-3 text-[14px] font-bold text-[#202B49]">
                No subjects found
              </Text>
              <Text className="mt-1 text-center text-[11px] text-[#8992A6]">
                Try another subject name or change the filter.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredSubjects.map((subject) => (
                <Pressable
                  key={subject.id}
                  onPress={() => setSelectedSubject(subject)}
                  className="rounded-[22px] border border-[#E5EAF5] bg-white p-4"
                >
                  {/* SUBJECT HEADER */}
                  <View className="flex-row items-start">
                    <LinearGradient
                      colors={[subject.color, subject.tint]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name="book-outline"
                        size={21}
                        color="white"
                      />
                    </LinearGradient>

                    <View className="flex-1">
                      <Text className="text-[13px] font-extrabold leading-5 text-[#202B49]">
                        {subject.name}
                      </Text>
                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        {subject.code} · {subject.credits} credits
                      </Text>
                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        {subject.faculty}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text
                        className="text-[13px] font-extrabold"
                        style={{
                          color: getAttendanceColor(subject.attendance),
                        }}
                      >
                        {subject.attendance}%
                      </Text>
                      <Text className="mt-1 text-[9px] text-[#8992A6]">
                        Attendance
                      </Text>
                    </View>
                  </View>

                  {/* ATTENDANCE */}
                  <View className="mt-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[10px] font-semibold text-[#8992A6]">
                        Attendance progress
                      </Text>
                      <Text
                        className="text-[10px] font-bold"
                        style={{
                          color: getAttendanceColor(subject.attendance),
                        }}
                      >
                        {subject.present}/{subject.total} present
                      </Text>
                    </View>

                    {renderProgress(
                      subject.attendance,
                      getAttendanceGradient(subject.attendance)
                    )}

                    {subject.attendance < 75 && (
                      <View className="mt-2 flex-row items-center">
                        <Ionicons
                          name="alert-circle"
                          size={13}
                          color={COLORS.red}
                        />
                        <Text className="ml-1 text-[9px] font-bold text-[#D96672]">
                          Below 75% attendance
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* SUBJECT STATISTICS */}
                  <View className="mt-4 flex-row border-t border-[#F0F1F5] pt-3">
                    <View className="flex-1">
                      <Text className="text-[9px] font-semibold text-[#8992A6]">
                        Internal marks
                      </Text>
                      <Text className="mt-1 text-[14px] font-extrabold text-[#202B49]">
                        {subject.internal}/{subject.maxInternal}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] font-semibold text-[#8992A6]">
                        Syllabus
                      </Text>
                      <Text className="mt-1 text-[14px] font-extrabold text-[#202B49]">
                        {subject.syllabusProgress}%
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] font-semibold text-[#8992A6]">
                        Assignments
                      </Text>
                      <Text className="mt-1 text-[14px] font-extrabold text-[#202B49]">
                        {subject.assignmentsCompleted}/
                        {subject.assignmentsTotal}
                      </Text>
                    </View>
                  </View>

                  {/* SYLLABUS PROGRESS */}
                  <View className="mt-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[9px] text-[#8992A6]">
                        Syllabus completion
                      </Text>
                      <Text className="text-[9px] font-bold text-[#6478E8]">
                        {subject.syllabusProgress}%
                      </Text>
                    </View>

                    {renderProgress(
                      subject.syllabusProgress,
                      ["#6478E8", "#A18CEB"]
                    )}
                  </View>

                  {/* CARD FOOTER */}
                  <View className="mt-3 flex-row items-center justify-between border-t border-[#F0F1F5] pt-3">
                    <View className="flex-row items-center flex-1">
                      <Ionicons
                        name="time-outline"
                        size={13}
                        color="#8992A6"
                      />
                      <Text className="ml-1.5 text-[9px] text-[#8992A6]">
                        {subject.schedule}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="text-[10px] font-bold text-[#6478E8]">
                        Details
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color="#6478E8"
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* SUBJECT DETAILS MODAL */}
      <Modal
        visible={!!selectedSubject}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSubject(null)}
      >
        <View className="flex-1 justify-end bg-black/35">
          <Pressable
            className="flex-1"
            onPress={() => setSelectedSubject(null)}
          />

          {selectedSubject && (
            <View className="max-h-[88%] rounded-t-[30px] bg-white">
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 20,
                  paddingBottom: 32,
                }}
              >
                <View className="mb-5 h-1 w-10 self-center rounded-full bg-[#E1E5ED]" />

                {/* MODAL HEADER */}
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-[10px] font-extrabold tracking-[1px] text-[#6478A8]">
                      SUBJECT DETAILS
                    </Text>
                    <Text className="mt-2 text-[20px] font-extrabold text-[#202B49]">
                      {selectedSubject.name}
                    </Text>
                    <Text className="mt-1 text-[11px] text-[#8992A6]">
                      {selectedSubject.code} · {selectedSubject.courseType}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setSelectedSubject(null)}
                    className="h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF]"
                  >
                    <Ionicons
                      name="close"
                      size={21}
                      color={COLORS.navy}
                    />
                  </Pressable>
                </View>

                {/* FACULTY INFORMATION */}
                <LinearGradient
                  colors={["#EEF3FF", "#F4F0FF", "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    marginTop: 18,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#E4E9FA",
                    padding: 16,
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                      <Ionicons
                        name="person-outline"
                        size={19}
                        color={COLORS.blue}
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[9px] font-semibold text-[#8992A6]">
                        FACULTY
                      </Text>
                      <Text className="mt-1 text-[12px] font-bold text-[#202B49]">
                        {selectedSubject.faculty}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row">
                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Credits
                      </Text>
                      <Text className="mt-1 text-[14px] font-extrabold text-[#202B49]">
                        {selectedSubject.credits}
                      </Text>
                    </View>

                    <View className="flex-1">
                      <Text className="text-[9px] text-[#8992A6]">
                        Class schedule
                      </Text>
                      <Text className="mt-1 text-[11px] font-bold text-[#202B49]">
                        {selectedSubject.schedule}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row items-center">
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color="#8992A6"
                    />
                    <Text className="ml-2 text-[10px] text-[#8992A6]">
                      {selectedSubject.room}
                    </Text>
                  </View>
                </LinearGradient>

                {/* ATTENDANCE DETAILS */}
                <View className="mt-5">
                  <Text className="text-[14px] font-extrabold text-[#202B49]">
                    Attendance details
                  </Text>

                  <View className="mt-3 rounded-2xl border border-[#E4E9F2] bg-white p-4">
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-[10px] text-[#8992A6]">
                          Attendance percentage
                        </Text>
                        <Text
                          className="mt-1 text-[27px] font-extrabold"
                          style={{
                            color: getAttendanceColor(
                              selectedSubject.attendance
                            ),
                          }}
                        >
                          {selectedSubject.attendance}%
                        </Text>
                      </View>

                      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF]">
                        <Ionicons
                          name="calendar-outline"
                          size={23}
                          color={COLORS.blue}
                        />
                      </View>
                    </View>

                    {renderProgress(
                      selectedSubject.attendance,
                      getAttendanceGradient(selectedSubject.attendance)
                    )}

                    <View className="mt-4 flex-row">
                      {[
                        {
                          label: "Present",
                          value: selectedSubject.present,
                          color: "#269B78",
                          bg: "#EAF8F1",
                        },
                        {
                          label: "Absent",
                          value: selectedSubject.absent,
                          color: "#D96672",
                          bg: "#FFF0F1",
                        },
                        {
                          label: "Partial",
                          value: selectedSubject.partial,
                          color: "#D99035",
                          bg: "#FFF5E8",
                        },
                      ].map((item) => (
                        <View
                          key={item.label}
                          className="mr-2 flex-1 rounded-xl p-3"
                          style={{ backgroundColor: item.bg }}
                        >
                          <Text
                            className="text-[9px] font-semibold"
                            style={{ color: item.color }}
                          >
                            {item.label}
                          </Text>
                          <Text
                            className="mt-1 text-[19px] font-extrabold"
                            style={{ color: item.color }}
                          >
                            {item.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>

                {/* INTERNAL ASSESSMENT */}
                <View className="mt-5">
                  <Text className="text-[14px] font-extrabold text-[#202B49]">
                    Internal assessment
                  </Text>

                  <View className="mt-3 rounded-2xl border border-[#E4E9F2] bg-white p-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[11px] font-semibold text-[#8992A6]">
                        Total internal marks
                      </Text>
                      <Text className="text-[20px] font-extrabold text-[#202B49]">
                        {selectedSubject.internal}/
                        {selectedSubject.maxInternal}
                      </Text>
                    </View>

                    {[
                      {
                        label: "Internal test 1",
                        value: selectedSubject.testOne,
                        max: 25,
                      },
                      {
                        label: "Internal test 2",
                        value: selectedSubject.testTwo,
                        max: 25,
                      },
                      {
                        label: "Assignment marks",
                        value: selectedSubject.assignmentMarks,
                        max: selectedSubject.maxAssignmentMarks,
                      },
                    ].map((item) => (
                      <View key={item.label} className="mt-4">
                        <View className="flex-row items-center justify-between">
                          <Text className="text-[10px] text-[#8992A6]">
                            {item.label}
                          </Text>
                          <Text className="text-[10px] font-bold text-[#202B49]">
                            {item.value}/{item.max}
                          </Text>
                        </View>

                        {renderProgress(
                          (item.value / item.max) * 100,
                          ["#6478E8", "#A18CEB"]
                        )}
                      </View>
                    ))}
                  </View>
                </View>

                {/* SYLLABUS PROGRESS */}
                <View className="mt-5">
                  <Text className="text-[14px] font-extrabold text-[#202B49]">
                    Syllabus progress
                  </Text>

                  <LinearGradient
                    colors={["#EEF3FF", "#F4F0FF", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      marginTop: 12,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: "#E4E9FA",
                      padding: 16,
                    }}
                  >
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-[10px] text-[#8992A6]">
                          Completed syllabus
                        </Text>
                        <Text className="mt-1 text-[23px] font-extrabold text-[#202B49]">
                          {selectedSubject.syllabusProgress}%
                        </Text>
                      </View>

                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <Ionicons
                          name="book-outline"
                          size={22}
                          color={COLORS.lavender}
                        />
                      </View>
                    </View>

                    {renderProgress(
                      selectedSubject.syllabusProgress,
                      ["#6478E8", "#A18CEB"]
                    )}
                  </LinearGradient>
                </View>

                {/* ASSIGNMENT PROGRESS */}
                <View className="mt-5">
                  <Text className="text-[14px] font-extrabold text-[#202B49]">
                    Assignment progress
                  </Text>

                  <View className="mt-3 flex-row items-center rounded-2xl border border-[#E4E9F2] bg-white p-4">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF]">
                      <Ionicons
                        name="document-text-outline"
                        size={19}
                        color={COLORS.blue}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text className="text-[11px] font-bold text-[#202B49]">
                        {selectedSubject.assignmentsCompleted} of{" "}
                        {selectedSubject.assignmentsTotal} completed
                      </Text>
                      <Text className="mt-1 text-[9px] text-[#8992A6]">
                        {selectedSubject.assignmentsTotal -
                          selectedSubject.assignmentsCompleted}{" "}
                        pending assignments
                      </Text>
                    </View>

                    <Text className="text-[15px] font-extrabold text-[#6478E8]">
                      {Math.round(
                        (selectedSubject.assignmentsCompleted /
                          selectedSubject.assignmentsTotal) *
                          100
                      )}
                      %
                    </Text>
                  </View>
                </View>

                {/* NEXT CLASS */}
                <View className="mt-5">
                  <Text className="text-[14px] font-extrabold text-[#202B49]">
                    Next class
                  </Text>

                  <LinearGradient
                    colors={["#EEF3FF", "#F4F0FF", "#FFFFFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      marginTop: 12,
                      borderRadius: 18,
                      borderWidth: 1,
                      borderColor: "#E4E9FA",
                      padding: 15,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                        <Ionicons
                          name="time-outline"
                          size={20}
                          color={COLORS.blue}
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[9px] font-bold text-[#8992A6]">
                          SCHEDULE
                        </Text>
                        <Text className="mt-1 text-[12px] font-extrabold text-[#202B49]">
                          {selectedSubject.nextClass}
                        </Text>
                      </View>
                    </View>

                    <Text className="mt-4 text-[10px] font-semibold text-[#8992A6]">
                      NEXT TOPIC
                    </Text>
                    <Text className="mt-1 text-[12px] font-bold text-[#202B49]">
                      {selectedSubject.nextTopic}
                    </Text>
                  </LinearGradient>
                </View>

                {/* CLOSE */}
                <Pressable
                  onPress={() => setSelectedSubject(null)}
                  className="mt-5 overflow-hidden rounded-2xl"
                >
                  <LinearGradient
                    colors={["#6478E8", "#9277D6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: 15,
                      borderRadius: 16,
                    }}
                  >
                    <Text className="text-[12px] font-bold text-white">
                      Close subject details
                    </Text>
                  </LinearGradient>
                </Pressable>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
