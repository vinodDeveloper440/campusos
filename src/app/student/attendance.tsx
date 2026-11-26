import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type AttendanceStatus = "present" | "absent";
type ViewMode = "week" | "month" | "year";
type DayStatus = "present" | "partial" | "absent" | "none" | "future";

type ClassRecord = {
  id: string;
  subject: string;
  code: string;
  faculty: string;
  time: string;
  room: string;
  status: AttendanceStatus;
};

const TODAY = new Date(2026, 10, 3);
const TODAY_KEY = "2026-11-03";
const ATTENDANCE_TARGET = 75;

const COLORS = {
  navy: "#202B49",
  blue: "#6478E8",
  muted: "#8992A6",
  border: "#E9EDF5",
  background: "#F7F9FD",
  green: "#259B78",
  orange: "#D99035",
  red: "#DC626B",
  paleBlue: "#EEF1FF",
  paleGreen: "#EAF8F1",
  paleOrange: "#FFF5E8",
  paleRed: "#FFF0F1",
};

const attendanceData: Record<string, ClassRecord[]> = {
  "2026-10-30": [
    {
      id: "1",
      subject: "Data Structures",
      code: "CS301",
      faculty: "Dr. Priya Sharma",
      time: "09:00 AM - 10:00 AM",
      room: "Block B · 204",
      status: "present",
    },
    {
      id: "2",
      subject: "Database Management",
      code: "CS302",
      faculty: "Prof. Arun Kumar",
      time: "10:00 AM - 11:00 AM",
      room: "Block A · 102",
      status: "present",
    },
    {
      id: "3",
      subject: "Computer Networks",
      code: "CS303",
      faculty: "Dr. Meena Raj",
      time: "11:15 AM - 12:15 PM",
      room: "Block C · 305",
      status: "absent",
    },
    {
      id: "4",
      subject: "Mathematics",
      code: "MA301",
      faculty: "Prof. Ravi",
      time: "02:00 PM - 03:00 PM",
      room: "Block A · 201",
      status: "present",
    },
  ],
  "2026-10-31": [
    {
      id: "1",
      subject: "Operating Systems",
      code: "CS304",
      faculty: "Dr. Karthik",
      time: "09:00 AM - 10:00 AM",
      room: "Block B · 206",
      status: "present",
    },
    {
      id: "2",
      subject: "Software Engineering",
      code: "CS305",
      faculty: "Prof. Nisha",
      time: "10:00 AM - 11:00 AM",
      room: "Block A · 103",
      status: "present",
    },
    {
      id: "3",
      subject: "Data Structures Lab",
      code: "CS306",
      faculty: "Dr. Priya Sharma",
      time: "11:15 AM - 01:15 PM",
      room: "Computer Lab 2",
      status: "present",
    },
  ],
  "2026-11-02": [
    {
      id: "1",
      subject: "Data Structures",
      code: "CS301",
      faculty: "Dr. Priya Sharma",
      time: "09:00 AM - 10:00 AM",
      room: "Block B · 204",
      status: "present",
    },
    {
      id: "2",
      subject: "Database Management",
      code: "CS302",
      faculty: "Prof. Arun Kumar",
      time: "10:00 AM - 11:00 AM",
      room: "Block A · 102",
      status: "absent",
    },
    {
      id: "3",
      subject: "Computer Networks",
      code: "CS303",
      faculty: "Dr. Meena Raj",
      time: "11:15 AM - 12:15 PM",
      room: "Block C · 305",
      status: "present",
    },
    {
      id: "4",
      subject: "Mathematics",
      code: "MA301",
      faculty: "Prof. Ravi",
      time: "02:00 PM - 03:00 PM",
      room: "Block A · 201",
      status: "present",
    },
  ],
  "2026-11-03": [
    {
      id: "1",
      subject: "Operating Systems",
      code: "CS304",
      faculty: "Dr. Karthik",
      time: "09:00 AM - 10:00 AM",
      room: "Block B · 206",
      status: "present",
    },
    {
      id: "2",
      subject: "Software Engineering",
      code: "CS305",
      faculty: "Prof. Nisha",
      time: "10:00 AM - 11:00 AM",
      room: "Block A · 103",
      status: "absent",
    },
    {
      id: "3",
      subject: "Data Structures Lab",
      code: "CS306",
      faculty: "Dr. Priya Sharma",
      time: "11:15 AM - 01:15 PM",
      room: "Computer Lab 2",
      status: "present",
    },
    {
      id: "4",
      subject: "Mathematics",
      code: "MA301",
      faculty: "Prof. Ravi",
      time: "02:00 PM - 03:00 PM",
      room: "Block A · 201",
      status: "present",
    },
  ],
};

const pad = (value: number) => String(value).padStart(2, "0");

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDate = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const isFutureDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() >
  TODAY.getTime();

const isFutureKey = (key: string) => isFutureDate(parseDate(key));

const formatDate = (key: string) =>
  parseDate(key).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getWeekStart = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - ((day + 6) % 7));
  result.setHours(0, 0, 0, 0);
  return result;
};

const getDayStatus = (key: string): DayStatus => {
  if (isFutureKey(key)) return "future";

  const classes = attendanceData[key] || [];
  if (classes.length === 0) return "none";

  const present = classes.filter((item) => item.status === "present").length;

  if (present === classes.length) return "present";
  if (present === 0) return "absent";

  return "partial";
};

const getStatusLabel = (status: DayStatus) => {
  switch (status) {
    case "present":
      return "Present";
    case "partial":
      return "Partial Absent";
    case "absent":
      return "Absent";
    case "future":
      return "Upcoming";
    default:
      return "No Classes";
  }
};

const getStatusClasses = (status: DayStatus) => {
  switch (status) {
    case "present":
      return "bg-[#EAF8F1] text-[#259B78]";
    case "partial":
      return "bg-[#FFF5E8] text-[#D99035]";
    case "absent":
      return "bg-[#FFF0F1] text-[#DC626B]";
    default:
      return "bg-[#F1F3F7] text-[#8992A6]";
  }
};

