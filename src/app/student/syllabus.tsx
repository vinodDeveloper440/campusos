
import React, { useMemo, useState } from 'react';
import {
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

type Subject = {
  id: string;
  name: string;
  code: string;
  faculty: string;
  credits: number;
  topics: string[];
};

type Semester = {
  id: number;
  label: string;
  status: string;
  subjects: Subject[];
};

const COLORS = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  border: '#E9EDF5',
  background: '#F7F9FD',
  green: '#23966B',
  orange: '#D99435',
  purple: '#9277D6',
};

const semesters: Semester[] = [
  {
    id: 1,
    label: 'Semester 1',
    status: 'Completed',
    subjects: [
      {
        id: 's1-1',
        name: 'Engineering Mathematics I',
        code: 'MA101',
        faculty: 'Mathematics Department',
        credits: 4,
        topics: [
          'Matrices and determinants',
          'Differential calculus',
          'Partial differentiation',
          'Applications of derivatives',
          'Multiple integrals',
        ],
      },
      {
        id: 's1-2',
        name: 'Engineering Physics',
        code: 'PH101',
        faculty: 'Physics Department',
        credits: 3,
        topics: [
          'Properties of matter',
          'Wave optics',
          'Quantum physics',
          'Semiconductor physics',
          'Applications of lasers',
        ],
      },
      {
        id: 's1-3',
        name: 'Engineering Chemistry',
        code: 'CH101',
        faculty: 'Chemistry Department',
        credits: 3,
        topics: [
          'Water technology',
          'Electrochemistry',
          'Corrosion and prevention',
          'Polymer chemistry',
          'Engineering materials',
        ],
      },
      {
        id: 's1-4',
        name: 'Programming Fundamentals',
        code: 'CS101',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Introduction to programming',
          'Variables and data types',
          'Control statements',
          'Functions and arrays',
          'Pointers and structures',
        ],
      },
      {
        id: 's1-5',
        name: 'Engineering Graphics',
        code: 'ME101',
        faculty: 'Mechanical Department',
        credits: 2,
        topics: [
          'Engineering drawing basics',
          'Geometrical constructions',
          'Projection of points',
          'Projection of solids',
          'Isometric projections',
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Semester 2',
    status: 'Completed',
    subjects: [
      {
        id: 's2-1',
        name: 'Engineering Mathematics II',
        code: 'MA201',
        faculty: 'Mathematics Department',
        credits: 4,
        topics: [
          'Differential equations',
          'Vector calculus',
          'Complex variables',
          'Laplace transforms',
          'Fourier series',
        ],
      },
      {
        id: 's2-2',
        name: 'Data Structures Fundamentals',
        code: 'CS201',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Introduction to data structures',
          'Arrays and linked lists',
          'Stacks and queues',
          'Trees and graphs',
          'Searching and sorting',
        ],
      },
      {
        id: 's2-3',
        name: 'Basic Electronics',
        code: 'EC201',
        faculty: 'Electronics Department',
        credits: 3,
        topics: [
          'Semiconductor devices',
          'Diodes and applications',
          'Bipolar junction transistors',
          'Field effect transistors',
          'Electronic circuits',
        ],
      },
      {
        id: 's2-4',
        name: 'Object Oriented Programming',
        code: 'CS202',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'OOP concepts',
          'Classes and objects',
          'Inheritance',
          'Polymorphism',
          'Exception handling',
        ],
      },
      {
        id: 's2-5',
        name: 'Electrical Engineering',
        code: 'EE201',
        faculty: 'Electrical Department',
        credits: 3,
        topics: [
          'Electrical circuits',
          'Network theorems',
          'AC fundamentals',
          'Transformers',
          'Electrical machines',
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'Semester 3',
    status: 'Completed',
    subjects: [
      {
        id: 's3-1',
        name: 'Digital Principles and Systems',
        code: 'CS301',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Number systems',
          'Boolean algebra',
          'Logic gates',
          'Combinational circuits',
          'Sequential circuits',
        ],
      },
      {
        id: 's3-2',
        name: 'Computer Organization',
        code: 'CS302',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Computer fundamentals',
          'Instruction sets',
          'CPU organization',
          'Memory organization',
          'Input and output systems',
        ],
      },
      {
        id: 's3-3',
        name: 'Database Management Systems',
        code: 'CS303',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Database concepts',
          'Entity relationship model',
          'Relational model',
          'SQL and queries',
          'Normalization',
        ],
      },
      {
        id: 's3-4',
        name: 'Object Oriented Analysis',
        code: 'CS304',
        faculty: 'Computer Science Department',
        credits: 3,
        topics: [
          'Software development process',
          'Object oriented concepts',
          'UML diagrams',
          'System modeling',
          'Design principles',
        ],
      },
      {
        id: 's3-5',
        name: 'Electronic Circuits',
        code: 'EC301',
        faculty: 'Electronics Department',
        credits: 3,
        topics: [
          'Amplifier fundamentals',
          'Feedback amplifiers',
          'Oscillators',
          'Power amplifiers',
          'Operational amplifiers',
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Semester 4',
    status: 'Completed',
    subjects: [
      {
        id: 's4-1',
        name: 'Operating Systems',
        code: 'CS401',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Operating system fundamentals',
          'Process management',
          'CPU scheduling',
          'Memory management',
          'File systems',
        ],
      },
      {
        id: 's4-2',
        name: 'Computer Networks',
        code: 'CS402',
        faculty: 'Computer Science Department',
        credits: 4,
        topics: [
          'Network fundamentals',
          'OSI and TCP/IP models',
          'Data link layer',
          'Network layer and routing',
          'Transport layer protocols',
        ],
      },
      {
        id: 's4-3',
        name: 'Software Engineering',
        code: 'CS403',
        faculty: 'Computer Science Department',
        credits: 3,
        topics: [
          'Software process models',
          'Requirements engineering',
          'Software design',
          'Software testing',
          'Project management',
        ],
      },
      {
        id: 's4-4',
        name: 'Microprocessors',
        code: 'EC401',
        faculty: 'Electronics Department',
        credits: 3,
        topics: [
          'Microprocessor architecture',
          'Instruction sets',
          'Addressing modes',
          'Assembly language programming',
          'Interfacing techniques',
        ],
      },
      {
        id: 's4-5',
        name: 'Communication Systems',
        code: 'EC402',
        faculty: 'Electronics Department',
        credits: 3,
        topics: [
          'Communication fundamentals',
          'Amplitude modulation',
          'Frequency modulation',
          'Digital modulation',
          'Communication receivers',
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'Semester 5',
    status: 'Current',
    subjects: [
      {
        id: 's5-1',
        name: 'Data Structures and Algorithms',
        code: 'CS501',
        faculty: 'Dr. Priya Sharma',
        credits: 4,
        topics: [
          'Advanced trees and graphs',
          'Hashing techniques',
          'Advanced sorting algorithms',
          'Dynamic programming',
          'Algorithm complexity analysis',
        ],
      },
      {
        id: 's5-2',
        name: 'Database Management Systems',
        code: 'CS502',
        faculty: 'Prof. Arun Kumar',
        credits: 4,
        topics: [
          'Relational database design',
          'Advanced SQL queries',
          'Transaction management',
          'Concurrency control',
          'Database recovery',
        ],
      },
      {
        id: 's5-3',
        name: 'Operating Systems',
        code: 'CS503',
        faculty: 'Dr. Meena Raj',
        credits: 4,
        topics: [
          'Process synchronization',
          'Deadlocks',
          'Memory allocation',
          'Virtual memory',
          'File system implementation',
        ],
      },
      {
        id: 's5-4',
        name: 'Computer Networks',
        code: 'CS504',
        faculty: 'Prof. Karthik S',
        credits: 3,
        topics: [
          'Network layer protocols',
          'Routing algorithms',
          'Transport layer services',
          'Application layer protocols',
          'Network security basics',
        ],
      },
      {
        id: 's5-5',
        name: 'Software Engineering',
        code: 'CS505',
        faculty: 'Dr. Divya Nair',
        credits: 3,
        topics: [
          'Agile development',
          'Software requirements',
          'System design and architecture',
          'Software quality assurance',
          'Testing and maintenance',
        ],
      },
    ],
  },
];

// Demonstration data only.
// Replace this with progress received from your backend.
const completionData: Record<string, string[]> = {
  's1-1': [
    'Matrices and determinants',
    'Differential calculus',
    'Partial differentiation',
    'Applications of derivatives',
    'Multiple integrals',
  ],
  's1-2': [
    'Properties of matter',
    'Wave optics',
    'Quantum physics',
    'Semiconductor physics',
    'Applications of lasers',
  ],
  's1-3': [
    'Water technology',
    'Electrochemistry',
    'Corrosion and prevention',
    'Polymer chemistry',
    'Engineering materials',
  ],
  's1-4': [
    'Introduction to programming',
    'Variables and data types',
    'Control statements',
    'Functions and arrays',
    'Pointers and structures',
  ],
  's1-5': [
    'Engineering drawing basics',
    'Geometrical constructions',
    'Projection of points',
    'Projection of solids',
    'Isometric projections',
  ],
  's2-1': [
    'Differential equations',
    'Vector calculus',
    'Complex variables',
    'Laplace transforms',
    'Fourier series',
  ],
  's2-2': [
    'Introduction to data structures',
    'Arrays and linked lists',
    'Stacks and queues',
    'Trees and graphs',
    'Searching and sorting',
  ],
  's2-3': [
    'Semiconductor devices',
    'Diodes and applications',
    'Bipolar junction transistors',
    'Field effect transistors',
    'Electronic circuits',
  ],
  's2-4': [
    'OOP concepts',
    'Classes and objects',
    'Inheritance',
    'Polymorphism',
    'Exception handling',
  ],
  's2-5': [
    'Electrical circuits',
    'Network theorems',
    'AC fundamentals',
    'Transformers',
    'Electrical machines',
  ],
  's3-1': [
    'Number systems',
    'Boolean algebra',
    'Logic gates',
    'Combinational circuits',
    'Sequential circuits',
  ],
  's3-2': [
    'Computer fundamentals',
    'Instruction sets',
    'CPU organization',
    'Memory organization',
    'Input and output systems',
  ],
  's3-3': [
    'Database concepts',
    'Entity relationship model',
    'Relational model',
    'SQL and queries',
    'Normalization',
  ],
  's3-4': [
    'Software development process',
    'Object oriented concepts',
    'UML diagrams',
    'System modeling',
    'Design principles',
  ],
  's3-5': [
    'Amplifier fundamentals',
    'Feedback amplifiers',
    'Oscillators',
    'Power amplifiers',
    'Operational amplifiers',
  ],
  's4-1': [
    'Operating system fundamentals',
    'Process management',
    'CPU scheduling',
    'Memory management',
    'File systems',
  ],
  's4-2': [
    'Network fundamentals',
    'OSI and TCP/IP models',
    'Data link layer',
    'Network layer and routing',
    'Transport layer protocols',
  ],
  's4-3': [
    'Software process models',
    'Requirements engineering',
    'Software design',
    'Software testing',
    'Project management',
  ],
  's4-4': [
    'Microprocessor architecture',
    'Instruction sets',
    'Addressing modes',
    'Assembly language programming',
    'Interfacing techniques',
  ],
  's4-5': [
    'Communication fundamentals',
    'Amplitude modulation',
    'Frequency modulation',
    'Digital modulation',
    'Communication receivers',
  ],
  's5-1': [
    'Advanced trees and graphs',
    'Hashing techniques',
    'Advanced sorting algorithms',
  ],
  's5-2': [
    'Relational database design',
    'Advanced SQL queries',
  ],
  's5-3': [
    'Process synchronization',
    'Deadlocks',
  ],
  's5-4': ['Network layer protocols'],
  's5-5': [],
};

export default function SyllabusScreen() {
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const semester = semesters.find((item) => item.id === selectedSemester)!;

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return semester.subjects;

    return semester.subjects.filter((subject) => {
      return (
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query) ||
        subject.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    });
  }, [semester, search]);

  const semesterStats = useMemo(() => {
    const totalTopics = semester.subjects.reduce(
      (sum, subject) => sum + subject.topics.length,
      0,
    );

    const completedCount = semester.subjects.reduce(
      (sum, subject) =>
        sum + (completionData[subject.id]?.length ?? 0),
      0,
    );

    const completedSubjects = semester.subjects.filter(
      (subject) =>
        (completionData[subject.id]?.length ?? 0) === subject.topics.length,
    ).length;

    return {
      totalTopics,
      completedCount,
      completedSubjects,
      totalSubjects: semester.subjects.length,
      percentage: totalTopics
        ? Math.round((completedCount / totalTopics) * 100)
        : 0,
    };
  }, [semester]);

  const getSubjectProgress = (subject: Subject) => {
    const completed = completionData[subject.id]?.length ?? 0;

    return Math.round((completed / subject.topics.length) * 100);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/student');
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
    >
      <StatusBar barStyle="dark-content"/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* Header */}
        <View className="px-5 pt-3 pb-5">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={goBack}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <Ionicons name="arrow-back" size={21} color={COLORS.navy} />
            </Pressable>

            <View className="items-center">
              <Text
                className="text-xs font-bold tracking-widest"
                style={{ color: COLORS.blue }}
              >
                CAMPUSOS
              </Text>
              <Text
                className="mt-1 text-base font-bold"
                style={{ color: COLORS.navy }}
              >
                My Syllabus
              </Text>
            </View>

            <View
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
              style={{ borderWidth: 1, borderColor: COLORS.border }}
            >
              <Ionicons name="book-outline" size={20} color={COLORS.blue} />
            </View>
          </View>
        </View>

        {/* Semester selector */}
        <View className="mb-5">
          <View className="px-5 mb-3 flex-row items-center justify-between">
            <View>
              <Text
                className="text-base font-bold"
                style={{ color: COLORS.navy }}
              >
                Select semester
              </Text>
              <Text
                className="mt-1 text-xs"
                style={{ color: COLORS.muted }}
              >
                Select a semester to view its syllabus
              </Text>
            </View>
            <Ionicons name="layers-outline" size={21} color={COLORS.blue} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 9,
            }}
          >
            {semesters.map((item) => {
              const active = selectedSemester === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedSemester(item.id);
                    setExpandedSubject(null);
                    setSearch('');
                  }}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    backgroundColor: active ? COLORS.navy : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? COLORS.navy : COLORS.border,
                  }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: active ? '#FFFFFF' : COLORS.navy }}
                  >
                    Sem {item.id}
                  </Text>
                  <Text
                    className="mt-1 text-[10px] font-medium"
                    style={{ color: active ? '#DCE2FF' : COLORS.muted }}
                  >
                    {item.status}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Semester overview */}
        <View className="px-5">
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
            }}
          >
            <View
              className="absolute rounded-full"
              style={{
                width: 125,
                height: 125,
                right: -32,
                top: -45,
                backgroundColor: 'rgba(145,157,237,0.13)',
              }}
            />

            <View
              className="absolute rounded-full"
              style={{
                width: 75,
                height: 75,
                right: 52,
                bottom: -42,
                backgroundColor: 'rgba(180,145,228,0.13)',
              }}
            />

            <View className="flex-row items-center justify-between">
              <View>
                <View
                  className="self-start rounded-full px-3 py-1.5"
                  style={{ backgroundColor: '#E4E9FF' }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{ color: COLORS.blue }}
                  >
                    {semester.status.toUpperCase()}
                  </Text>
                </View>

                <Text
                  className="mt-3 text-2xl font-extrabold"
                  style={{ color: COLORS.navy }}
                >
                  {semester.label}
                </Text>

                <Text
                  className="mt-1 text-xs"
                  style={{ color: COLORS.muted }}
                >
                  Your semester syllabus overview
                </Text>
              </View>

              <View className="h-16 w-16 items-center justify-center rounded-3xl bg-white">
                <Ionicons
                  name="school-outline"
                  size={34}
                  color={COLORS.blue}
                />
              </View>
            </View>

            <View className="mt-6 flex-row items-end justify-between">
              <View>
                <Text
                  className="text-xs font-medium"
                  style={{ color: COLORS.muted }}
                >
                  Syllabus completed
                </Text>

                <View className="mt-1 flex-row items-baseline">
                  <Text
                    className="text-4xl font-extrabold"
                    style={{ color: COLORS.navy }}
                  >
                    {semesterStats.percentage}%
                  </Text>
                  <Text
                    className="ml-2 text-xs"
                    style={{ color: COLORS.muted }}
                  >
                    completed
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className="text-xs font-semibold"
                  style={{ color: COLORS.navy }}
                >
                  {semesterStats.completedCount}/{semesterStats.totalTopics}
                </Text>
                <Text
                  className="mt-1 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Topics completed
                </Text>
              </View>
            </View>

            <View
              className="mt-4 h-2.5 overflow-hidden rounded-full"
              style={{ backgroundColor: '#E3E7F3' }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${semesterStats.percentage}%`,
                  backgroundColor: COLORS.blue,
                }}
              />
            </View>

            <View className="mt-5 flex-row" style={{ gap: 10 }}>
              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <Ionicons
                  name="book-outline"
                  size={19}
                  color={COLORS.blue}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: COLORS.navy }}
                >
                  {semesterStats.totalSubjects}
                </Text>
                <Text
                  className="mt-0.5 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Subjects
                </Text>
              </View>

              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={COLORS.green}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: COLORS.navy }}
                >
                  {semesterStats.completedSubjects}
                </Text>
                <Text
                  className="mt-0.5 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Finished subjects
                </Text>
              </View>

              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
              >
                <Ionicons
                  name="time-outline"
                  size={19}
                  color={COLORS.orange}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: COLORS.navy }}
                >
                  {semesterStats.totalTopics - semesterStats.completedCount}
                </Text>
                <Text
                  className="mt-0.5 text-[10px]"
                  style={{ color: COLORS.muted }}
                >
                  Remaining
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Subjects */}
        <View className="px-5 mt-7">
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-lg font-extrabold"
                style={{ color: COLORS.navy }}
              >
                {semester.label} Subjects
              </Text>
              <Text
                className="mt-1 text-xs"
                style={{ color: COLORS.muted }}
              >
                View subjects and detailed syllabus topics
              </Text>
            </View>

            <View
              className="rounded-xl px-3 py-2"
              style={{ backgroundColor: '#EEF1FF' }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: COLORS.blue }}
              >
                {semester.subjects.length} subjects
              </Text>
            </View>
          </View>

          {/* Search */}
          <View
            className="mt-4 flex-row items-center rounded-2xl bg-white px-4"
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons
              name="search-outline"
              size={19}
              color={COLORS.muted}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search subject, code or topic..."
              placeholderTextColor="#A5ADBC"
              className="ml-3 flex-1 text-sm"
              style={{ color: COLORS.navy }}
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons
                  name="close-circle"
                  size={19}
                  color={COLORS.muted}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Subject cards */}
        <View className="px-5 mt-4">
          {filteredSubjects.length === 0 ? (
            <View className="items-center rounded-3xl bg-white px-6 py-10">
              <Ionicons
                name="search-outline"
                size={35}
                color="#A5ADBC"
              />
              <Text
                className="mt-3 text-base font-bold"
                style={{ color: COLORS.navy }}
              >
                No subjects found
              </Text>
              <Text
                className="mt-1 text-center text-xs"
                style={{ color: COLORS.muted }}
              >
                Try another subject name, code or topic.
              </Text>
            </View>
          ) : (
            filteredSubjects.map((subject, index) => {
              const progress = getSubjectProgress(subject);
              const isExpanded = expandedSubject === subject.id;
              const completed = completionData[subject.id]?.length ?? 0;
              const isComplete = progress === 100;

              return (
                <View
                  key={subject.id}
                  className="mb-4 overflow-hidden rounded-3xl bg-white"
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Pressable
                    onPress={() =>
                      setExpandedSubject(
                        isExpanded ? null : subject.id,
                      )
                    }
                    className="p-4"
                  >
                    <View className="flex-row items-start">
                      <View
                        className="h-12 w-12 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor:
                            index % 3 === 0
                              ? '#EEF1FF'
                              : index % 3 === 1
                                ? '#F3EEFF'
                                : '#EAF8F1',
                        }}
                      >
                        <Ionicons
                          name="book-outline"
                          size={23}
                          color={
                            index % 3 === 0
                              ? COLORS.blue
                              : index % 3 === 1
                                ? COLORS.purple
                                : COLORS.green
                          }
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text
                          className="text-sm font-extrabold"
                          style={{ color: COLORS.navy }}
                        >
                          {subject.name}
                        </Text>
                        <Text
                          className="mt-1 text-[11px]"
                          style={{ color: COLORS.muted }}
                        >
                          {subject.code} · {subject.credits} credits
                        </Text>
                        <Text
                          className="mt-1 text-[11px]"
                          style={{ color: COLORS.muted }}
                        >
                          {subject.faculty}
                        </Text>
                      </View>

                      <View className="items-end">
                        <View
                          className="rounded-full px-2.5 py-1"
                          style={{
                            backgroundColor: isComplete
                              ? '#EAF8F1'
                              : '#FFF5E8',
                          }}
                        >
                          <Text
                            className="text-[10px] font-bold"
                            style={{
                              color: isComplete
                                ? COLORS.green
                                : COLORS.orange,
                            }}
                          >
                            {isComplete ? 'Completed' : 'In progress'}
                          </Text>
                        </View>

                        <Ionicons
                          name={
                            isExpanded ? 'chevron-up' : 'chevron-down'
                          }
                          size={18}
                          color={COLORS.muted}
                          style={{ marginTop: 12 }}
                        />
                      </View>
                    </View>

                    <View className="mt-5 flex-row items-center justify-between">
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: COLORS.navy }}
                      >
                        Syllabus progress
                      </Text>
                      <Text
                        className="text-xs font-extrabold"
                        style={{ color: COLORS.blue }}
                      >
                        {progress}%
                      </Text>
                    </View>

                    <View
                      className="mt-2 h-2 overflow-hidden rounded-full"
                      style={{ backgroundColor: '#EDF0F6' }}
                    >
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: isComplete
                            ? COLORS.green
                            : COLORS.blue,
                        }}
                      />
                    </View>

                    <View className="mt-3 flex-row items-center justify-between">
                      <Text
                        className="text-[11px]"
                        style={{ color: COLORS.muted }}
                      >
                        {completed} of {subject.topics.length} topics completed
                      </Text>
                      <Text
                        className="text-[11px] font-semibold"
                        style={{ color: COLORS.blue }}
                      >
                        {isExpanded ? 'Hide topics' : 'View topics'}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Student read-only topic list */}
                  {isExpanded && (
                    <View
                      className="px-4 pb-4"
                      style={{
                        borderTopWidth: 1,
                        borderTopColor: '#F0F2F7',
                      }}
                    >
                      <View className="py-4">
                        <View className="flex-row items-center justify-between">
                          <Text
                            className="text-sm font-bold"
                            style={{ color: COLORS.navy }}
                          >
                            Syllabus topics
                          </Text>
                          <View
                            className="rounded-full px-2.5 py-1"
                            style={{ backgroundColor: '#EEF1FF' }}
                          >
                            <Text
                              className="text-[10px] font-bold"
                              style={{ color: COLORS.blue }}
                            >
                              Read only
                            </Text>
                          </View>
                        </View>

                        <Text
                          className="mt-1 text-[11px]"
                          style={{ color: COLORS.muted }}
                        >
                          Completion status is updated by your professor or class representative.
                        </Text>
                      </View>

                      {subject.topics.map((topic, topicIndex) => {
                        const checked =
                          completionData[subject.id]?.includes(topic) ?? false;

                        return (
                          <View
                            key={`${subject.id}-${topicIndex}`}
                            className="mb-2 flex-row items-center rounded-2xl p-3"
                            style={{
                              backgroundColor: checked
                                ? '#F0F8F4'
                                : '#F8F9FC',
                              borderWidth: 1,
                              borderColor: checked
                                ? '#D8EEE2'
                                : '#F0F2F7',
                            }}
                          >
                            <View
                              className="h-8 w-8 items-center justify-center rounded-xl"
                              style={{
                                backgroundColor: checked
                                  ? '#E0F3E9'
                                  : '#EEF1FF',
                              }}
                            >
                              {checked ? (
                                <Ionicons
                                  name="checkmark-circle"
                                  size={19}
                                  color={COLORS.green}
                                />
                              ) : (
                                <Text
                                  className="text-xs font-bold"
                                  style={{ color: COLORS.blue }}
                                >
                                  {topicIndex + 1}
                                </Text>
                              )}
                            </View>

                            <View className="ml-3 flex-1">
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: COLORS.navy }}
                              >
                                {topic}
                              </Text>

                              <Text
                                className="mt-1 text-[10px]"
                                style={{ color: COLORS.muted }}
                              >
                                {checked
                                  ? 'Completed'
                                  : 'Not completed yet'}
                              </Text>
                            </View>

                            <View
                              className="rounded-full px-2.5 py-1"
                              style={{
                                backgroundColor: checked
                                  ? '#E5F5EC'
                                  : '#FFF4E5',
                              }}
                            >
                              <Text
                                className="text-[10px] font-bold"
                                style={{
                                  color: checked
                                    ? COLORS.green
                                    : COLORS.orange,
                                }}
                              >
                                {checked ? 'Done' : 'Pending'}
                              </Text>
                            </View>
                          </View>
                        );
                      })}

                      <View
                        className="mt-2 flex-row items-center rounded-2xl p-3"
                        style={{ backgroundColor: '#EEF1FF' }}
                      >
                        <Ionicons
                          name="information-circle-outline"
                          size={18}
                          color={COLORS.blue}
                        />
                        <Text
                          className="ml-2 flex-1 text-[10px]"
                          style={{ color: '#58658E' }}
                        >
                          You can view syllabus progress here. Only authorized academic staff can update it.
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Student information */}
        <View
          className="mx-5 mt-1 flex-row items-start rounded-2xl p-4"
          style={{ backgroundColor: '#EEF1FF' }}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.blue}
          />
          <View className="ml-3 flex-1">
            <Text
              className="text-xs font-bold"
              style={{ color: COLORS.navy }}
            >
              Student syllabus access
            </Text>
            <Text
              className="mt-1 text-[11px] leading-5"
              style={{ color: '#687493' }}
            >
              You can view your semester subjects, topics and completion progress. Syllabus updates are managed by authorized professors and class representatives.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
