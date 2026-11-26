
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

type Exam = {
  id: string;
  subject: string;
  code: string;
  date: string;
  startTime: string;
  endTime: string;
  reportingTime: string;
  duration: string;
  room: string;
  building: string;
  seat: string;
  faculty: string;
  type: string;
  maxMarks: number;
  passMarks: number;
  syllabus: string[];
  instructions: string[];
  requiredItems: string[];
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
};

const EXAMS: Exam[] = [
  {
    id: '1',
    subject: 'Data Structures',
    code: 'CS501',
    date: '2026-11-10',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    reportingTime: '09:00 AM',
    duration: '3 Hours',
    room: 'Hall 204',
    building: 'Block B',
    seat: 'B-24',
    faculty: 'Dr. Priya Sharma',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Arrays, linked lists and stacks',
      'Queues and circular queues',
      'Trees and binary search trees',
      'Graphs and graph traversal',
      'Sorting and searching algorithms',
    ],
    instructions: [
      'Carry your college ID card.',
      'Reach the examination hall 30 minutes early.',
      'Write your register number clearly.',
      'Electronic devices are not permitted.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'git-network-outline',
    color: '#6478E8',
    tint: '#EEF1FF',
  },
  {
    id: '2',
    subject: 'Database Management Systems',
    code: 'CS502',
    date: '2026-11-12',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    reportingTime: '09:00 AM',
    duration: '3 Hours',
    room: 'Hall 102',
    building: 'Block A',
    seat: 'A-18',
    faculty: 'Prof. Arun Kumar',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Database concepts and architecture',
      'ER diagrams and relational models',
      'SQL queries and joins',
      'Normalization',
      'Transactions and concurrency control',
    ],
    instructions: [
      'Carry your college ID card.',
      'Arrive before the reporting time.',
      'Follow the examination hall instructions.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'server-outline',
    color: '#299B82',
    tint: '#EAF8F3',
  },
  {
    id: '3',
    subject: 'Operating Systems',
    code: 'CS503',
    date: '2026-11-15',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    reportingTime: '01:00 PM',
    duration: '3 Hours',
    room: 'Hall 205',
    building: 'Block B',
    seat: 'B-31',
    faculty: 'Dr. Karthik Raj',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Operating system fundamentals',
      'Process and thread management',
      'CPU scheduling algorithms',
      'Memory management',
      'Deadlocks and file systems',
    ],
    instructions: [
      'Carry your college ID card.',
      'Check your seat number before entering.',
      'Do not bring electronic devices.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'desktop-outline',
    color: '#A17AD8',
    tint: '#F3EEFC',
  },
  {
    id: '4',
    subject: 'Computer Networks',
    code: 'CS504',
    date: '2026-11-18',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    reportingTime: '09:00 AM',
    duration: '3 Hours',
    room: 'Hall 301',
    building: 'Block C',
    seat: 'C-12',
    faculty: 'Prof. Meena Devi',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Network models and topologies',
      'OSI and TCP/IP models',
      'IP addressing and subnetting',
      'Routing and switching',
      'Transport and application layer',
    ],
    instructions: [
      'Carry your college ID card.',
      'Reach the hall 30 minutes early.',
      'Bring permitted stationery only.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'wifi-outline',
    color: '#D99435',
    tint: '#FFF5E8',
  },
  {
    id: '5',
    subject: 'Software Engineering',
    code: 'CS505',
    date: '2026-11-21',
    startTime: '01:30 PM',
    endTime: '04:30 PM',
    reportingTime: '01:00 PM',
    duration: '3 Hours',
    room: 'Hall 105',
    building: 'Block A',
    seat: 'A-22',
    faculty: 'Dr. Naveen Kumar',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Software development life cycle',
      'Requirement analysis and specification',
      'Software design principles',
      'Testing and quality assurance',
      'Project planning and management',
    ],
    instructions: [
      'Carry your college ID card.',
      'Be seated before the examination begins.',
      'Follow the invigilator instructions.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'code-slash-outline',
    color: '#D66F86',
    tint: '#FFF0F3',
  },
  {
    id: '6',
    subject: 'Professional Communication',
    code: 'HS506',
    date: '2026-11-24',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    reportingTime: '09:00 AM',
    duration: '3 Hours',
    room: 'Hall 302',
    building: 'Block C',
    seat: 'C-08',
    faculty: 'Prof. Anitha Rao',
    type: 'Theory',
    maxMarks: 100,
    passMarks: 40,
    syllabus: [
      'Communication fundamentals',
      'Written and verbal communication',
      'Presentation skills',
      'Group discussions and interviews',
      'Professional email writing',
    ],
    instructions: [
      'Carry your college ID card.',
      'Maintain silence inside the hall.',
      'Arrive at least 30 minutes early.',
    ],
    requiredItems: ['College ID card', 'Blue or black pens', 'Pencil and eraser'],
    icon: 'chatbubbles-outline',
    color: '#5C91C9',
    tint: '#EDF5FF',
  },
];

