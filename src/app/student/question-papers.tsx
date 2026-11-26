
import React, { useMemo, useState } from 'react';
import {
  Alert,
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

const C = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  border: '#E9EDF5',
  bg: '#F7F9FD',
  green: '#23966B',
  orange: '#D99435',
  purple: '#9277D6',
  red: '#D95463',
};

type PaperType =
  | 'Previous Year'
  | 'Model Paper'
  | 'Internal Assessment'
  | 'Mid-Semester';

type Paper = {
  id: string;
  subject: string;
  code: string;
  semester: number;
  year: number;
  session: string;
  type: PaperType;
  exam: string;
  duration: string;
  marks: number;
  passMarks: number;
  questions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string[];
  sections: {
    name: string;
    questions: string;
    marks: number;
  }[];
  fileUrl?: string;
};

const papers: Paper[] = [
  {
    id: 'p1',
    subject: 'Data Structures and Algorithms',
    code: 'CS501',
    semester: 5,
    year: 2025,
    session: 'November 2025',
    type: 'Previous Year',
    exam: 'End Semester Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Medium',
    instructions: [
      'Answer all compulsory questions.',
      'Draw diagrams wherever necessary.',
      'Assume suitable data if required.',
      'Write algorithm steps clearly.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p2',
    subject: 'Database Management Systems',
    code: 'CS502',
    semester: 5,
    year: 2025,
    session: 'November 2025',
    type: 'Previous Year',
    exam: 'End Semester Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Medium',
    instructions: [
      'Answer all compulsory questions.',
      'Write SQL queries with proper syntax.',
      'Draw ER diagrams wherever required.',
      'State assumptions clearly.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p3',
    subject: 'Operating Systems',
    code: 'CS503',
    semester: 5,
    year: 2025,
    session: 'November 2025',
    type: 'Previous Year',
    exam: 'End Semester Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Hard',
    instructions: [
      'Answer questions according to the instructions.',
      'Show calculations for scheduling problems.',
      'Draw process diagrams where necessary.',
      'Explain algorithms with examples.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p4',
    subject: 'Computer Networks',
    code: 'CS504',
    semester: 5,
    year: 2025,
    session: 'November 2025',
    type: 'Previous Year',
    exam: 'End Semester Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Medium',
    instructions: [
      'Draw network diagrams wherever necessary.',
      'Explain protocol operations clearly.',
      'Show calculations for numerical problems.',
      'Answer all compulsory questions.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p5',
    subject: 'Software Engineering',
    code: 'CS505',
    semester: 5,
    year: 2025,
    session: 'November 2025',
    type: 'Previous Year',
    exam: 'End Semester Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Easy',
    instructions: [
      'Use appropriate diagrams.',
      'Explain models with examples.',
      'Answer all compulsory questions.',
      'Write structured answers.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p6',
    subject: 'Data Structures and Algorithms',
    code: 'CS501',
    semester: 5,
    year: 2026,
    session: 'April 2026',
    type: 'Model Paper',
    exam: 'Model Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Hard',
    instructions: [
      'Attempt all required questions.',
      'Use pseudocode for algorithm questions.',
      'Explain time complexity.',
      'Draw diagrams wherever necessary.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p7',
    subject: 'Database Management Systems',
    code: 'CS502',
    semester: 5,
    year: 2026,
    session: 'April 2026',
    type: 'Model Paper',
    exam: 'Model Examination',
    duration: '3 Hours',
    marks: 100,
    passMarks: 50,
    questions: 15,
    difficulty: 'Medium',
    instructions: [
      'Write queries with proper syntax.',
      'Draw database diagrams.',
      'Explain normalization with examples.',
      'Answer all compulsory questions.',
    ],
    sections: [
      { name: 'Section A', questions: '10 × 2', marks: 20 },
      { name: 'Section B', questions: '5 × 8', marks: 40 },
      { name: 'Section C', questions: '2 × 20', marks: 40 },
    ],
  },
  {
    id: 'p8',
    subject: 'Operating Systems',
    code: 'CS503',
    semester: 5,
    year: 2026,
    session: 'April 2026',
    type: 'Internal Assessment',
    exam: 'Internal Assessment 1',
    duration: '1.5 Hours',
    marks: 50,
    passMarks: 25,
    questions: 10,
    difficulty: 'Medium',
    instructions: [
      'Answer all compulsory questions.',
      'Show calculations clearly.',
      'Use diagrams wherever required.',
    ],
    sections: [
      { name: 'Section A', questions: '5 × 2', marks: 10 },
      { name: 'Section B', questions: '4 × 5', marks: 20 },
      { name: 'Section C', questions: '1 × 20', marks: 20 },
    ],
  },
  {
    id: 'p9',
    subject: 'Computer Networks',
    code: 'CS504',
    semester: 5,
    year: 2026,
    session: 'April 2026',
    type: 'Mid-Semester',
    exam: 'Mid-Semester Examination',
    duration: '1.5 Hours',
    marks: 50,
    passMarks: 25,
    questions: 10,
    difficulty: 'Easy',
    instructions: [
      'Answer the required number of questions.',
      'Draw diagrams where appropriate.',
      'Write answers clearly.',
    ],
    sections: [
      { name: 'Section A', questions: '5 × 2', marks: 10 },
      { name: 'Section B', questions: '4 × 5', marks: 20 },
      { name: 'Section C', questions: '1 × 20', marks: 20 },
    ],
  },
  {
    id: 'p10',
    subject: 'Software Engineering',
    code: 'CS505',
    semester: 5,
    year: 2026,
    session: 'April 2026',
    type: 'Internal Assessment',
    exam: 'Internal Assessment 2',
    duration: '1.5 Hours',
    marks: 50,
    passMarks: 25,
    questions: 10,
    difficulty: 'Easy',
    instructions: [
      'Answer all compulsory questions.',
      'Use diagrams for design questions.',
      'Explain examples clearly.',
    ],
    sections: [
      { name: 'Section A', questions: '5 × 2', marks: 10 },
      { name: 'Section B', questions: '4 × 5', marks: 20 },
      { name: 'Section C', questions: '1 × 20', marks: 20 },
    ],
  },
];

const semesterList = [1, 2, 3, 4, 5];

const filters = [
  'All',
  'Previous Year',
  'Model Paper',
  'Internal Assessment',
  'Mid-Semester',
];

const typeColor = (type: PaperType) => {
  if (type === 'Previous Year') return C.green;
  if (type === 'Model Paper') return C.purple;
  if (type === 'Internal Assessment') return C.orange;
  return C.blue;
};

export default function QuestionPapersScreen() {
  const [semester, setSemester] = useState(5);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [practiced, setPracticed] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);

  const semesterPapers = papers.filter((paper) => paper.semester === semester);

  const filteredPapers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return papers.filter((paper) => {
      const matchesSemester = paper.semester === semester;
      const matchesFilter = filter === 'All' || paper.type === filter;
      const matchesBookmark =
        !showBookmarked || bookmarks.includes(paper.id);

      const matchesSearch =
        !query ||
        paper.subject.toLowerCase().includes(query) ||
        paper.code.toLowerCase().includes(query) ||
        paper.exam.toLowerCase().includes(query) ||
        paper.type.toLowerCase().includes(query) ||
        String(paper.year).includes(query);

      return (
        matchesSemester &&
        matchesFilter &&
        matchesBookmark &&
        matchesSearch
      );
    });
  }, [semester, filter, search, bookmarks, showBookmarked]);

  const totalPracticed = semesterPapers.filter((paper) =>
    practiced.includes(paper.id),
  ).length;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/student');
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id],
    );
  };

  const togglePracticed = (id: string) => {
    setPracticed((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id],
    );
  };

  const downloadPaper = (paper: Paper) => {
    if (!paper.fileUrl) {
      Alert.alert(
        'PDF not uploaded',
        'This is demonstration paper information. A real PDF must be uploaded by the professor or authorized class representative before it can be downloaded.',
      );
      return;
    }

    Alert.alert('PDF available', 'Connect your PDF viewer or download service here.');
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content"/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-5 pt-3 pb-5">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={goBack}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
              style={{ borderWidth: 1, borderColor: C.border }}
            >
              <Ionicons name="arrow-back" size={21} color={C.navy} />
            </Pressable>

            <View className="items-center">
              <Text
                className="text-xs font-bold tracking-widest"
                style={{ color: C.blue }}
              >
                CAMPUSOS
              </Text>
              <Text
                className="mt-1 text-base font-bold"
                style={{ color: C.navy }}
              >
                Question Papers
              </Text>
            </View>

            <Pressable
              onPress={() => setShowBookmarked(!showBookmarked)}
              className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
              style={{
                borderWidth: 1,
                borderColor: showBookmarked ? C.blue : C.border,
              }}
            >
              <Ionicons
                name={showBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={C.blue}
              />
            </Pressable>
          </View>
        </View>

        {/* Hero */}
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
                right: -30,
                top: -42,
                backgroundColor: 'rgba(145,157,237,0.13)',
              }}
            />

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View
                  className="self-start rounded-full px-3 py-1.5"
                  style={{ backgroundColor: '#E4E9FF' }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{ color: C.blue }}
                  >
                    EXAM PREPARATION
                  </Text>
                </View>

                <Text
                  className="mt-3 text-2xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  Practice makes
                </Text>
                <Text
                  className="text-2xl font-extrabold"
                  style={{ color: C.blue }}
                >
                  progress.
                </Text>

                <Text
                  className="mt-2 text-xs leading-5"
                  style={{ color: C.muted }}
                >
                  Previous papers, model exams and internal assessments in one place.
                </Text>
              </View>

              <View className="ml-3 h-20 w-20 items-center justify-center rounded-3xl bg-white">
                <Ionicons
                  name="documents-outline"
                  size={43}
                  color={C.blue}
                />
              </View>
            </View>

            <View className="mt-6 flex-row" style={{ gap: 9 }}>
              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
              >
                <Ionicons
                  name="documents-outline"
                  size={19}
                  color={C.blue}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  {semesterPapers.length}
                </Text>
                <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                  Total papers
                </Text>
              </View>

              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={C.green}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  {totalPracticed}
                </Text>
                <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                  Practiced
                </Text>
              </View>

              <View
                className="flex-1 rounded-2xl p-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
              >
                <Ionicons
                  name="bookmark-outline"
                  size={19}
                  color={C.purple}
                />
                <Text
                  className="mt-2 text-xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  {bookmarks.filter((id) =>
                    semesterPapers.some((paper) => paper.id === id),
                  ).length}
                </Text>
                <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                  Saved papers
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Practice progress */}
        <View className="px-5 mt-5">
          <View
            className="rounded-2xl bg-white p-4"
            style={{ borderWidth: 1, borderColor: C.border }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text
                  className="text-sm font-bold"
                  style={{ color: C.navy }}
                >
                  Your practice activity
                </Text>
                <Text
                  className="mt-1 text-[11px]"
                  style={{ color: C.muted }}
                >
                  Papers you have marked as practiced
                </Text>
              </View>
              <Text
                className="text-sm font-extrabold"
                style={{ color: C.blue }}
              >
                {semesterPapers.length
                  ? Math.round(
                      (totalPracticed / semesterPapers.length) * 100,
                    )
                  : 0}
                %
              </Text>
            </View>

            <View
              className="mt-3 h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: '#EDF0F6' }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${
                    semesterPapers.length
                      ? (totalPracticed / semesterPapers.length) * 100
                      : 0
                  }%`,
                  backgroundColor: C.green,
                }}
              />
            </View>

            <View className="mt-3 flex-row justify-between">
              <Text className="text-[10px]" style={{ color: C.muted }}>
                {totalPracticed} completed
              </Text>
              <Text className="text-[10px]" style={{ color: C.muted }}>
                {semesterPapers.length - totalPracticed} remaining
              </Text>
            </View>
          </View>
        </View>

        {/* Semester selector */}
        <View className="mt-7">
          <View className="px-5 mb-3">
            <Text
              className="text-base font-bold"
              style={{ color: C.navy }}
            >
              Select semester
            </Text>
            <Text
              className="mt-1 text-xs"
              style={{ color: C.muted }}
            >
              Browse question papers semester-wise
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 9 }}
          >
            {semesterList.map((item) => {
              const active = semester === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setSemester(item);
                    setFilter('All');
                    setSearch('');
                    setShowBookmarked(false);
                  }}
                  className="rounded-2xl px-5 py-3"
                  style={{
                    backgroundColor: active ? C.navy : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? C.navy : C.border,
                  }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: active ? '#FFFFFF' : C.navy }}
                  >
                    Semester {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Search */}
        <View className="px-5 mt-6">
          <View
            className="flex-row items-center rounded-2xl bg-white px-4"
            style={{
              height: 51,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Ionicons name="search-outline" size={19} color={C.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search subject, code, year..."
              placeholderTextColor="#A5ADBC"
              className="ml-3 flex-1 text-sm"
              style={{ color: C.navy }}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={19} color={C.muted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filters */}
        <View className="mt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          >
            {filters.map((item) => {
              const active = filter === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  className="rounded-full px-4 py-2.5"
                  style={{
                    backgroundColor: active ? '#E8ECFF' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: active ? '#CDD5FF' : C.border,
                  }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{ color: active ? C.blue : C.muted }}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Summary */}
        <View className="px-5 mt-7 mb-4 flex-row items-center justify-between">
          <View>
            <Text
              className="text-lg font-extrabold"
              style={{ color: C.navy }}
            >
              Semester {semester} Papers
            </Text>
            <Text className="mt-1 text-xs" style={{ color: C.muted }}>
              {showBookmarked ? 'Your saved papers' : 'Available exam resources'}
            </Text>
          </View>

          <Text
            className="text-xs font-bold"
            style={{ color: C.blue }}
          >
            {filteredPapers.length} found
          </Text>
        </View>

        {/* Paper cards */}
        <View className="px-5">
          {filteredPapers.length === 0 ? (
            <View className="items-center rounded-3xl bg-white px-6 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-3xl" style={{ backgroundColor: '#EEF1FF' }}>
                <Ionicons name="document-outline" size={30} color={C.blue} />
              </View>
              <Text
                className="mt-4 text-base font-bold"
                style={{ color: C.navy }}
              >
                No question papers found
              </Text>
              <Text
                className="mt-1 text-center text-xs leading-5"
                style={{ color: C.muted }}
              >
                Try another filter or search term.
              </Text>
              <Pressable
                onPress={() => {
                  setFilter('All');
                  setSearch('');
                  setShowBookmarked(false);
                }}
                className="mt-4 rounded-xl px-4 py-2.5"
                style={{ backgroundColor: '#EEF1FF' }}
              >
                <Text className="text-xs font-bold" style={{ color: C.blue }}>
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredPapers.map((paper) => {
              const color = typeColor(paper.type);
              const isBookmarked = bookmarks.includes(paper.id);
              const isPracticed = practiced.includes(paper.id);

              return (
                <View
                  key={paper.id}
                  className="mb-4 rounded-3xl bg-white p-4"
                  style={{ borderWidth: 1, borderColor: C.border }}
                >
                  <View className="flex-row items-start">
                    <View
                      className="h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={24}
                        color={color}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text
                        className="text-sm font-extrabold"
                        style={{ color: C.navy }}
                      >
                        {paper.subject}
                      </Text>
                      <Text
                        className="mt-1 text-[11px]"
                        style={{ color: C.muted }}
                      >
                        {paper.code} · {paper.session}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => toggleBookmark(paper.id)}
                      className="h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: '#F6F7FB' }}
                    >
                      <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={18}
                        color={isBookmarked ? C.blue : C.muted}
                      />
                    </Pressable>
                  </View>

                  <View className="mt-4 flex-row flex-wrap" style={{ gap: 7 }}>
                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color }}
                      >
                        {paper.type}
                      </Text>
                    </View>

                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: '#F1F3F8' }}
                    >
                      <Text
                        className="text-[10px] font-semibold"
                        style={{ color: C.muted }}
                      >
                        {paper.year}
                      </Text>
                    </View>

                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: '#F1F3F8' }}
                    >
                      <Text
                        className="text-[10px] font-semibold"
                        style={{ color: C.muted }}
                      >
                        {paper.difficulty}
                      </Text>
                    </View>
                  </View>

                  <Text
                    className="mt-3 text-[11px]"
                    style={{ color: C.muted }}
                  >
                    {paper.exam}
                  </Text>

                  <View
                    className="mt-3 rounded-2xl p-3"
                    style={{ backgroundColor: '#F8F9FC' }}
                  >
                    <View className="flex-row flex-wrap">
                      {[
                        {
                          icon: 'time-outline' as const,
                          label: paper.duration,
                        },
                        {
                          icon: 'ribbon-outline' as const,
                          label: `${paper.marks} marks`,
                        },
                        {
                          icon: 'help-circle-outline' as const,
                          label: `${paper.questions} questions`,
                        },
                      ].map((item) => (
                        <View
                          key={item.label}
                          className="mr-4 mb-2 flex-row items-center"
                        >
                          <Ionicons
                            name={item.icon}
                            size={14}
                            color={C.muted}
                          />
                          <Text
                            className="ml-1.5 text-[10px] font-semibold"
                            style={{ color: C.navy }}
                          >
                            {item.label}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-[10px]" style={{ color: C.muted }}>
                        Pass marks: {paper.passMarks}
                      </Text>
                      <Text className="text-[10px]" style={{ color: C.muted }}>
                        Semester {paper.semester}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row" style={{ gap: 9 }}>
                    <Pressable
                      onPress={() => setSelectedPaper(paper)}
                      className="h-11 flex-1 flex-row items-center justify-center rounded-xl"
                      style={{ backgroundColor: '#EEF1FF' }}
                    >
                      <Ionicons name="eye-outline" size={17} color={C.blue} />
                      <Text
                        className="ml-2 text-xs font-bold"
                        style={{ color: C.blue }}
                      >
                        View details
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => downloadPaper(paper)}
                      className="h-11 flex-1 flex-row items-center justify-center rounded-xl"
                      style={{ backgroundColor: C.navy }}
                    >
                      <Ionicons
                        name="download-outline"
                        size={17}
                        color="#FFFFFF"
                      />
                      <Text className="ml-2 text-xs font-bold text-white">
                        Download
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() => togglePracticed(paper.id)}
                    className="mt-3 flex-row items-center justify-center rounded-xl py-2.5"
                    style={{
                      backgroundColor: isPracticed ? '#EAF8F1' : '#F7F8FC',
                    }}
                  >
                    <Ionicons
                      name={isPracticed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={isPracticed ? C.green : C.muted}
                    />
                    <Text
                      className="ml-2 text-[11px] font-bold"
                      style={{
                        color: isPracticed ? C.green : C.muted,
                      }}
                    >
                      {isPracticed ? 'Marked as practiced' : 'Mark as practiced'}
                    </Text>
                  </Pressable>
                </View>
              );
            })
          )}
        </View>

        {/* Exam preparation tips */}
        <View className="px-5 mt-2">
          <LinearGradient
            colors={['#F0F5FF', '#F5F0FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 23,
              padding: 17,
              borderWidth: 1,
              borderColor: '#E8E9F8',
            }}
          >
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                <Ionicons name="bulb-outline" size={21} color={C.blue} />
              </View>
              <Text
                className="ml-3 text-sm font-extrabold"
                style={{ color: C.navy }}
              >
                Smart preparation tips
              </Text>
            </View>

            {[
              'Solve previous year papers within the exam time limit.',
              'Prioritize frequently tested topics.',
              'Review mistakes after every practice session.',
              'Practice both short and long-answer questions.',
            ].map((tip, index) => (
              <View key={index} className="mt-3 flex-row items-start">
                <View
                  className="h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#E1E8FF' }}
                >
                  <Text
                    className="text-[9px] font-bold"
                    style={{ color: C.blue }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className="ml-2 flex-1 text-[11px] leading-5"
                  style={{ color: '#687493' }}
                >
                  {tip}
                </Text>
              </View>
            ))}
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Paper details modal */}
      <Modal
        visible={!!selectedPaper}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPaper(null)}
      >
        {selectedPaper && (
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(20,30,55,0.4)' }}
          >
            <Pressable
              className="flex-1"
              onPress={() => setSelectedPaper(null)}
            />

            <View
              className="rounded-t-[30px] bg-white px-5 pt-5 pb-8"
              style={{ maxHeight: '85%' }}
            >
              <View className="mb-5 flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-lg font-extrabold"
                    style={{ color: C.navy }}
                  >
                    Paper details
                  </Text>
                  <Text
                    className="mt-1 text-xs"
                    style={{ color: C.muted }}
                  >
                    Complete examination information
                  </Text>
                </View>

                <Pressable
                  onPress={() => setSelectedPaper(null)}
                  className="h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#F1F3F8' }}
                >
                  <Ionicons name="close" size={20} color={C.navy} />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                  colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                  style={{
                    borderRadius: 22,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#E4E9FA',
                  }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{ color: C.blue }}
                  >
                    {selectedPaper.type.toUpperCase()}
                  </Text>
                  <Text
                    className="mt-2 text-lg font-extrabold"
                    style={{ color: C.navy }}
                  >
                    {selectedPaper.subject}
                  </Text>
                  <Text
                    className="mt-1 text-xs"
                    style={{ color: C.muted }}
                  >
                    {selectedPaper.code} · Semester {selectedPaper.semester}
                  </Text>
                </LinearGradient>

                <Text
                  className="mt-5 mb-3 text-sm font-extrabold"
                  style={{ color: C.navy }}
                >
                  Examination information
                </Text>

                {[
                  ['Exam session', selectedPaper.session],
                  ['Exam type', selectedPaper.exam],
                  ['Academic year', String(selectedPaper.year)],
                  ['Duration', selectedPaper.duration],
                  ['Maximum marks', `${selectedPaper.marks} marks`],
                  ['Passing marks', `${selectedPaper.passMarks} marks`],
                  ['Total questions', String(selectedPaper.questions)],
                  ['Difficulty', selectedPaper.difficulty],
                ].map(([label, value]) => (
                  <View
                    key={label}
                    className="mb-3 flex-row items-center justify-between"
                  >
                    <Text className="text-xs" style={{ color: C.muted }}>
                      {label}
                    </Text>
                    <Text
                      className="text-xs font-bold"
                      style={{ color: C.navy }}
                    >
                      {value}
                    </Text>
                  </View>
                ))}

                <View className="my-3 h-px" style={{ backgroundColor: C.border }} />

                <Text
                  className="mb-3 text-sm font-extrabold"
                  style={{ color: C.navy }}
                >
                  Marks distribution
                </Text>

                {selectedPaper.sections.map((section) => (
                  <View
                    key={section.name}
                    className="mb-2 flex-row items-center justify-between rounded-xl p-3"
                    style={{ backgroundColor: '#F7F8FC' }}
                  >
                    <View>
                      <Text
                        className="text-xs font-bold"
                        style={{ color: C.navy }}
                      >
                        {section.name}
                      </Text>
                      <Text
                        className="mt-1 text-[10px]"
                        style={{ color: C.muted }}
                      >
                        {section.questions} questions
                      </Text>
                    </View>
                    <Text
                      className="text-xs font-extrabold"
                      style={{ color: C.blue }}
                    >
                      {section.marks} marks
                    </Text>
                  </View>
                ))}

                <Text
                  className="mt-4 mb-3 text-sm font-extrabold"
                  style={{ color: C.navy }}
                >
                  Examination instructions
                </Text>

                {selectedPaper.instructions.map((instruction, index) => (
                  <View
                    key={index}
                    className="mb-2 flex-row items-start"
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={17}
                      color={C.green}
                    />
                    <Text
                      className="ml-2 flex-1 text-xs leading-5"
                      style={{ color: '#687493' }}
                    >
                      {instruction}
                    </Text>
                  </View>
                ))}

                <Pressable
                  onPress={() => {
                    downloadPaper(selectedPaper);
                  }}
                  className="mt-5 h-12 flex-row items-center justify-center rounded-2xl"
                  style={{ backgroundColor: C.navy }}
                >
                  <Ionicons
                    name="download-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text className="ml-2 text-sm font-bold text-white">
                    Download question paper
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}
