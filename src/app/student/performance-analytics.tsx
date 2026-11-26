
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const COLORS = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  border: '#E9EDF5',
  bg: '#F7F8FC',
  white: '#FFFFFF',
  green: '#23966B',
  orange: '#D99435',
  red: '#D95463',
  purple: '#9277D6',
  paleBlue: '#EEF3FF',
  paleGreen: '#EAF8F1',
  paleOrange: '#FFF5E8',
  palePurple: '#F3F0FF',
};

type Subject = {
  code: string;
  name: string;
  internal: number;
  external: number;
  total: number;
  attendance: number;
  grade: string;
};

type SemesterData = {
  semester: number;
  cgpa: number;
  percentage: number;
  subjects: Subject[];
};

const trendData = [
  { label: 'Sem 1', value: 78 },
  { label: 'Sem 2', value: 81 },
  { label: 'Sem 3', value: 83 },
  { label: 'Sem 4', value: 85 },
  { label: 'Sem 5', value: 87 },
];

type Performer = {
  id: string;
  name: string;
  initials: string;
  department: string;
  cgpa: number;
  percentage: number;
  rank: number;
  color: string;
  tint: string;
};

const semesterData: SemesterData[] = [
  {
    semester: 1,
    cgpa: 7.8,
    percentage: 78,
    subjects: [
      { code: 'MA101', name: 'Engineering Mathematics I', internal: 25, external: 65, total: 90, attendance: 94, grade: 'A+' },
      { code: 'PH101', name: 'Engineering Physics', internal: 22, external: 59, total: 81, attendance: 88, grade: 'A' },
      { code: 'CH101', name: 'Engineering Chemistry', internal: 23, external: 55, total: 78, attendance: 91, grade: 'A' },
      { code: 'CS101', name: 'Programming Fundamentals', internal: 26, external: 62, total: 88, attendance: 96, grade: 'A+' },
      { code: 'EG101', name: 'Engineering Graphics', internal: 21, external: 57, total: 78, attendance: 89, grade: 'A' },
    ],
  },
  {
    semester: 2,
    cgpa: 8.1,
    percentage: 81,
    subjects: [
      { code: 'MA201', name: 'Engineering Mathematics II', internal: 24, external: 63, total: 87, attendance: 92, grade: 'A+' },
      { code: 'CS201', name: 'Data Structures Fundamentals', internal: 27, external: 64, total: 91, attendance: 96, grade: 'O' },
      { code: 'EC201', name: 'Basic Electronics', internal: 22, external: 58, total: 80, attendance: 90, grade: 'A' },
      { code: 'CS202', name: 'Object Oriented Programming', internal: 25, external: 61, total: 86, attendance: 93, grade: 'A+' },
      { code: 'EE201', name: 'Electrical Engineering', internal: 20, external: 55, total: 75, attendance: 87, grade: 'B+' },
    ],
  },
  {
    semester: 3,
    cgpa: 8.3,
    percentage: 83,
    subjects: [
      { code: 'CS301', name: 'Digital Principles', internal: 25, external: 63, total: 88, attendance: 94, grade: 'A+' },
      { code: 'CS302', name: 'Computer Organization', internal: 24, external: 60, total: 84, attendance: 91, grade: 'A' },
      { code: 'CS303', name: 'Database Management Systems', internal: 27, external: 65, total: 92, attendance: 97, grade: 'O' },
      { code: 'CS304', name: 'Object Oriented Analysis', internal: 23, external: 59, total: 82, attendance: 90, grade: 'A' },
      { code: 'EC301', name: 'Electronic Circuits', internal: 22, external: 57, total: 79, attendance: 89, grade: 'A' },
    ],
  },
  {
    semester: 4,
    cgpa: 8.5,
    percentage: 85,
    subjects: [
      { code: 'CS401', name: 'Operating Systems', internal: 26, external: 64, total: 90, attendance: 95, grade: 'A+' },
      { code: 'CS402', name: 'Computer Networks', internal: 25, external: 62, total: 87, attendance: 92, grade: 'A+' },
      { code: 'CS403', name: 'Software Engineering', internal: 27, external: 66, total: 93, attendance: 96, grade: 'O' },
      { code: 'CS404', name: 'Microprocessors', internal: 22, external: 59, total: 81, attendance: 88, grade: 'A' },
      { code: 'EC401', name: 'Communication Systems', internal: 24, external: 60, total: 84, attendance: 91, grade: 'A' },
    ],
  },
  {
    semester: 5,
    cgpa: 8.7,
    percentage: 87,
    subjects: [
      { code: 'CS501', name: 'Data Structures and Algorithms', internal: 27, external: 65, total: 92, attendance: 96, grade: 'O' },
      { code: 'CS502', name: 'Database Management Systems', internal: 25, external: 63, total: 88, attendance: 92, grade: 'A+' },
      { code: 'CS503', name: 'Operating Systems', internal: 24, external: 61, total: 85, attendance: 89, grade: 'A' },
      { code: 'CS504', name: 'Computer Networks', internal: 26, external: 64, total: 90, attendance: 94, grade: 'A+' },
      { code: 'CS505', name: 'Software Engineering', internal: 28, external: 66, total: 94, attendance: 97, grade: 'O' },
    ],
  },
];