const CHECKLIST = [
  'Revise important topics',
  'Complete previous question papers',
  'Prepare notes and formulas',
  'Clear doubts with faculty',
  'Keep college ID card ready',
  'Arrange stationery',
];

const parseDate = (date: string) => new Date(`${date}T00:00:00`);

const formatDate = (date: string) =>
  parseDate(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const getDay = (date: string) =>
  parseDate(date).toLocaleDateString('en-IN', { day: '2-digit' });

const getMonth = (date: string) =>
  parseDate(date).toLocaleDateString('en-IN', { month: 'short' });

const getStatus = (date: string) => {
  const examDate = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (examDate < today) return 'Completed';
  if (examDate.getTime() === today.getTime()) return 'Today';
  return 'Upcoming';
};

const getDaysRemaining = (date: string) => {
  const examDate = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((examDate.getTime() - today.getTime()) / 86400000);
};

export default function ExamTimetableScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sortedExams = useMemo(
    () => [...EXAMS].sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );

  const upcomingExams = sortedExams.filter(
    (exam) => getStatus(exam.date) !== 'Completed',
  );

  const nextExam = upcomingExams[0];

  const completedCount = sortedExams.filter(
    (exam) => getStatus(exam.date) === 'Completed',
  ).length;

  const filteredExams = sortedExams.filter((exam) => {
    const matchesSearch =
      exam.subject.toLowerCase().includes(search.toLowerCase()) ||
      exam.code.toLowerCase().includes(search.toLowerCase());

    const status = getStatus(exam.date);
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Upcoming' && status !== 'Completed') ||
      (filter === 'Completed' && status === 'Completed');

    const matchesDate = !selectedDate || exam.date === selectedDate;

    return matchesSearch && matchesFilter && matchesDate;
  });

  const checklistProgress = Math.round(
    (checkedItems.length / CHECKLIST.length) * 100,
  );

  const toggleChecklist = (item: string) => {
    setCheckedItems((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item],
    );
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/student');
  };

  const openExam = (exam: Exam) => setSelectedExam(exam);

  const renderExamCard = (exam: Exam) => {
    const status = getStatus(exam.date);
    const days = getDaysRemaining(exam.date);

    return (
      <Pressable
        key={exam.id}
        onPress={() => openExam(exam)}
        className="mb-3 rounded-[24px] border border-[#E9EDF5] bg-white p-4"
        style={{
          shadowColor: '#202B49',
          shadowOpacity: 0.035,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 5 },
          elevation: 1,
        }}
      >
        <View className="flex-row items-center">
          <View
            className="h-[56px] w-[56px] items-center justify-center rounded-[18px]"
            style={{ backgroundColor: exam.tint }}
          >
            <Ionicons name={exam.icon} size={24} color={exam.color} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[14px] font-bold text-[#202B49]">
              {exam.subject}
            </Text>
            <Text className="mt-1 text-[10px] font-medium text-[#929BAD]">
              {exam.code} · {exam.type} examination
            </Text>
          </View>

          <View
            className="rounded-full px-3 py-1.5"
            style={{
              backgroundColor:
                status === 'Completed'
                  ? '#EDF7F1'
                  : status === 'Today'
                    ? '#FFF3E4'
                    : '#EEF1FF',
            }}
          >
            <Text
              className="text-[9px] font-bold"
              style={{
                color:
                  status === 'Completed'
                    ? '#29966C'
                    : status === 'Today'
                      ? '#D18A32'
                      : '#6478E8',
              }}
            >
              {status}
            </Text>
          </View>
        </View>

        <View className="my-4 h-px bg-[#F0F2F7]" />

        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-xl bg-[#F4F5FA]">
            <Text className="text-[16px] font-bold text-[#6478E8]">
              {getDay(exam.date)}
            </Text>
            <Text className="text-[8px] font-bold text-[#929BAD]">
              {getMonth(exam.date).toUpperCase()}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-[12px] font-bold text-[#39445F]">
              {formatDate(exam.date)}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="time-outline" size={12} color="#929BAD" />
              <Text className="ml-1 text-[10px] text-[#929BAD]">
                {exam.startTime} – {exam.endTime}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-[12px] font-bold text-[#6478E8]">
              {status === 'Completed'
                ? 'Finished'
                : days === 0
                  ? 'Today'
                  : `${days} days`}
            </Text>
            <Text className="mt-1 text-[9px] text-[#929BAD]">
              {status === 'Completed' ? 'Completed' : 'Remaining'}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row">
          <View className="mr-2 flex-1 flex-row items-center rounded-xl bg-[#F8F9FC] px-2.5 py-2.5">
            <Ionicons name="location-outline" size={14} color="#6478E8" />
            <Text className="ml-1.5 flex-1 text-[10px] font-medium text-[#68738A]">
              {exam.building} · {exam.room}
            </Text>
          </View>
          <View className="flex-row items-center rounded-xl bg-[#F8F9FC] px-3 py-2.5">
            <Ionicons name="ticket-outline" size={14} color="#6478E8" />
            <Text className="ml-1.5 text-[10px] font-bold text-[#6478E8]">
              {exam.seat}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={13} color="#929BAD" />
            <Text className="ml-1.5 text-[10px] text-[#929BAD]">
              {exam.maxMarks} marks · {exam.duration}
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
              style={{ marginLeft: 3 }}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FC]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
          <View className="flex-row items-center">
            <Pressable
              onPress={goBack}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
            >
              <Ionicons name="arrow-back" size={20} color="#202B49" />
            </Pressable>
            <View>
              <Text className="text-[10px] font-bold tracking-[2px] text-[#8992A6]">
                CAMPUSOS
              </Text>
              <Text className="mt-1 text-[21px] font-bold text-[#202B49]">
                Exam timetable
              </Text>
            </View>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF1FF]">
            <Ionicons name="calendar-outline" size={21} color="#6478E8" />
          </View>
        </View>

        {/* Hero */}
        <View className="px-5">
          <LinearGradient
            colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 27,
              borderWidth: 1,
              borderColor: '#E4E9FA',
              padding: 20,
              overflow: 'hidden',
            }}
          >
            <View className="absolute right-[-22px] top-[-25px] h-36 w-36 rounded-full bg-[#DDE5FF] opacity-50" />
            <View className="absolute bottom-[-40px] right-[75px] h-28 w-28 rounded-full bg-[#E9DFFF] opacity-50" />

            <View className="flex-row items-center justify-between">
              <View className="rounded-full border border-[#DCE4FA] bg-white/70 px-3 py-1.5">
                <Text className="text-[9px] font-bold tracking-[1.2px] text-[#6478E8]">
                  SEMESTER 5 · EXAM SCHEDULE
                </Text>
              </View>
              <Ionicons name="school-outline" size={26} color="#8795D8" />
            </View>

            <Text className="mt-5 text-[24px] font-bold leading-[31px] text-[#202B49]">
              Be prepared.{"\n"}Stay ahead.
            </Text>
            <Text className="mt-2 max-w-[260px] text-[12px] leading-5 text-[#7D879C]">
              Your complete examination plan, important details and preparation progress.
            </Text>

            <View className="mt-5 flex-row">
              {[
                {
                  value: String(EXAMS.length),
                  label: 'Total exams',
                  icon: 'calendar-outline' as const,
                },
                {
                  value: String(upcomingExams.length),
                  label: 'Upcoming',
                  icon: 'time-outline' as const,
                },
                {
                  value: String(completedCount),
                  label: 'Completed',
                  icon: 'checkmark-circle-outline' as const,
                },
              ].map((item, index) => (
                <View
                  key={item.label}
                  className="mr-2 flex-1 rounded-2xl border border-white/80 bg-white/75 p-3"
                >
                  <Ionicons
                    name={item.icon}
                    size={17}
                    color={index === 2 ? '#299B82' : '#6478E8'}
                  />
                  <Text className="mt-2 text-[21px] font-bold text-[#202B49]">
                    {item.value}
                  </Text>
                  <Text className="mt-0.5 text-[9px] font-medium text-[#8992A6]">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Next exam */}
        {nextExam && (
          <View className="px-5 pt-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-[16px] font-bold text-[#202B49]">
                Next examination
              </Text>
              <View className="rounded-full bg-[#EEF1FF] px-3 py-1.5">
                <Text className="text-[9px] font-bold text-[#6478E8]">
                  UP NEXT
                </Text>
              </View>
            </View>

            <LinearGradient
              colors={['#FFFFFF', '#F3F1FF', '#EEF3FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#E5E8F6',
                padding: 17,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: nextExam.tint }}
                >
                  <Ionicons name={nextExam.icon} size={23} color={nextExam.color} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-[14px] font-bold text-[#202B49]">
                    {nextExam.subject}
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    {nextExam.code} · {nextExam.type}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-[24px] font-bold text-[#6478E8]">
                    {getDaysRemaining(nextExam.date) === 0
                      ? 'Today'
                      : getDaysRemaining(nextExam.date)}
                  </Text>
                  <Text className="text-[9px] font-semibold text-[#8992A6]">
                    {getDaysRemaining(nextExam.date) === 0
                      ? 'EXAM DAY'
                      : 'DAYS LEFT'}
                  </Text>
                </View>
              </View>

              <View className="my-4 h-px bg-[#E8EAF3]" />

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={15} color="#6478E8" />
                  <Text className="ml-2 text-[10px] font-semibold text-[#59647B]">
                    {formatDate(nextExam.date)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={15} color="#6478E8" />
                  <Text className="ml-2 text-[10px] font-semibold text-[#59647B]">
                    {nextExam.startTime}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row items-center rounded-xl bg-white/80 px-3 py-2.5">
                <Ionicons name="alert-circle-outline" size={15} color="#D99435" />
                <Text className="ml-2 text-[10px] font-semibold text-[#68738A]">
                  Reporting time: {nextExam.reportingTime}
                </Text>
              </View>

              <Pressable
                onPress={() => openExam(nextExam)}
                className="mt-4 flex-row items-center justify-center rounded-xl bg-[#6478E8] py-3"
              >
                <Text className="text-[11px] font-bold text-white">
                  View complete details
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={15}
                  color="white"
                  style={{ marginLeft: 7 }}
                />
              </Pressable>
            </LinearGradient>
          </View>
        )}

        {/* Date calendar */}
        <View className="px-5 pt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[17px] font-bold text-[#202B49]">
                Exam calendar
              </Text>
              <Text className="mt-1 text-[10px] text-[#8992A6]">
                Select a date to view its examination
              </Text>
            </View>
            {selectedDate && (
              <Pressable onPress={() => setSelectedDate(null)}>
                <Text className="text-[10px] font-bold text-[#6478E8]">
                  Clear date
                </Text>
              </Pressable>
            )}
          </View>

          <View className="rounded-[23px] border border-[#E9EDF5] bg-white p-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sortedExams.map((exam) => {
                const active = selectedDate === exam.date;
                const status = getStatus(exam.date);

                return (
                  <Pressable
                    key={exam.id}
                    onPress={() =>
                      setSelectedDate(active ? null : exam.date)
                    }
                    className="mr-2.5 items-center rounded-2xl px-3.5 py-3"
                    style={{
                      backgroundColor: active ? '#6478E8' : '#F6F7FB',
                      minWidth: 61,
                    }}
                  >
                    <Text
                      className="text-[9px] font-semibold"
                      style={{ color: active ? '#FFFFFF' : '#929BAD' }}
                    >
                      {parseDate(exam.date).toLocaleDateString('en-IN', {
                        weekday: 'short',
                      }).toUpperCase()}
                    </Text>
                    <Text
                      className="mt-1 text-[18px] font-bold"
                      style={{ color: active ? '#FFFFFF' : '#202B49' }}
                    >
                      {getDay(exam.date)}
                    </Text>
                    <Text
                      className="mt-0.5 text-[9px] font-semibold"
                      style={{ color: active ? '#E5E9FF' : '#929BAD' }}
                    >
                      {getMonth(exam.date)}
                    </Text>
                    <View
                      className="mt-2 h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: active
                          ? '#FFFFFF'
                          : status === 'Completed'
                            ? '#299B82'
                            : '#6478E8',
                      }}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="mt-4 flex-row items-center justify-between border-t border-[#F0F2F7] pt-3">
              <View className="flex-row items-center">
                <View className="mr-1.5 h-2 w-2 rounded-full bg-[#6478E8]" />
                <Text className="text-[9px] text-[#8992A6]">Upcoming</Text>
              </View>
              <View className="flex-row items-center">
                <View className="mr-1.5 h-2 w-2 rounded-full bg-[#299B82]" />
                <Text className="text-[9px] text-[#8992A6]">Completed</Text>
              </View>
              <Text className="text-[9px] text-[#8992A6]">
                {sortedExams.length} scheduled dates
              </Text>
            </View>
          </View>
        </View>

        {/* All exams */}
        <View className="px-5 pt-6">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-[17px] font-bold text-[#202B49]">
                All examinations
              </Text>
              <Text className="mt-1 text-[10px] text-[#8992A6]">
                Subject-wise schedule and venue details
              </Text>
            </View>
            <View className="rounded-xl bg-white px-3 py-2">
              <Text className="text-[10px] font-bold text-[#6478E8]">
                {filteredExams.length} EXAMS
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white px-4">
            <Ionicons name="search-outline" size={18} color="#929BAD" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search subject or subject code..."
              placeholderTextColor="#A5ADBC"
              className="ml-2 h-[49px] flex-1 text-[12px] text-[#202B49]"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color="#A5ADBC" />
              </Pressable>
            )}
          </View>

          <View className="mb-4 flex-row rounded-2xl bg-[#ECEFF6] p-1">
            {['All', 'Upcoming', 'Completed'].map((item) => (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className="flex-1 items-center rounded-xl py-2.5"
                style={{
                  backgroundColor: filter === item ? '#FFFFFF' : 'transparent',
                  shadowColor: '#202B49',
                  shadowOpacity: filter === item ? 0.06 : 0,
                  shadowRadius: 5,
                  elevation: filter === item ? 1 : 0,
                }}
              >
                <Text
                  className="text-[11px] font-bold"
                  style={{ color: filter === item ? '#6478E8' : '#8992A6' }}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          {filteredExams.length > 0 ? (
            filteredExams.map(renderExamCard)
          ) : (
            <View className="items-center rounded-3xl border border-[#E9EDF5] bg-white px-5 py-10">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1FF]">
                <Ionicons name="calendar-clear-outline" size={25} color="#6478E8" />
              </View>
              <Text className="mt-3 text-[14px] font-bold text-[#202B49]">
                No exams found
              </Text>
              <Text className="mt-1 text-center text-[11px] text-[#8992A6]">
                Try another search or clear the selected date.
              </Text>
              <Pressable
                onPress={() => {
                  setSearch('');
                  setFilter('All');
                  setSelectedDate(null);
                }}
                className="mt-4 rounded-xl bg-[#EEF1FF] px-4 py-2.5"
              >
                <Text className="text-[10px] font-bold text-[#6478E8]">
                  Reset filters
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Preparation tracker */}
        <View className="px-5 pt-6">
          <View className="mb-3">
            <Text className="text-[17px] font-bold text-[#202B49]">
              Preparation tracker
            </Text>
            <Text className="mt-1 text-[10px] text-[#8992A6]">
              Keep track of your exam readiness
            </Text>
          </View>

          <View className="rounded-[24px] border border-[#E9EDF5] bg-white p-4">
            <LinearGradient
              colors={['#EEF3FF', '#F4F0FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 18,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-[13px] font-bold text-[#202B49]">
                    Your preparation progress
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    {checkedItems.length} of {CHECKLIST.length} tasks completed
                  </Text>
                </View>
                <Text className="text-[22px] font-bold text-[#6478E8]">
                  {checklistProgress}%
                </Text>
              </View>

              <View className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <View
                  className="h-full rounded-full bg-[#6478E8]"
                  style={{ width: `${checklistProgress}%` }}
                />
              </View>
            </LinearGradient>

            {CHECKLIST.map((item, index) => {
              const checked = checkedItems.includes(item);

              return (
                <Pressable
                  key={item}
                  onPress={() => toggleChecklist(item)}
                  className="flex-row items-center py-3"
                >
                  <View
                    className="mr-3 h-[22px] w-[22px] items-center justify-center rounded-lg border"
                    style={{
                      backgroundColor: checked ? '#6478E8' : '#FFFFFF',
                      borderColor: checked ? '#6478E8' : '#DDE2EC',
                    }}
                  >
                    {checked && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <Text
                    className="flex-1 text-[12px] font-medium"
                    style={{
                      color: checked ? '#A0A8B7' : '#4F5B72',
                      textDecorationLine: checked ? 'line-through' : 'none',
                    }}
                  >
                    {item}
                  </Text>
                  <Text className="text-[10px] text-[#A0A8B7]">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Exam tips */}
        <View className="px-5 pt-5">
          <LinearGradient
            colors={['#F4F0FF', '#EEF3FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 22,
              borderWidth: 1,
              borderColor: '#E7E7F6',
              padding: 16,
            }}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="bulb-outline" size={22} color="#8A78C9" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[13px] font-bold text-[#202B49]">
                  Exam day tip
                </Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#8992A6]">
                  Check your reporting time, seat number and required items before leaving for college.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Detailed exam modal */}
      <Modal
        visible={selectedExam !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedExam(null)}
      >
        <View className="flex-1 justify-end bg-[#17213A]/40">
          <Pressable
            className="flex-1"
            onPress={() => setSelectedExam(null)}
          />

          {selectedExam && (
            <View className="max-h-[90%] rounded-t-[30px] bg-[#F8F9FC] px-5 pb-8 pt-3">
              <View className="mb-4 items-center">
                <View className="h-1.5 w-11 rounded-full bg-[#DDE1EA]" />
              </View>

              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-[18px] font-bold text-[#202B49]">
                    Examination details
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    Complete information for your exam
                  </Text>
                </View>
                <Pressable
                  onPress={() => setSelectedExam(null)}
                  className="h-9 w-9 items-center justify-center rounded-full bg-white"
                >
                  <Ionicons name="close" size={20} color="#202B49" />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Subject heading */}
                <LinearGradient
                  colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 22,
                    borderWidth: 1,
                    borderColor: '#E4E9FA',
                    padding: 17,
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: selectedExam.tint }}
                    >
                      <Ionicons
                        name={selectedExam.icon}
                        size={24}
                        color={selectedExam.color}
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[16px] font-bold text-[#202B49]">
                        {selectedExam.subject}
                      </Text>
                      <Text className="mt-1 text-[10px] text-[#8992A6]">
                        {selectedExam.code} · {selectedExam.type}
                      </Text>
                    </View>
                    <View className="rounded-full bg-white px-3 py-1.5">
                      <Text className="text-[9px] font-bold text-[#6478E8]">
                        {getStatus(selectedExam.date)}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row">
                    <View className="mr-2 flex-1 rounded-xl bg-white/80 p-3">
                      <Text className="text-[9px] text-[#929BAD]">Maximum marks</Text>
                      <Text className="mt-1 text-[18px] font-bold text-[#202B49]">
                        {selectedExam.maxMarks}
                      </Text>
                    </View>
                    <View className="flex-1 rounded-xl bg-white/80 p-3">
                      <Text className="text-[9px] text-[#929BAD]">Pass marks</Text>
                      <Text className="mt-1 text-[18px] font-bold text-[#299B82]">
                        {selectedExam.passMarks}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Date and timing */}
                <Text className="mb-3 mt-5 text-[14px] font-bold text-[#202B49]">
                  Date and timing
                </Text>

                {[
                  {
                    icon: 'calendar-outline' as const,
                    label: 'Examination date',
                    value: formatDate(selectedExam.date),
                  },
                  {
                    icon: 'time-outline' as const,
                    label: 'Exam timing',
                    value: `${selectedExam.startTime} – ${selectedExam.endTime}`,
                  },
                  {
                    icon: 'alarm-outline' as const,
                    label: 'Reporting time',
                    value: selectedExam.reportingTime,
                  },
                  {
                    icon: 'hourglass-outline' as const,
                    label: 'Duration',
                    value: selectedExam.duration,
                  },
                ].map((item) => (
                  <View
                    key={item.label}
                    className="mb-2 flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white p-3"
                  >
                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F1F3FC]">
                      <Ionicons name={item.icon} size={17} color="#6478E8" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] text-[#929BAD]">
                        {item.label}
                      </Text>
                      <Text className="mt-1 text-[12px] font-bold text-[#39445F]">
                        {item.value}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Venue */}
                <Text className="mb-3 mt-4 text-[14px] font-bold text-[#202B49]">
                  Venue and seating
                </Text>

                <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EEF1FF]">
                      <Ionicons name="business-outline" size={19} color="#6478E8" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] text-[#929BAD]">
                        Examination venue
                      </Text>
                      <Text className="mt-1 text-[13px] font-bold text-[#202B49]">
                        {selectedExam.building} · {selectedExam.room}
                      </Text>
                    </View>
                  </View>

                  <View className="my-3 h-px bg-[#F0F2F7]" />

                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#EAF8F3]">
                      <Ionicons name="ticket-outline" size={19} color="#299B82" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] text-[#929BAD]">
                        Your seat number
                      </Text>
                      <Text className="mt-1 text-[15px] font-bold text-[#299B82]">
                        {selectedExam.seat}
                      </Text>
                    </View>
                  </View>

                  <View className="my-3 h-px bg-[#F0F2F7]" />

                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#F3EEFC]">
                      <Ionicons name="person-outline" size={19} color="#A17AD8" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] text-[#929BAD]">
                        Faculty coordinator
                      </Text>
                      <Text className="mt-1 text-[12px] font-bold text-[#202B49]">
                        {selectedExam.faculty}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Syllabus */}
                <View className="mb-3 mt-5 flex-row items-center justify-between">
                  <Text className="text-[14px] font-bold text-[#202B49]">
                    Syllabus coverage
                  </Text>
                  <Text className="text-[10px] font-semibold text-[#6478E8]">
                    {selectedExam.syllabus.length} topics
                  </Text>
                </View>

                <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                  {selectedExam.syllabus.map((topic, index) => (
                    <View key={topic} className="mb-3 flex-row items-start">
                      <View className="mr-3 h-6 w-6 items-center justify-center rounded-lg bg-[#EEF1FF]">
                        <Text className="text-[9px] font-bold text-[#6478E8]">
                          {index + 1}
                        </Text>
                      </View>
                      <Text className="flex-1 pt-1 text-[11px] leading-4 text-[#59647B]">
                        {topic}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Required items */}
                <Text className="mb-3 mt-5 text-[14px] font-bold text-[#202B49]">
                  Required items
                </Text>

                <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                  {selectedExam.requiredItems.map((item) => (
                    <View key={item} className="mb-3 flex-row items-center">
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#299B82"
                      />
                      <Text className="ml-2 text-[11px] text-[#59647B]">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Instructions */}
                <Text className="mb-3 mt-5 text-[14px] font-bold text-[#202B49]">
                  Important instructions
                </Text>

                <View className="rounded-2xl border border-[#E9EDF5] bg-white p-4">
                  {selectedExam.instructions.map((instruction, index) => (
                    <View key={index} className="mb-3 flex-row items-start">
                      <View className="mr-2 mt-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#EEF1FF]">
                        <Ionicons name="information" size={12} color="#6478E8" />
                      </View>
                      <Text className="flex-1 text-[11px] leading-5 text-[#68738A]">
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  onPress={() => setSelectedExam(null)}
                  className="mb-4 mt-5 items-center rounded-2xl bg-[#6478E8] py-4"
                >
                  <Text className="text-[12px] font-bold text-white">
                    Close details
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