const getStatusColor = (status: DayStatus) => {
  switch (status) {
    case "present":
      return COLORS.green;
    case "partial":
      return COLORS.orange;
    case "absent":
      return COLORS.red;
    default:
      return COLORS.muted;
  }
};

const getMonthStats = (month: number, year: number) => {
  let present = 0;
  let partial = 0;
  let absent = 0;
  let totalClasses = 0;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day));
    if (isFutureKey(key)) continue;

    const classes = attendanceData[key] || [];
    totalClasses += classes.length;

    const status = getDayStatus(key);

    if (status === "present") present++;
    if (status === "partial") partial++;
    if (status === "absent") absent++;
  }

  return { present, partial, absent, totalClasses };
};

function StatusPill({ status }: { status: DayStatus }) {
  const textColor =
    status === "present"
      ? COLORS.green
      : status === "partial"
        ? COLORS.orange
        : status === "absent"
          ? COLORS.red
          : COLORS.muted;

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-3 py-2 ${getStatusClasses(status)}`}
    >
      <View
        className="mr-2 h-2 w-2 rounded-full"
        style={{ backgroundColor: getStatusColor(status) }}
      />
      <Text style={{ color: textColor }} className="text-[11px] font-bold">
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[17px] font-extrabold text-[#202B49]">{title}</Text>
      <Text className="mt-1 text-xs text-[#8992A6]">{subtitle}</Text>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="mr-4 mb-2 flex-row items-center">
      <View
        className="mr-2 h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[11px] font-medium text-[#8992A6]">{label}</Text>
    </View>
  );
}

function OverallAttendanceCard({
  percentage,
  attended,
  missed,
  total,
}: {
  percentage: number;
  attended: number;
  missed: number;
  total: number;
}) {
  const isOnTrack = total > 0 && percentage >= ATTENDANCE_TARGET;

  const classesNeeded =
    total === 0 || isOnTrack
      ? 0
      : Math.max(
          0,
          Math.ceil(
            (ATTENDANCE_TARGET * total - 100 * attended) /
              (100 - ATTENDANCE_TARGET),
          ),
        );

  const missedPercentage = total ? Math.round((missed / total) * 100) : 0;

  const remainingPercentage = Math.max(0, ATTENDANCE_TARGET - percentage);

  const statusColor =
    total === 0 ? COLORS.muted : isOnTrack ? COLORS.green : COLORS.orange;

  return (
    <View className="pb-5">
      <LinearGradient
        colors={["#DCE8FF", "#E9E4FF", "#F4E9FF", "#E8F3FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 15,
          padding: 19,
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <View
          className="absolute rounded-full"
          style={{
            width: 170,
            height: 170,
            backgroundColor: "#FFFFFF",
            opacity: 0.22,
            top: -75,
            right: -45,
          }}
        />

        <View
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            backgroundColor: "#B7C6FF",
            opacity: 0.18,
            bottom: 100,
            left: -65,
          }}
        />

        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center">
              <Ionicons name="school-outline" size={16} color="#596CCB" />
              <Text className="ml-2 text-[10px] font-extrabold tracking-[1.5px] text-[#596CCB]">
                CAMPUSOS • ATTENDANCE
              </Text>
            </View>

            <Text className="mt-4 text-[28px] font-extrabold text-[#202B49]">
              Stay consistent.
            </Text>

            <Text className="mt-2 max-w-[250px] text-xs leading-5 text-[#687797]">
              Track your class participation and stay on target throughout the
              semester.
            </Text>
          </View>

          <View className="h-[58px] w-[58px] items-center justify-center rounded-[20px] bg-white/80">
            <Ionicons name="calendar-outline" size={28} color="#6478E8" />
          </View>
        </View>

        {/* Overall attendance */}
        <View className="mt-6 rounded-[23px] bg-white/75 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[10px] font-extrabold tracking-[1.2px] text-[#8792AD]">
                OVERALL ATTENDANCE
              </Text>

              <View className="mt-1 flex-row items-baseline">
                <Text className="text-[42px] font-extrabold text-[#27365C]">
                  {percentage}
                </Text>
                <Text className="ml-1 text-xl font-bold text-[#6478E8]">%</Text>
              </View>

              <Text className="mt-1 text-[11px] text-[#8992A6]">
                {attended} of {total} classes attended
              </Text>

              <View
                className="mt-3 flex-row items-center self-start rounded-full px-3 py-1.5"
                style={{
                  backgroundColor:
                    total === 0 ? "#EEF1FF" : isOnTrack ? "#E1F5E9" : "#FFF0D8",
                }}
              >
                <Ionicons
                  name={
                    total === 0
                      ? "information-circle-outline"
                      : isOnTrack
                        ? "checkmark-circle"
                        : "alert-circle"
                  }
                  size={13}
                  color={statusColor}
                />

                <Text
                  className="ml-1.5 text-[10px] font-extrabold"
                  style={{ color: statusColor }}
                >
                  {total === 0
                    ? "No records"
                    : isOnTrack
                      ? "Target achieved"
                      : "Below target"}
                </Text>
              </View>
            </View>

            <View className="h-[86px] w-[86px] items-center justify-center rounded-full bg-[#E7EBFF]">
              <Ionicons
                name={isOnTrack ? "trophy" : "trending-up-outline"}
                size={25}
                color="#6478E8"
              />
              <Text className="mt-1 text-[11px] font-extrabold text-[#6478E8]">
                {ATTENDANCE_TARGET}% Goal
              </Text>
            </View>
          </View>

          {/* Gradient progress */}
          <View className="mt-4 h-[9px] overflow-hidden rounded-full bg-[#DFE5F5]">
            <LinearGradient
              colors={["#6478E8", "#8794EE", "#B18CEB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: "100%",
                width: `${Math.max(0, Math.min(100, percentage))}%`,
                borderRadius: 20,
              }}
            />
          </View>

          <View className="mt-2 flex-row justify-between">
            <Text className="text-[9px] font-semibold text-[#8992A6]">
              0% Attendance
            </Text>
            <Text className="text-[9px] font-extrabold text-[#6478E8]">
              Target {ATTENDANCE_TARGET}%
            </Text>
            <Text className="text-[9px] font-semibold text-[#8992A6]">
              100%
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1 rounded-[19px] bg-white/80 p-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#E1F5E9]">
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color="#23966B"
              />
            </View>

            <Text className="mt-3 text-[24px] font-extrabold text-[#23966B]">
              {attended}
            </Text>

            <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#719C87]">
              ATTENDED
            </Text>
            <Text className="mt-1 text-[9px] text-[#8992A6]">
              Classes present
            </Text>
          </View>

          <View className="flex-1 rounded-[19px] bg-white/80 p-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#FFE9EC]">
              <Ionicons name="close-circle-outline" size={19} color="#D95463" />
            </View>

            <Text className="mt-3 text-[24px] font-extrabold text-[#D95463]">
              {missed}
            </Text>

            <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#B98287]">
              MISSED
            </Text>
            <Text className="mt-1 text-[9px] text-[#8992A6]">
              Classes absent
            </Text>
          </View>

          <View className="flex-1 rounded-[19px] bg-white/80 p-3">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#E7EBFF]">
              <Ionicons name="calendar-outline" size={19} color="#6478E8" />
            </View>

            <Text className="mt-3 text-[24px] font-extrabold text-[#6478E8]">
              {total}
            </Text>

            <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#8290C6]">
              TOTAL
            </Text>
            <Text className="mt-1 text-[9px] text-[#8992A6]">
              Recorded classes
            </Text>
          </View>
        </View>

        {/* Attendance breakdown */}
        <View className="mt-4 rounded-[21px] bg-white/80 p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] font-extrabold text-[#27365C]">
                Attendance breakdown
              </Text>
              <Text className="mt-1 text-[10px] text-[#8992A6]">
                Your class participation overview
              </Text>
            </View>

            <View className="rounded-xl bg-[#EEF1FF] px-3 py-2">
              <Text className="text-[10px] font-extrabold text-[#6478E8]">
                {total} Classes
              </Text>
            </View>
          </View>

          <View className="mt-4 h-[10px] flex-row overflow-hidden rounded-full bg-[#E9EDF5]">
            {total > 0 && (
              <>
                <View
                  style={{
                    width: `${(attended / total) * 100}%`,
                    backgroundColor: "#259B78",
                  }}
                />
                <View
                  style={{
                    width: `${(missed / total) * 100}%`,
                    backgroundColor: "#DC626B",
                  }}
                />
              </>
            )}
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-2 h-2.5 w-2.5 rounded-full bg-[#259B78]" />
              <View>
                <Text className="text-[10px] font-extrabold text-[#27365C]">
                  Present
                </Text>
                <Text className="mt-0.5 text-[10px] text-[#8992A6]">
                  {percentage}%
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="mr-2 h-2.5 w-2.5 rounded-full bg-[#DC626B]" />
              <View>
                <Text className="text-[10px] font-extrabold text-[#27365C]">
                  Absent
                </Text>
                <Text className="mt-0.5 text-[10px] text-[#8992A6]">
                  {missedPercentage}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actionable insight */}
        <View className="mt-4 flex-row items-start rounded-[21px] bg-white/80 p-4">
          <View
            className="h-10 w-10 items-center justify-center rounded-[14px]"
            style={{
              backgroundColor: isOnTrack ? "#E1F5E9" : "#FFF0D8",
            }}
          >
            <Ionicons
              name={isOnTrack ? "ribbon-outline" : "trending-up-outline"}
              size={21}
              color={statusColor}
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-xs font-extrabold text-[#27365C]">
              {total === 0
                ? "Attendance insight"
                : isOnTrack
                  ? "You are meeting your target"
                  : "Your improvement plan"}
            </Text>

            <Text className="mt-1 text-[11px] leading-5 text-[#687797]">
              {total === 0
                ? "Your attendance insights will appear when class records become available."
                : isOnTrack
                  ? `You are ${percentage - ATTENDANCE_TARGET} percentage points above the minimum target. Keep maintaining your attendance.`
                  : `You are ${remainingPercentage} percentage points below the target. Attend the next ${classesNeeded} consecutive classes to reach ${ATTENDANCE_TARGET}%.`}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View className="mt-4 flex-row items-center justify-between px-1">
          <View className="flex-row items-center">
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color="#7785A5"
            />
            <Text className="ml-1.5 text-[10px] text-[#7785A5]">
              Calculated from class records
            </Text>
          </View>

          <Text className="text-[10px] font-extrabold text-[#596CCB]">
            {attended}/{total} attended
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function StudentAttendanceScreen() {
  const [view, setView] = useState<ViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(TODAY_KEY);
  const [monthCursor, setMonthCursor] = useState(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  );
  const [selectedYear, setSelectedYear] = useState(TODAY.getFullYear());

  const selectedClasses = attendanceData[selectedDate] || [];

  const [selectedStatsMonth, setSelectedStatsMonth] = useState(
    TODAY.getMonth(),
  );
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const selectedPresent = selectedClasses.filter(
    (item) => item.status === "present",
  ).length;

  const selectedAbsent = selectedClasses.filter(
    (item) => item.status === "absent",
  ).length;

  const selectedStatus = getDayStatus(selectedDate);

  const allRecordedClasses = Object.entries(attendanceData)
    .filter(([key]) => !isFutureKey(key))
    .flatMap(([, classes]) => classes);

  const totalClasses = allRecordedClasses.length;

  const attendedClasses = allRecordedClasses.filter(
    (item) => item.status === "present",
  ).length;

  const missedClasses = totalClasses - attendedClasses;

  const overallPercentage = totalClasses
    ? Math.round((attendedClasses / totalClasses) * 100)
    : 0;

  const weekDates = useMemo(() => {
    const start = getWeekStart(parseDate(selectedDate));

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const monthDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mondayOffset = (firstDay + 6) % 7;
    const cells: (Date | null)[] = [];

    for (let i = 0; i < mondayOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [monthCursor]);

  const weekPresent = weekDates.filter(
    (date) => getDayStatus(dateKey(date)) === "present",
  ).length;

  const weekPartial = weekDates.filter(
    (date) => getDayStatus(dateKey(date)) === "partial",
  ).length;

  const weekAbsent = weekDates.filter(
    (date) => getDayStatus(dateKey(date)) === "absent",
  ).length;

  const monthStats = getMonthStats(
    monthCursor.getMonth(),
    monthCursor.getFullYear(),
  );

  const latestMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);

  const monthCanGoForward =
    new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1) <=
    latestMonth;

  const changeWeek = (direction: number) => {
    const start = getWeekStart(parseDate(selectedDate));
    const next = new Date(start);

    next.setDate(start.getDate() + direction * 7);

    const latestWeekStart = getWeekStart(TODAY);

    if (next > latestWeekStart) return;

    const target =
      direction > 0
        ? new Date(Math.min(next.getTime(), TODAY.getTime()))
        : next;

    setSelectedDate(dateKey(target));
  };

  const changeMonth = (direction: number) => {
    const next = new Date(
      monthCursor.getFullYear(),
      monthCursor.getMonth() + direction,
      1,
    );

    if (next > latestMonth) return;

    setMonthCursor(next);

    const selected = parseDate(selectedDate);

    if (
      selected.getFullYear() !== next.getFullYear() ||
      selected.getMonth() !== next.getMonth()
    ) {
      const target = new Date(next.getFullYear(), next.getMonth(), 1);

      setSelectedDate(isFutureDate(target) ? TODAY_KEY : dateKey(target));
    }
  };

  const selectDate = (date: Date) => {
    if (isFutureDate(date)) return;

    setSelectedDate(dateKey(date));
    setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const openToday = () => {
    setSelectedDate(TODAY_KEY);
    setMonthCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
    setSelectedYear(TODAY.getFullYear());
  };

  const monthName = monthCursor.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FD]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-5 pb-4 pt-3">
        <Pressable
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
        >
          <Ionicons name="arrow-back" size={21} color="#202B49" />
        </Pressable>

        <View className="ml-3 flex-1">
          <Text className="text-[10px] font-extrabold tracking-[1.5px] text-[#6478E8]">
            CAMPUSOS · STUDENT
          </Text>
          <Text className="mt-0.5 text-[23px] font-extrabold text-[#202B49]">
            Attendance
          </Text>
        </View>

        <Pressable
          onPress={openToday}
          className="flex-row items-center rounded-xl bg-[#EEF1FF] px-3 py-2.5"
        >
          <Ionicons name="calendar-outline" size={16} color="#6478E8" />
          <Text className="ml-1.5 text-xs font-bold text-[#6478E8]">Today</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
      >
        {/* Overall attendance */}
        <OverallAttendanceCard
          percentage={overallPercentage}
          attended={attendedClasses}
          missed={missedClasses}
          total={totalClasses}
        />

        {/* Attendance details */}
        <View className="mb-3 mt-7 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-[18px] font-extrabold text-[#202B49]">
              Attendance Details
            </Text>
            <Text className="mt-1 text-xs text-[#8992A6]">
              Explore your attendance by date
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-[#EAF8F1] px-3 py-2">
            <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#259B78]" />
            <Text className="text-[10px] font-bold text-[#259B78]">
              Till Nov 3
            </Text>
          </View>
        </View>

        {/* View tabs */}
        <View className="mb-4 flex-row rounded-2xl border border-[#E9EDF5] bg-white p-1.5">
          {(["week", "month", "year"] as const).map((item) => {
            const active = view === item;

            return (
              <Pressable
                key={item}
                onPress={() => setView(item)}
                className={`flex-1 items-center rounded-xl py-3 ${
                  active ? "bg-[#6478E8]" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    active ? "text-white" : "text-[#8992A6]"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {/* Week view */}
        {view === "week" && (
          <View className="rounded-[24px] border border-[#E9EDF5] bg-white p-4">
            {/* Header */}
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={15} color="#6478E8" />
                  <Text className="ml-2 text-[10px] font-extrabold tracking-[1.3px] text-[#6478E8]">
                    ATTENDANCE TRACKER
                  </Text>
                </View>

                <Text className="mt-3 text-[21px] font-extrabold text-[#202B49]">
                  Weekly attendance
                </Text>

                <Text className="mt-1 text-[11px] text-[#8992A6]">
                  {weekDates[0].toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  –{" "}
                  {weekDates[6].toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>

              <View className="flex-row">
                <Pressable
                  onPress={() => changeWeek(-1)}
                  className="mr-2 h-10 w-10 items-center justify-center rounded-[14px] border border-[#E9EDF5] bg-white"
                >
                  <Ionicons name="chevron-back" size={18} color="#6478E8" />
                </Pressable>

                <Pressable
                  onPress={() => changeWeek(1)}
                  disabled={
                    dateKey(weekDates[0]) >= dateKey(getWeekStart(TODAY))
                  }
                  className="h-10 w-10 items-center justify-center rounded-[14px] border border-[#E9EDF5] bg-white"
                  style={{
                    opacity:
                      dateKey(weekDates[0]) >= dateKey(getWeekStart(TODAY))
                        ? 0.4
                        : 1,
                  }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={
                      dateKey(weekDates[0]) >= dateKey(getWeekStart(TODAY))
                        ? "#C8CDD8"
                        : "#6478E8"
                    }
                  />
                </Pressable>
              </View>
            </View>

            {/* Weekly calendar */}
            <View className="rounded-[20px] border border-[#EEF0F5] bg-[#FAFBFD] p-3">
              <View className="flex-row justify-between gap-1">
                {weekDates.map((date) => {
                  const key = dateKey(date);
                  const future = isFutureDate(date);
                  const status = getDayStatus(key);
                  const selected = key === selectedDate;

                  return (
                    <Pressable
                      key={key}
                      disabled={future}
                      onPress={() => selectDate(date)}
                      className="min-w-[39px] flex-1 items-center rounded-2xl py-3"
                      style={{
                        backgroundColor: selected ? "transparent" : "#FFFFFF",
                        borderWidth: selected ? 0 : 1,
                        borderColor: "#EEF0F5",
                        opacity: future ? 0.5 : 1,
                        elevation: selected ? 3 : 0,
                        shadowColor: "#6478E8",
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: selected ? 0.2 : 0,
                        shadowRadius: 5,
                      }}
                    >
                      {selected ? (
                        <LinearGradient
                          colors={["#6478E8", "#8794EE", "#B18CEB"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 16,
                          }}
                        />
                      ) : null}

                      <Text
                        className={`text-[10px] font-bold ${
                          selected ? "text-white" : "text-[#8992A6]"
                        }`}
                      >
                        {date.toLocaleDateString("en-IN", {
                          weekday: "short",
                        })}
                      </Text>

                      <Text
                        className={`mt-2 text-sm font-extrabold ${
                          selected
                            ? "text-white"
                            : future
                              ? "text-[#C8CDD8]"
                              : "text-[#202B49]"
                        }`}
                      >
                        {date.getDate()}
                      </Text>

                      <View
                        className="mt-2 h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: future
                            ? "#DDE1E9"
                            : status === "none"
                              ? "transparent"
                              : selected
                                ? "#FFFFFF"
                                : getStatusColor(status),
                        }}
                      />
                    </Pressable>
                  );
                })}
              </View>

              {/* Legend */}
              <View className="mt-4 flex-row flex-wrap border-t border-[#EEF0F5] pt-4">
                <LegendItem color="#259B78" label="Present" />
                <LegendItem color="#D99035" label="Partial" />
                <LegendItem color="#DC626B" label="Absent" />
                <LegendItem color="#DDE1E9" label="Upcoming" />
              </View>
            </View>

            {/* Weekly statistics */}
            <View className="mt-4 flex-row gap-2">
              <View className="flex-1 rounded-[18px] border border-[#E3F2EA] bg-[#F5FBF7] p-3">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color="#259B78"
                />
                <Text className="mt-3 text-[23px] font-extrabold text-[#259B78]">
                  {weekPresent}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#719C87]">
                  PRESENT
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Present days
                </Text>
              </View>

              <View className="flex-1 rounded-[18px] border border-[#F5EBD9] bg-[#FFFAF2] p-3">
                <Ionicons name="time-outline" size={19} color="#D99035" />
                <Text className="mt-3 text-[23px] font-extrabold text-[#D99035]">
                  {weekPartial}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#A58A62]">
                  PARTIAL
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Partial days
                </Text>
              </View>

              <View className="flex-1 rounded-[18px] border border-[#F5E3E5] bg-[#FFF7F7] p-3">
                <Ionicons
                  name="close-circle-outline"
                  size={19}
                  color="#DC626B"
                />
                <Text className="mt-3 text-[23px] font-extrabold text-[#DC626B]">
                  {weekAbsent}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#B98287]">
                  ABSENT
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Absent days
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Month view */}
        {view === "month" && (
          <View className="rounded-[24px] border border-[#E9EDF5] bg-white p-4">
            {/* Header */}
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={15} color="#6478E8" />
                  <Text className="ml-2 text-[10px] font-extrabold tracking-[1.3px] text-[#6478E8]">
                    ATTENDANCE TRACKER
                  </Text>
                </View>

                <Text className="mt-3 text-[21px] font-extrabold text-[#202B49]">
                  Monthly attendance
                </Text>

                <Text className="mt-1 text-[11px] text-[#8992A6]">
                  {monthName}
                </Text>
              </View>

              <View className="flex-row">
                <Pressable
                  onPress={() => changeMonth(-1)}
                  className="mr-2 h-10 w-10 items-center justify-center rounded-[14px] border border-[#E9EDF5] bg-white"
                >
                  <Ionicons name="chevron-back" size={18} color="#6478E8" />
                </Pressable>

                <Pressable
                  onPress={() => changeMonth(1)}
                  disabled={!monthCanGoForward}
                  className="h-10 w-10 items-center justify-center rounded-[14px] border border-[#E9EDF5] bg-white"
                  style={{ opacity: monthCanGoForward ? 1 : 0.4 }}
                >
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={monthCanGoForward ? "#6478E8" : "#C8CDD8"}
                  />
                </Pressable>
              </View>
            </View>

            {/* Calendar */}
            <View className="rounded-[20px] border border-[#EEF0F5] bg-[#FAFBFD] p-3">
              <View className="flex-row flex-wrap">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <View key={day} className="w-[14%] items-center pb-3 pt-1">
                      <Text className="text-[10px] font-extrabold text-[#8992A6]">
                        {day}
                      </Text>
                    </View>
                  ),
                )}

                {monthDays.map((date, index) => {
                  if (!date) {
                    return (
                      <View key={`empty-${index}`} className="h-12 w-[14%]" />
                    );
                  }

                  const key = dateKey(date);
                  const future = isFutureDate(date);
                  const status = getDayStatus(key);
                  const selected = selectedDate === key;

                  return (
                    <Pressable
                      key={key}
                      disabled={future}
                      onPress={() => selectDate(date)}
                      className="h-12 w-[14%] items-center justify-center"
                      style={{ opacity: future ? 0.5 : 1 }}
                    >
                      <View
                        className="h-9 w-9 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: selected ? "transparent" : "#FFFFFF",
                          borderWidth: selected ? 0 : 1,
                          borderColor:
                            !future && status !== "none"
                              ? getStatusColor(status)
                              : "transparent",
                          shadowColor: "#6478E8",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: selected ? 0.2 : 0,
                          shadowRadius: 5,
                          elevation: selected ? 3 : 0,
                        }}
                      >
                        {selected && (
                          <LinearGradient
                            colors={["#6478E8", "#8794EE", "#B18CEB"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              borderRadius: 12,
                            }}
                          />
                        )}

                        <Text
                          className={`text-xs font-extrabold ${
                            selected
                              ? "text-white"
                              : future
                                ? "text-[#C8CDD8]"
                                : "text-[#202B49]"
                          }`}
                        >
                          {date.getDate()}
                        </Text>

                        {!future && status !== "none" && (
                          <View
                            className="mt-0.5 h-1 w-1 rounded-full"
                            style={{
                              backgroundColor: selected
                                ? "#FFFFFF"
                                : getStatusColor(status),
                            }}
                          />
                        )}

                        {future && (
                          <View className="mt-0.5 h-1 w-1 rounded-full bg-[#DDE1E9]" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Legend */}
              <View className="mt-3 flex-row flex-wrap border-t border-[#EEF0F5] pt-4">
                <LegendItem color="#259B78" label="Present" />
                <LegendItem color="#D99035" label="Partial absent" />
                <LegendItem color="#DC626B" label="Absent" />
              </View>
            </View>

            {/* Monthly statistics */}
            <View className="mt-4 flex-row gap-2">
              {/* Present */}
              <View className="flex-1 rounded-[18px] border border-[#E3F2EA] bg-[#F5FBF7] p-3">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#259B78"
                />
                <Text className="mt-2 text-[23px] font-extrabold text-[#259B78]">
                  {monthStats.present}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#719C87]">
                  PRESENT
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Present days
                </Text>
              </View>

              {/* Partial */}
              <View className="flex-1 rounded-[18px] border border-[#F5EBD9] bg-[#FFFAF2] p-3">
                <Ionicons name="time-outline" size={18} color="#D99035" />
                <Text className="mt-2 text-[23px] font-extrabold text-[#D99035]">
                  {monthStats.partial}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#A58A62]">
                  PARTIAL
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Partial days
                </Text>
              </View>

              {/* Absent */}
              <View className="flex-1 rounded-[18px] border border-[#F5E3E5] bg-[#FFF7F7] p-3">
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#DC626B"
                />
                <Text className="mt-2 text-[23px] font-extrabold text-[#DC626B]">
                  {monthStats.absent}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#B98287]">
                  ABSENT
                </Text>
                <Text className="mt-1 text-[9px] text-[#8992A6]">
                  Absent days
                </Text>
              </View>
            </View>

            <Text className="mt-4 text-center text-[10px] font-semibold text-[#8992A6]">
              {monthStats.totalClasses} class records available this month
            </Text>
          </View>
        )}

   {view === "year" &&
  (() => {
    const yearStats = Array.from({ length: 12 }, (_, month) => {
      const monthDate = new Date(selectedYear, month, 1);

      if (monthDate > latestMonth) {
        return {
          present: 0,
          partial: 0,
          absent: 0,
          totalClasses: 0,
        };
      }

      return getMonthStats(month, selectedYear);
    });

    const yearlyPresent = yearStats.reduce(
      (sum, item) => sum + item.present,
      0,
    );

    const yearlyPartial = yearStats.reduce(
      (sum, item) => sum + item.partial,
      0,
    );

    const yearlyAbsent = yearStats.reduce(
      (sum, item) => sum + item.absent,
      0,
    );

    const yearlyTotal =
      yearlyPresent + yearlyPartial + yearlyAbsent;

    const yearlyPercentage = yearlyTotal
      ? Math.round((yearlyPresent / yearlyTotal) * 100)
      : 0;

    const availableMonths = Array.from(
      { length: 12 },
      (_, month) => month,
    ).filter(
      (month) => new Date(selectedYear, month, 1) <= latestMonth,
    );

    const safeMonth = availableMonths.includes(selectedStatsMonth)
      ? selectedStatsMonth
      : availableMonths.length
        ? availableMonths[availableMonths.length - 1]
        : 0;

    const monthlyStats = getMonthStats(safeMonth, selectedYear);

    const monthlyTotal =
      monthlyStats.present +
      monthlyStats.partial +
      monthlyStats.absent;

    const monthlyPercentage = monthlyTotal
      ? Math.round((monthlyStats.present / monthlyTotal) * 100)
      : 0;

    const selectedMonthName = new Date(
      selectedYear,
      safeMonth,
      1,
    ).toLocaleDateString("en-IN", { month: "long" });

    return (
      <View className="rounded-[26px] border border-[#E9EDF4] bg-white p-5">

        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] font-extrabold tracking-[1.4px] text-[#6478E8]">
              ATTENDANCE OVERVIEW
            </Text>

            <Text className="mt-2 text-[22px] font-extrabold text-[#202B49]">
              Yearly report
            </Text>

            <Text className="mt-1 text-[11px] text-[#8992A6]">
              Your academic attendance summary
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#F0F2FF]">
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color="#6478E8"
            />
          </View>
        </View>

        {/* Year selector */}
        <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-[#F7F8FC] p-3">

          <Pressable
            onPress={() => {
              setSelectedYear((value) => value - 1);
              setShowMonthDropdown(false);
            }}
            disabled={selectedYear <= 2025}
            className="h-9 w-9 items-center justify-center rounded-xl bg-white"
            style={{
              opacity: selectedYear <= 2025 ? 0.35 : 1,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={19}
              color="#6478E8"
            />
          </Pressable>

          <View className="items-center">
            <Text className="text-[20px] font-extrabold text-[#202B49]">
              {selectedYear}
            </Text>

            <Text className="mt-0.5 text-[9px] font-bold tracking-[1px] text-[#8992A6]">
              SELECTED YEAR
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setSelectedYear((value) => value + 1);
              setShowMonthDropdown(false);
            }}
            disabled={selectedYear >= TODAY.getFullYear()}
            className="h-9 w-9 items-center justify-center rounded-xl bg-white"
            style={{
              opacity:
                selectedYear >= TODAY.getFullYear() ? 0.35 : 1,
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={19}
              color="#6478E8"
            />
          </Pressable>
        </View>

        {/* Yearly Statistics */}
        <View className="mt-6">

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-[15px] font-extrabold text-[#202B49]">
              Yearly statistics
            </Text>

            <Text className="text-[10px] font-semibold text-[#8992A6]">
              {selectedYear}
            </Text>
          </View>

          <View className="rounded-[20px] bg-[#F7F8FC] p-4">

            {/* Overall percentage */}
            <View className="flex-row items-center justify-between">

              <View>
                <Text className="text-[11px] font-semibold text-[#8992A6]">
                  Overall attendance
                </Text>

                <Text className="mt-1 text-[32px] font-extrabold text-[#202B49]">
                  {yearlyPercentage}%
                </Text>

                <Text className="mt-1 text-[10px] text-[#8992A6]">
                  {yearlyTotal} recorded classes
                </Text>
              </View>

              <View className="h-[76px] w-[76px] items-center justify-center rounded-full border-[7px] border-[#E6EAF5]">
                <Text className="text-[19px] font-extrabold text-[#6478E8]">
                  {yearlyPercentage}%
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6EAF2]">
              <View
                className="h-full rounded-full bg-[#269B78]"
                style={{
                  width: `${yearlyPercentage}%`,
                }}
              />
            </View>

            {/* Yearly class counts */}
            <View className="mt-5">

              <Text className="mb-3 text-[11px] font-bold text-[#8992A6]">
                CLASS BREAKDOWN
              </Text>

              <View className="flex-row gap-2">

                {/* Total */}
                <View className="flex-1 rounded-[15px] bg-white p-3">
                  <Ionicons
                    name="albums-outline"
                    size={18}
                    color="#6478E8"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#8992A6]">
                    Total
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#202B49]">
                    {yearlyTotal}
                  </Text>
                </View>

                {/* Present */}
                <View className="flex-1 rounded-[15px] bg-[#EAF8F1] p-3">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#269B78"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#269B78]">
                    Present
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#269B78]">
                    {yearlyPresent}
                  </Text>
                </View>
              </View>

              <View className="mt-2 flex-row gap-2">

                {/* Absent */}
                <View className="flex-1 rounded-[15px] bg-[#FFF0F1] p-3">
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="#D96672"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#D96672]">
                    Absent
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#D96672]">
                    {yearlyAbsent}
                  </Text>
                </View>

                {/* Partial */}
                <View className="flex-1 rounded-[15px] bg-[#FFF6E9] p-3">
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#D99A42"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#D99A42]">
                    Partial
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#D99A42]">
                    {yearlyPartial}
                  </Text>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* Monthly Statistics */}
        <View className="mt-6">

          <Text className="mb-3 text-[15px] font-extrabold text-[#202B49]">
            Monthly statistics
          </Text>

          {/* Month dropdown */}
          <Pressable
            onPress={() =>
              setShowMonthDropdown((value) => !value)
            }
            className="flex-row items-center justify-between rounded-2xl border border-[#E9EDF5] bg-white p-4"
          >
            <View className="flex-row items-center">

              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#F0F2FF]">
                <Ionicons
                  name="calendar-outline"
                  size={19}
                  color="#6478E8"
                />
              </View>

              <View>
                <Text className="text-[13px] font-extrabold text-[#202B49]">
                  {selectedMonthName}
                </Text>

                <Text className="mt-0.5 text-[10px] text-[#8992A6]">
                  Select month to view statistics
                </Text>
              </View>
            </View>

            <Ionicons
              name={
                showMonthDropdown
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={19}
              color="#6478E8"
            />
          </Pressable>

          {/* Dropdown list */}
          {showMonthDropdown && (
            <View className="mt-2 rounded-2xl border border-[#E9EDF5] bg-white p-2">

              {availableMonths.map((month) => {
                const active = month === safeMonth;

                const name = new Date(
                  selectedYear,
                  month,
                  1,
                ).toLocaleDateString("en-IN", {
                  month: "long",
                });

                return (
                  <Pressable
                    key={month}
                    onPress={() => {
                      setSelectedStatsMonth(month);
                      setShowMonthDropdown(false);
                    }}
                    className="flex-row items-center justify-between rounded-xl px-3 py-3"
                    style={{
                      backgroundColor: active
                        ? "#F0F2FF"
                        : "#FFFFFF",
                    }}
                  >
                    <Text
                      className="text-[12px] font-semibold"
                      style={{
                        color: active
                          ? "#6478E8"
                          : "#202B49",
                      }}
                    >
                      {name}
                    </Text>

                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={17}
                        color="#6478E8"
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Selected month details */}
          <View className="mt-3 rounded-[20px] bg-[#F7F8FC] p-4">

            {/* Monthly percentage */}
            <View className="flex-row items-center justify-between">

              <View>
                <Text className="text-[11px] font-semibold text-[#8992A6]">
                  {selectedMonthName} attendance
                </Text>

                <Text className="mt-1 text-[28px] font-extrabold text-[#202B49]">
                  {monthlyPercentage}%
                </Text>
              </View>

              <View className="rounded-xl bg-white px-3 py-2">
                <Text className="text-[11px] font-bold text-[#6478E8]">
                  {monthlyTotal} classes
                </Text>
              </View>
            </View>

            {/* Monthly progress */}
            <View className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6EAF2]">
              <View
                className="h-full rounded-full bg-[#6478E8]"
                style={{
                  width: `${monthlyPercentage}%`,
                }}
              />
            </View>

            {/* Monthly class counts */}
            <View className="mt-5">

              <Text className="mb-3 text-[11px] font-bold text-[#8992A6]">
                CLASS BREAKDOWN
              </Text>

              <View className="flex-row gap-2">

                {/* Total */}
                <View className="flex-1 rounded-[15px] bg-white p-3">
                  <Ionicons
                    name="albums-outline"
                    size={18}
                    color="#6478E8"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#8992A6]">
                    Total
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#202B49]">
                    {monthlyTotal}
                  </Text>
                </View>

                {/* Present */}
                <View className="flex-1 rounded-[15px] bg-[#EAF8F1] p-3">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#269B78"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#269B78]">
                    Present
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#269B78]">
                    {monthlyStats.present}
                  </Text>
                </View>
              </View>

              <View className="mt-2 flex-row gap-2">

                {/* Absent */}
                <View className="flex-1 rounded-[15px] bg-[#FFF0F1] p-3">
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color="#D96672"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#D96672]">
                    Absent
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#D96672]">
                    {monthlyStats.absent}
                  </Text>
                </View>

                {/* Partial */}
                <View className="flex-1 rounded-[15px] bg-[#FFF6E9] p-3">
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color="#D99A42"
                  />

                  <Text className="mt-2 text-[10px] font-semibold text-[#D99A42]">
                    Partial
                  </Text>

                  <Text className="mt-1 text-[21px] font-extrabold text-[#D99A42]">
                    {monthlyStats.partial}
                  </Text>
                </View>
              </View>

            </View>
          </View>
        </View>

      </View>
    );
  })()}
        {/* Class-wise attendance */}
        {view !== "year" && (
          <>
            <View className="mb-3 mt-7">
              <SectionHeading
                title="Class-wise Attendance"
                subtitle="Individual class attendance records"
              />
            </View>
            <View className="rounded-[24px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF1FF]">
                  <Ionicons name="calendar" size={20} color="#6478E8" />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[9px] font-extrabold tracking-[1px] text-[#8992A6]">
                    SELECTED DATE
                  </Text>
                  <Text className="mt-1 text-[13px] font-extrabold text-[#202B49]">
                    {formatDate(selectedDate)}
                  </Text>
                </View>

                <StatusPill status={selectedStatus} />
              </View>

              {isFutureKey(selectedDate) ? (
                <View className="items-center py-9">
                  <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F3F7]">
                    <Ionicons
                      name="lock-closed-outline"
                      size={25}
                      color="#8992A6"
                    />
                  </View>

                  <Text className="mt-3 text-sm font-extrabold text-[#202B49]">
                    Future date unavailable
                  </Text>

                  <Text className="mt-1 px-5 text-center text-xs leading-5 text-[#8992A6]">
                    Attendance cannot be viewed or recorded before the date has
                    passed.
                  </Text>
                </View>
              ) : selectedClasses.length === 0 ? (
                <View className="items-center py-9">
                  <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F3F7]">
                    <Ionicons
                      name="calendar-clear-outline"
                      size={25}
                      color="#8992A6"
                    />
                  </View>

                  <Text className="mt-3 text-sm font-extrabold text-[#202B49]">
                    No class records
                  </Text>

                  <Text className="mt-1 px-5 text-center text-xs leading-5 text-[#8992A6]">
                    No scheduled classes or attendance records are available for
                    this date.
                  </Text>
                </View>
              ) : (
                <>
                  <View className="mt-5 flex-row rounded-2xl bg-[#F7F9FD] p-3">
                    <View className="flex-1 items-center">
                      <Text className="text-xl font-extrabold text-[#259B78]">
                        {selectedPresent}
                      </Text>
                      <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                        Present
                      </Text>
                    </View>

                    <View className="w-px bg-[#E5E9F1]" />

                    <View className="flex-1 items-center">
                      <Text className="text-xl font-extrabold text-[#DC626B]">
                        {selectedAbsent}
                      </Text>
                      <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                        Absent
                      </Text>
                    </View>

                    <View className="w-px bg-[#E5E9F1]" />

                    <View className="flex-1 items-center">
                      <Text className="text-xl font-extrabold text-[#202B49]">
                        {selectedClasses.length}
                      </Text>
                      <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                        Total classes
                      </Text>
                    </View>
                  </View>

                  <View className="mb-3 mt-5 flex-row items-center justify-between">
                    <Text className="text-sm font-extrabold text-[#202B49]">
                      Classes for this day
                    </Text>
                    <Text className="text-[11px] font-semibold text-[#8992A6]">
                      {selectedClasses.length} classes
                    </Text>
                  </View>

                  {selectedClasses.map((item, index) => {
                    const present = item.status === "present";

                    return (
                      <View
                        key={`${selectedDate}-${item.id}`}
                        className={`flex-row py-4 ${
                          index !== selectedClasses.length - 1
                            ? "border-b border-[#EEF0F5]"
                            : ""
                        }`}
                      >
                        <View
                          className={`h-10 w-10 items-center justify-center rounded-xl ${
                            present ? "bg-[#EAF8F1]" : "bg-[#FFF0F1]"
                          }`}
                        >
                          <Ionicons
                            name={present ? "checkmark-circle" : "close-circle"}
                            size={21}
                            color={present ? "#259B78" : "#DC626B"}
                          />
                        </View>

                        <View className="ml-3 flex-1">
                          <Text className="text-[13px] font-extrabold text-[#202B49]">
                            {item.subject}
                          </Text>

                          <Text className="mt-1 text-[10px] text-[#8992A6]">
                            {item.code} · {item.faculty}
                          </Text>

                          <View className="mt-2 flex-row flex-wrap">
                            <View className="mr-3 mb-1 flex-row items-center">
                              <Ionicons
                                name="time-outline"
                                size={12}
                                color="#8992A6"
                              />
                              <Text className="ml-1 text-[10px] text-[#8992A6]">
                                {item.time}
                              </Text>
                            </View>

                            <View className="mb-1 flex-row items-center">
                              <Ionicons
                                name="location-outline"
                                size={12}
                                color="#8992A6"
                              />
                              <Text className="ml-1 text-[10px] text-[#8992A6]">
                                {item.room}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View
                          className={`self-start rounded-full px-2.5 py-1.5 ${
                            present ? "bg-[#EAF8F1]" : "bg-[#FFF0F1]"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-extrabold ${
                              present ? "text-[#259B78]" : "text-[#DC626B]"
                            }`}
                          >
                            {present ? "Present" : "Absent"}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          </>
        )}
        {/* Attendance rules */}
        <View className="mt-4 flex-row rounded-[20px] border border-[#E3E9FF] bg-[#F1F4FF] p-4">
          <View className="h-9 w-9 items-center justify-center rounded-xl bg-white">
            <Ionicons name="information-circle" size={20} color="#6478E8" />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-xs font-extrabold text-[#202B49]">
              How daily attendance works
            </Text>

            <Text className="mt-1 text-[11px] leading-5 text-[#69748F]">
              Present means you attended every scheduled class. Partial Absent
              means you attended some classes but missed at least one. Absent
              means you missed every scheduled class. Days without records show
              No Classes.
            </Text>
          </View>
        </View>

        <Text className="mb-2 mt-5 text-center text-[10px] leading-4 text-[#A0A8B8]">
          Sample attendance data · Replace with official college records when
          connected
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