const topPerformers: Record<number, Performer[]> = {
  1: [
    { id: '1', name: 'Aarav Sharma', initials: 'AS', department: 'Computer Science', cgpa: 9.42, percentage: 94, rank: 1, color: '#B17B16', tint: '#FFF4D8' },
    { id: '2', name: 'Priya Kumar', initials: 'PK', department: 'Computer Science', cgpa: 9.28, percentage: 93, rank: 2, color: '#8292B5', tint: '#EEF2FA' },
    { id: '3', name: 'Rahul Verma', initials: 'RV', department: 'Computer Science', cgpa: 9.12, percentage: 91, rank: 3, color: '#C58B62', tint: '#FFF0E7' },
  ],
  2: [
    { id: '1', name: 'Aarav Sharma', initials: 'AS', department: 'Computer Science', cgpa: 9.55, percentage: 95, rank: 1, color: '#B17B16', tint: '#FFF4D8' },
    { id: '2', name: 'Meera Nair', initials: 'MN', department: 'Computer Science', cgpa: 9.36, percentage: 94, rank: 2, color: '#8292B5', tint: '#EEF2FA' },
    { id: '3', name: 'Priya Kumar', initials: 'PK', department: 'Computer Science', cgpa: 9.24, percentage: 92, rank: 3, color: '#C58B62', tint: '#FFF0E7' },
  ],
  3: [
    { id: '1', name: 'Meera Nair', initials: 'MN', department: 'Computer Science', cgpa: 9.62, percentage: 96, rank: 1, color: '#B17B16', tint: '#FFF4D8' },
    { id: '2', name: 'Aarav Sharma', initials: 'AS', department: 'Computer Science', cgpa: 9.48, percentage: 95, rank: 2, color: '#8292B5', tint: '#EEF2FA' },
    { id: '3', name: 'Rahul Verma', initials: 'RV', department: 'Computer Science', cgpa: 9.31, percentage: 93, rank: 3, color: '#C58B62', tint: '#FFF0E7' },
  ],
  4: [
    { id: '1', name: 'Priya Kumar', initials: 'PK', department: 'Computer Science', cgpa: 9.72, percentage: 97, rank: 1, color: '#B17B16', tint: '#FFF4D8' },
    { id: '2', name: 'Meera Nair', initials: 'MN', department: 'Computer Science', cgpa: 9.58, percentage: 96, rank: 2, color: '#8292B5', tint: '#EEF2FA' },
    { id: '3', name: 'Aarav Sharma', initials: 'AS', department: 'Computer Science', cgpa: 9.40, percentage: 94, rank: 3, color: '#C58B62', tint: '#FFF0E7' },
  ],
  5: [
    { id: '1', name: 'Aarav Sharma', initials: 'AS', department: 'Computer Science', cgpa: 9.82, percentage: 96, rank: 1, color: '#B17B16', tint: '#FFF4D8' },
    { id: '2', name: 'Priya Kumar', initials: 'PK', department: 'Computer Science', cgpa: 9.65, percentage: 94, rank: 2, color: '#8292B5', tint: '#EEF2FA' },
    { id: '3', name: 'Rahul Verma', initials: 'RV', department: 'Computer Science', cgpa: 9.48, percentage: 92, rank: 3, color: '#C58B62', tint: '#FFF0E7' },
  ],
};

function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-1">
        <Text style={{ color: COLORS.navy, fontSize: 17, fontWeight: '800' }}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  helper,
  tint,
  iconColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  helper: string;
  tint: string;
  iconColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        padding: 14,
      }}
    >
      <View
        style={{
          width: 35,
          height: 35,
          borderRadius: 12,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={{ color: COLORS.muted, fontSize: 11, fontWeight: '600' }}>
        {label}
      </Text>
      <Text style={{ color: COLORS.navy, fontSize: 23, fontWeight: '900', marginTop: 5 }}>
        {value}
      </Text>
      <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 4 }}>
        {helper}
      </Text>
    </View>
  );
}

function TopPerformersSection({ semester }: { semester: number }) {
  const performers = topPerformers[semester] || [];
  const first = performers[0];

  return (
    <View className="mb-6">
      <SectionTitle
        title="Top 3 Performers"
        subtitle={`Semester ${semester} • Academic leaderboard`}
        right={
          <View
            style={{
              backgroundColor: COLORS.palePurple,
              paddingHorizontal: 11,
              paddingVertical: 8,
              borderRadius: 13,
            }}
          >
            <Ionicons name="trophy-outline" size={18} color={COLORS.purple} />
          </View>
        }
      />

      <LinearGradient
        colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          borderWidth: 1,
          borderColor: '#E4E9FA',
          padding: 15,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 115,
            height: 115,
            borderRadius: 60,
            backgroundColor: '#DFE5FF',
            opacity: 0.55,
            right: -40,
            top: -45,
          }}
        />

        {/* First place */}
        {first && (
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#F1E4BC',
              marginBottom: 12,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    backgroundColor: '#FFF4D8',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="trophy" size={25} color="#D99B24" />
                </View>
                <View className="ml-3 flex-1">
                  <Text style={{ color: '#B17B16', fontSize: 9, fontWeight: '900', letterSpacing: 1 }}>
                    SEMESTER TOPPER
                  </Text>
                  <Text style={{ color: COLORS.navy, fontSize: 15, fontWeight: '900', marginTop: 4 }}>
                    {first.name}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 3 }}>
                    {first.department}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#FFF4D8',
                  paddingHorizontal: 11,
                  paddingVertical: 7,
                  borderRadius: 11,
                }}
              >
                <Text style={{ color: '#B17B16', fontSize: 12, fontWeight: '900' }}>
                  #01
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-5">
              <View className="flex-1">
                <Text style={{ color: COLORS.muted, fontSize: 10 }}>CGPA</Text>
                <Text style={{ color: COLORS.navy, fontSize: 24, fontWeight: '900', marginTop: 3 }}>
                  {first.cgpa.toFixed(2)}
                </Text>
              </View>
              <View style={{ width: 1, height: 39, backgroundColor: COLORS.border, marginHorizontal: 15 }} />
              <View className="flex-1">
                <Text style={{ color: COLORS.muted, fontSize: 10 }}>Percentage</Text>
                <Text style={{ color: COLORS.green, fontSize: 24, fontWeight: '900', marginTop: 3 }}>
                  {first.percentage}%
                </Text>
              </View>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 17,
                  backgroundColor: '#FFF4D8',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="medal" size={30} color="#D99B24" />
              </View>
            </View>
          </View>
        )}

        {/* Second and third places */}
        {performers.slice(1).map(student => (
          <View
            key={student.id}
            style={{
              backgroundColor: '#FFFFFFE8',
              borderRadius: 17,
              padding: 13,
              marginBottom: 9,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E9EAF4',
            }}
          >
            <View
              style={{
                width: 41,
                height: 41,
                borderRadius: 14,
                backgroundColor: student.tint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: student.color, fontWeight: '900', fontSize: 12 }}>
                {student.initials}
              </Text>
            </View>

            <View className="flex-1 ml-3">
              <Text style={{ color: COLORS.navy, fontSize: 12, fontWeight: '900' }}>
                {student.name}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 3 }}>
                {student.department}
              </Text>
            </View>

            <View className="items-end">
              <Text style={{ color: COLORS.navy, fontSize: 15, fontWeight: '900' }}>
                {student.cgpa.toFixed(2)}
              </Text>
              <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 3 }}>
                {student.percentage}%
              </Text>
            </View>

            <View
              style={{
                width: 33,
                height: 33,
                borderRadius: 11,
                backgroundColor: student.tint,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 11,
              }}
            >
              <Text style={{ color: student.color, fontWeight: '900', fontSize: 11 }}>
                #{student.rank}
              </Text>
            </View>
          </View>
        ))}

        <View className="flex-row items-center justify-center mt-2">
          <Ionicons name="information-circle-outline" size={13} color={COLORS.muted} />
          <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 5 }}>
            Ranked by semester CGPA
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function PerformanceAnalyticsScreen() {
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects'>('overview');

  const current = useMemo(
    () => semesterData.find(item => item.semester === selectedSemester)!,
    [selectedSemester]
  );

  const averageInternal = Math.round(
    current.subjects.reduce((sum, subject) => sum + subject.internal, 0) /
      current.subjects.length
  );

  const averageAttendance = Math.round(
    current.subjects.reduce((sum, subject) => sum + subject.attendance, 0) /
      current.subjects.length
  );

  const highestSubject = [...current.subjects].sort(
    (a, b) => b.total - a.total
  )[0];

  const lowestSubject = [...current.subjects].sort(
    (a, b) => a.total - b.total
  )[0];

  const completedSemesters = semesterData.filter(
    item => item.semester < selectedSemester
  );

  const allTimeAverage =
    completedSemesters.length > 0
      ? (
          completedSemesters.reduce((sum, item) => sum + item.cgpa, 0) /
          completedSemesters.length
        ).toFixed(2)
      : current.cgpa.toFixed(2);

  const getScoreColor = (score: number) => {
    if (score >= 85) return COLORS.green;
    if (score >= 70) return COLORS.blue;
    return COLORS.orange;
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/student');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content"  />

      {/* Header */}
      <View className="px-5 pt-3 pb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Pressable
            onPress={handleBack}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 13,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.navy} />
          </Pressable>
          <View>
            <Text style={{ color: COLORS.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.3 }}>
              CAMPUSOS
            </Text>
            <Text style={{ color: COLORS.navy, fontSize: 20, fontWeight: '900', marginTop: 2 }}>
              Performance Analytics
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() =>
            Alert.alert(
              'Performance Analytics',
              'This page displays sample academic records and leaderboard data.'
            )
          }
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="information-circle-outline" size={21} color={COLORS.navy} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 35 }}
      >
        {/* Hero */}
        <LinearGradient
          colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 26,
            borderWidth: 1,
            borderColor: '#E4E9FA',
            padding: 20,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 125,
              height: 125,
              borderRadius: 70,
              backgroundColor: '#DDE5FF',
              opacity: 0.55,
              right: -35,
              top: -45,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 75,
              height: 75,
              borderRadius: 45,
              backgroundColor: '#E8DFFF',
              opacity: 0.65,
              right: 45,
              bottom: -42,
            }}
          />

          <View className="flex-row items-center justify-between">
            <View
              style={{
                backgroundColor: '#FFFFFFCC',
                borderRadius: 30,
                paddingHorizontal: 11,
                paddingVertical: 7,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="analytics-outline" size={14} color={COLORS.blue} />
              <Text style={{ color: COLORS.blue, fontSize: 10, fontWeight: '800', marginLeft: 6 }}>
                ACADEMIC INSIGHTS
              </Text>
            </View>
            <Ionicons name="school-outline" size={32} color="#8290D9" />
          </View>

          <Text style={{ color: COLORS.navy, fontSize: 25, fontWeight: '900', marginTop: 20 }}>
            Your progress,
          </Text>
          <Text style={{ color: COLORS.navy, fontSize: 25, fontWeight: '900' }}>
            your achievement.
          </Text>
          <Text style={{ color: COLORS.muted, fontSize: 12, lineHeight: 19, marginTop: 8, maxWidth: 250 }}>
            Understand your academic growth and discover where you can improve.
          </Text>

          <View className="flex-row items-center mt-5">
            <View
              style={{
                backgroundColor: '#FFFFFFD9',
                paddingHorizontal: 13,
                paddingVertical: 10,
                borderRadius: 15,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="trophy" size={17} color={COLORS.orange} />
              <Text style={{ color: COLORS.navy, fontSize: 12, fontWeight: '800', marginLeft: 7 }}>
                Semester {selectedSemester}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 9,
                backgroundColor: '#FFFFFFD9',
                paddingHorizontal: 13,
                paddingVertical: 10,
                borderRadius: 15,
              }}
            >
              <Text style={{ color: COLORS.muted, fontSize: 10 }}>Current CGPA</Text>
              <Text style={{ color: COLORS.navy, fontSize: 16, fontWeight: '900', marginTop: 2 }}>
                {current.cgpa.toFixed(2)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Semester selector */}
        <SectionTitle
          title="Select semester"
          subtitle="View your academic performance by semester"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 19 }}
        >
          {semesterData.map(item => {
            const selected = selectedSemester === item.semester;
            return (
              <Pressable
                key={item.semester}
                onPress={() => setSelectedSemester(item.semester)}
                style={{
                  paddingHorizontal: 19,
                  paddingVertical: 12,
                  borderRadius: 14,
                  marginRight: 9,
                  backgroundColor: selected ? COLORS.blue : COLORS.white,
                  borderWidth: 1,
                  borderColor: selected ? COLORS.blue : COLORS.border,
                }}
              >
                <Text
                  style={{
                    color: selected ? COLORS.white : COLORS.muted,
                    fontWeight: '800',
                    fontSize: 12,
                  }}
                >
                  Sem {item.semester}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Main statistics */}
        <View className="flex-row gap-3 mb-3">
          <StatCard
            icon="school-outline"
            label="Semester CGPA"
            value={current.cgpa.toFixed(2)}
            helper="Grade point average"
            tint={COLORS.paleBlue}
            iconColor={COLORS.blue}
          />
          <StatCard
            icon="trending-up-outline"
            label="Percentage"
            value={`${current.percentage}%`}
            helper="Academic score"
            tint={COLORS.paleGreen}
            iconColor={COLORS.green}
          />
        </View>

        <View className="flex-row gap-3 mb-6">
          <StatCard
            icon="clipboard-outline"
            label="Internal average"
            value={`${averageInternal}/30`}
            helper="Across all subjects"
            tint={COLORS.palePurple}
            iconColor={COLORS.purple}
          />
          <StatCard
            icon="calendar-outline"
            label="Attendance"
            value={`${averageAttendance}%`}
            helper="Semester average"
            tint={COLORS.paleOrange}
            iconColor={COLORS.orange}
          />
        </View>

        {/* Tabs */}
        <View
          style={{
            backgroundColor: '#ECEFF6',
            padding: 4,
            borderRadius: 15,
            flexDirection: 'row',
            marginBottom: 21,
          }}
        >
          {(['overview', 'subjects'] as const).map(tab => {
            const selected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 12,
                  backgroundColor: selected ? COLORS.white : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: selected ? COLORS.navy : COLORS.muted,
                    fontWeight: '800',
                    fontSize: 12,
                  }}
                >
                  {tab === 'overview' ? 'Overview' : 'Subject analysis'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'overview' ? (
          <>
            {/* Performance trend */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 22,
                padding: 17,
                marginBottom: 18,
              }}
            >
              <SectionTitle
                title="Performance growth"
                subtitle="Semester-wise academic percentage"
              />

              <View className="flex-row items-end justify-between" style={{ height: 150, paddingTop: 10 }}>
                {trendData.map(item => {
                  const isSelected = item.label === `Sem ${selectedSemester}`;
                  return (
                    <View
                      key={item.label}
                      style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
                    >
                      <Text style={{ color: COLORS.navy, fontSize: 10, fontWeight: '800', marginBottom: 7 }}>
                        {item.value}%
                      </Text>
                      <View
                        style={{
                          height: `${item.value}%`,
                          width: 23,
                          maxHeight: 112,
                          minHeight: 12,
                          borderRadius: 8,
                          backgroundColor: isSelected ? COLORS.purple : '#DCE3FA',
                        }}
                      />
                      <Text style={{ color: COLORS.muted, fontSize: 9, marginTop: 8, fontWeight: '700' }}>
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View className="flex-row items-center mt-4">
                <View style={{ width: 8, height: 8, borderRadius: 5, backgroundColor: COLORS.purple }} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 6 }}>
                  Selected semester
                </Text>
                <View style={{ width: 8, height: 8, borderRadius: 5, backgroundColor: '#DCE3FA', marginLeft: 17 }} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 6 }}>
                  Other semesters
                </Text>
              </View>
            </View>

            {/* Top 3 performers */}
            <TopPerformersSection semester={selectedSemester} />

            {/* Highlights */}
            <SectionTitle
              title="Academic highlights"
              subtitle="A quick look at your performance"
            />

            <View className="flex-row gap-3 mb-3">
              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.paleGreen,
                  borderRadius: 18,
                  padding: 15,
                }}
              >
                <Ionicons name="ribbon-outline" size={22} color={COLORS.green} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 12 }}>
                  Highest scoring subject
                </Text>
                <Text style={{ color: COLORS.navy, fontSize: 14, fontWeight: '900', marginTop: 5 }}>
                  {highestSubject.name}
                </Text>
                <Text style={{ color: COLORS.green, fontSize: 12, fontWeight: '800', marginTop: 6 }}>
                  {highestSubject.total}/100
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.paleOrange,
                  borderRadius: 18,
                  padding: 15,
                }}
              >
                <Ionicons name="bulb-outline" size={22} color={COLORS.orange} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 12 }}>
                  Focus area
                </Text>
                <Text style={{ color: COLORS.navy, fontSize: 14, fontWeight: '900', marginTop: 5 }}>
                  {lowestSubject.name}
                </Text>
                <Text style={{ color: COLORS.orange, fontSize: 12, fontWeight: '800', marginTop: 6 }}>
                  {lowestSubject.total}/100
                </Text>
              </View>
            </View>

            {/* Insights */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 21,
                padding: 17,
                marginTop: 15,
                marginBottom: 18,
              }}
            >
              <SectionTitle title="Your performance insights" subtitle="Suggestions based on this semester's sample scores" />

              <View className="flex-row items-start mb-4">
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.paleGreen, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                </View>
                <View className="flex-1 ml-3">
                  <Text style={{ color: COLORS.navy, fontWeight: '800', fontSize: 12 }}>
                    Strong academic performance
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 4 }}>
                    Your semester percentage is {current.percentage}%. Keep following your current study routine.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start mb-4">
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.paleBlue, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.blue} />
                </View>
                <View className="flex-1 ml-3">
                  <Text style={{ color: COLORS.navy, fontWeight: '800', fontSize: 12 }}>
                    Maintain attendance
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 4 }}>
                    Your average attendance is {averageAttendance}%. Continue attending classes regularly.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.paleOrange, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="book-outline" size={18} color={COLORS.orange} />
                </View>
                <View className="flex-1 ml-3">
                  <Text style={{ color: COLORS.navy, fontWeight: '800', fontSize: 12 }}>
                    Give extra attention to {lowestSubject.name}
                  </Text>
                  <Text style={{ color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 4 }}>
                    Review important topics and practise previous question papers to improve your score.
                  </Text>
                </View>
              </View>
            </View>

            {/* CGPA overview */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 21,
                padding: 17,
              }}
            >
              <SectionTitle title="Academic journey" subtitle="Your CGPA progress across completed semesters" />
              <View className="flex-row items-center justify-between">
                <View>
                  <Text style={{ color: COLORS.muted, fontSize: 11 }}>Previous semester average</Text>
                  <Text style={{ color: COLORS.navy, fontSize: 26, fontWeight: '900', marginTop: 5 }}>
                    {allTimeAverage}
                  </Text>
                </View>
                <View style={{ backgroundColor: COLORS.paleGreen, borderRadius: 13, padding: 11 }}>
                  <Ionicons name="trending-up" size={24} color={COLORS.green} />
                </View>
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 10 }}>
                Based on the semester records displayed in this sample.
              </Text>
            </View>
          </>
        ) : (
          <>
            {/* Subject analysis */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 22,
                padding: 17,
                marginBottom: 18,
              }}
            >
              <SectionTitle
                title="Subject performance"
                subtitle={`Marks breakdown for semester ${selectedSemester}`}
              />

              {current.subjects.map((subject, index) => {
                const color = getScoreColor(subject.total);
                return (
                  <View
                    key={subject.code}
                    style={{
                      paddingVertical: 14,
                      borderBottomWidth: index === current.subjects.length - 1 ? 0 : 1,
                      borderBottomColor: COLORS.border,
                    }}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1 pr-3">
                        <Text style={{ color: COLORS.muted, fontSize: 9, fontWeight: '800' }}>
                          {subject.code}
                        </Text>
                        <Text style={{ color: COLORS.navy, fontSize: 13, fontWeight: '800', marginTop: 4 }}>
                          {subject.name}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color, fontSize: 18, fontWeight: '900' }}>
                          {subject.total}%
                        </Text>
                        <Text style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}>
                          Grade {subject.grade}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        height: 8,
                        borderRadius: 10,
                        backgroundColor: '#EDF0F6',
                        marginTop: 12,
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          height: '100%',
                          width: `${subject.total}%`,
                          backgroundColor: color,
                          borderRadius: 10,
                        }}
                      />
                    </View>

                    <View className="flex-row justify-between mt-3">
                      <Text style={{ color: COLORS.muted, fontSize: 10 }}>
                        Internal: {subject.internal}/30
                      </Text>
                      <Text style={{ color: COLORS.muted, fontSize: 10 }}>
                        External: {subject.external}/70
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={12} color={COLORS.muted} />
                        <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 5 }}>
                          Attendance {subject.attendance}%
                        </Text>
                      </View>
                      <Text style={{ color: COLORS.navy, fontSize: 10, fontWeight: '800' }}>
                        {subject.total}/100 marks
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Marks comparison */}
            <View
              style={{
                backgroundColor: COLORS.white,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 22,
                padding: 17,
                marginBottom: 18,
              }}
            >
              <SectionTitle
                title="Internal vs external"
                subtitle="Compare your marks in each subject"
              />

              <View className="flex-row items-center mb-4">
                <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.blue }} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 6 }}>Internal marks</Text>
                <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.purple, marginLeft: 16 }} />
                <Text style={{ color: COLORS.muted, fontSize: 10, marginLeft: 6 }}>External marks</Text>
              </View>

              {current.subjects.map(subject => (
                <View key={subject.code} className="mb-4">
                  <Text style={{ color: COLORS.navy, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
                    {subject.code}
                  </Text>
                  <View className="flex-row items-center">
                    <View style={{ flex: 1, height: 9, backgroundColor: '#EDF0F6', borderRadius: 10, overflow: 'hidden' }}>
                      <View style={{ width: `${(subject.internal / 30) * 100}%`, height: '100%', backgroundColor: COLORS.blue, borderRadius: 10 }} />
                    </View>
                    <Text style={{ color: COLORS.muted, fontSize: 10, width: 35, textAlign: 'right' }}>
                      {subject.internal}/30
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <View style={{ flex: 1, height: 9, backgroundColor: '#EDF0F6', borderRadius: 10, overflow: 'hidden' }}>
                      <View style={{ width: `${(subject.external / 70) * 100}%`, height: '100%', backgroundColor: COLORS.purple, borderRadius: 10 }} />
                    </View>
                    <Text style={{ color: COLORS.muted, fontSize: 10, width: 35, textAlign: 'right' }}>
                      {subject.external}/70
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Attendance comparison */}
            <View
              style={{
                backgroundColor: COLORS.paleBlue,
                borderRadius: 20,
                padding: 17,
                borderWidth: 1,
                borderColor: '#E1E8FF',
              }}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color={COLORS.blue} />
                <Text style={{ color: COLORS.navy, fontSize: 14, fontWeight: '900', marginLeft: 8 }}>
                  Attendance comparison
                </Text>
              </View>
              <Text style={{ color: COLORS.muted, fontSize: 11, marginTop: 7, lineHeight: 17 }}>
                Your average attendance for this semester is {averageAttendance}%. Attendance and marks are displayed together to help you review your academic habits.
              </Text>
              <Pressable
                onPress={() => router.push('/student/attendance')}
                style={{
                  marginTop: 14,
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  paddingVertical: 11,
                  paddingHorizontal: 13,
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.blue, fontSize: 11, fontWeight: '800' }}>
                  View attendance
                </Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.blue} style={{ marginLeft: 7 }} />
              </Pressable>
            </View>
          </>
        )}

        <Text style={{ color: COLORS.muted, fontSize: 10, textAlign: 'center', marginTop: 22, lineHeight: 16 }}>
          Academic scores and leaderboard entries shown are sample data. Connect your college records to display official results.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
