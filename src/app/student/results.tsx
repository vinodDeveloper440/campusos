import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import {
  studentResults,
  type SemesterResult,
  type SubjectResult,
} from '@/data/studentResults';

const C = {
  navy: '#202D49',
  blue: '#6478E8',
  blueSoft: '#EEF2FF',
  bg: '#F7F9FD',
  white: '#FFFFFF',
  text: '#34415A',
  muted: '#8994A8',
  border: '#E9EDF5',
  green: '#199B78',
  greenSoft: '#E8F6F0',
  orange: '#D99025',
  orangeSoft: '#FFF4E6',
  purple: '#9271D5',
  purpleSoft: '#F2EEFF',
  red: '#D84C57',
};

type ResultFilter = 'All' | 'Published' | 'Pending';
type ExamTab = 'Internal' | 'Semester Exam';

const totalMarks = (s: SubjectResult) =>
  s.mid1.obtained + s.mid2.obtained + s.semesterExam.obtained;

const maximumMarks = (s: SubjectResult) =>
  s.mid1.total + s.mid2.total + s.semesterExam.total;

const internalMarks = (s: SubjectResult) =>
  s.mid1.obtained + s.mid2.obtained;

const internalMaximum = (s: SubjectResult) =>
  s.mid1.total + s.mid2.total;

const percentage = (s: SubjectResult) => {
  const max = maximumMarks(s);
  return max > 0 ? (totalMarks(s) / max) * 100 : 0;
};

const grade = (value: number) => {
  if (value >= 90) return 'O';
  if (value >= 80) return 'A+';
  if (value >= 70) return 'A';
  if (value >= 60) return 'B+';
  if (value >= 50) return 'B';
  if (value >= 40) return 'C';
  return 'F';
};

const gradeColor = (value: number) => {
  if (value >= 80) return C.green;
  if (value >= 60) return C.blue;
  if (value >= 40) return C.orange;
  return C.red;
};

function ProgressBar({
  value,
  color = C.blue,
  track = '#E9EDF5',
  height = 7,
}: {
  value: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  return (
    <View
      className="overflow-hidden rounded-full"
      style={{ height, backgroundColor: track }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(value, 100))}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-extrabold" style={{ color: C.navy }}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-xs" style={{ color: C.muted }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function StatusPill({ status }: { status: 'Published' | 'Pending' }) {
  const published = status === 'Published';

  return (
    <View
      className="rounded-full px-3 py-1.5"
      style={{
        backgroundColor: published ? C.greenSoft : C.orangeSoft,
      }}
    >
      <Text
        className="text-[10px] font-bold"
        style={{ color: published ? C.green : C.orange }}
      >
        {status}
      </Text>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  background,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  background: string;
}) {
  return (
    <View
      className="flex-1 rounded-2xl border p-4"
      style={{ backgroundColor: C.white, borderColor: C.border }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: background }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text className="mt-3 text-[11px] font-medium" style={{ color: C.muted }}>
        {label}
      </Text>

      <Text className="mt-1 text-xl font-extrabold" style={{ color: C.navy }}>
        {value}
      </Text>
    </View>
  );
}

export default function StudentResultsScreen() {
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [examTab, setExamTab] = useState<ExamTab>('Internal');
  const [selectedMid, setSelectedMid] = useState<1 | 2>(1);
  const [filter, setFilter] = useState<ResultFilter>('All');
  const [search, setSearch] = useState('');

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectResult | null>(null);

  const [revaluationSubject, setRevaluationSubject] =
    useState<SubjectResult | null>(null);

  const [revaluationReason, setRevaluationReason] = useState('');
  const [revaluationSubmitted, setRevaluationSubmitted] = useState<string[]>([]);

  const currentSemester: SemesterResult | undefined = useMemo(
    () => studentResults.find((item) => item.semester === selectedSemester),
    [selectedSemester],
  );

  const subjects = useMemo(
    () => currentSemester?.subjects ?? [],
    [currentSemester],
  );

  const publishedSubjects = subjects.filter(
    (subject) => subject.status === 'Published',
  );

  const pendingCount = subjects.filter(
    (subject) => subject.status === 'Pending',
  ).length;

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0,
  );

  const publishedCredits = publishedSubjects.reduce(
    (sum, subject) => sum + subject.credits,
    0,
  );

  const average = publishedSubjects.length
    ? publishedSubjects.reduce(
        (sum, subject) => sum + percentage(subject),
        0,
      ) / publishedSubjects.length
    : 0;

  const internalAverage = publishedSubjects.length
    ? publishedSubjects.reduce((sum, subject) => {
        const max = internalMaximum(subject);
        return sum + (max > 0 ? (internalMarks(subject) / max) * 100 : 0);
      }, 0) / publishedSubjects.length
    : 0;

  const strongestSubject = publishedSubjects.length
    ? [...publishedSubjects].sort(
        (a, b) => percentage(b) - percentage(a),
      )[0]
    : undefined;

  const weakestSubject = publishedSubjects.length
    ? [...publishedSubjects].sort(
        (a, b) => percentage(a) - percentage(b),
      )[0]
    : undefined;

  const allPublished =
    subjects.length > 0 &&
    subjects.every((subject) => subject.status === 'Published');

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        !query ||
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query);

      const matchesFilter =
        filter === 'All' || subject.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [subjects, search, filter]);

  const changeSemester = (semester: number) => {
    setSelectedSemester(semester);
    setSelectedSubject(null);
    setSearch('');
    setFilter('All');
  };

  const shareResults = async () => {
    const rows = subjects.map((subject) =>
      subject.status === 'Pending'
        ? `${subject.code} - ${subject.name}: Pending`
        : `${subject.code} - ${subject.name}: ${totalMarks(subject)}/${maximumMarks(subject)} (${percentage(subject).toFixed(1)}%)`,
    );

    try {
      await Share.share({
        message: [
          'CampusOS Academic Results',
          `Semester ${selectedSemester} · ${currentSemester?.academicYear ?? ''}`,
          '',
          ...rows,
          '',
          `Published: ${publishedSubjects.length}/${subjects.length}`,
        ].join('\n'),
      });
    } catch {
      Alert.alert('Unable to share', 'Please try again.');
    }
  };

  const openRevaluation = (subject: SubjectResult) => {
    if (subject.status !== 'Published') {
      Alert.alert(
        'Result not published',
        'You can request revaluation after the result is published.',
      );
      return;
    }

    setSelectedSubject(null);
    setRevaluationSubject(subject);
    setRevaluationReason('');
  };

  const submitRevaluation = () => {
    if (!revaluationSubject) return;

    if (revaluationReason.trim().length < 8) {
      Alert.alert(
        'Add more details',
        'Please enter a reason with at least 8 characters.',
      );
      return;
    }

    setRevaluationSubmitted((previous) =>
      previous.includes(revaluationSubject.id)
        ? previous
        : [...previous, revaluationSubject.id],
    );

    setRevaluationSubject(null);
    setRevaluationReason('');

    Alert.alert(
      'Request saved',
      'Your revaluation request has been saved on this screen. Connect a backend to submit it to your college.',
    );
  };

  const renderSubject = (subject: SubjectResult) => {
    const published = subject.status === 'Published';
    const score = published ? percentage(subject) : 0;
    const scoreColor = gradeColor(score);
    const requested = revaluationSubmitted.includes(subject.id);

    return (
      <Pressable
        key={subject.id}
        onPress={() => setSelectedSubject(subject)}
        className="mb-3 overflow-hidden rounded-3xl border"
        style={{
          backgroundColor: C.white,
          borderColor: C.border,
        }}
      >
        <View className="p-4">
          <View className="flex-row items-center">
            <View
              className="h-11 w-11 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: published ? C.blueSoft : C.orangeSoft,
              }}
            >
              <Ionicons
                name={published ? 'book-outline' : 'time-outline'}
                size={20}
                color={published ? C.blue : C.orange}
              />
            </View>

            <View className="ml-3 flex-1 pr-2">
              <Text
                className="text-sm font-extrabold"
                style={{ color: C.navy }}
              >
                {subject.name}
              </Text>
              <Text className="mt-1 text-[10px]" style={{ color: C.muted }}>
                {subject.code} · {subject.credits} credits
              </Text>
            </View>

            <StatusPill status={subject.status} />
          </View>

          <View
            className="my-4 h-px"
            style={{ backgroundColor: C.border }}
          />

          {published ? (
            <>
              <View className="flex-row items-end justify-between">
                <View>
                  <Text
                    className="text-[10px] font-semibold"
                    style={{ color: C.muted }}
                  >
                    TOTAL SCORE
                  </Text>

                  <View className="mt-1 flex-row items-baseline">
                    <Text
                      className="text-3xl font-extrabold"
                      style={{ color: C.navy }}
                    >
                      {totalMarks(subject)}
                    </Text>
                    <Text className="ml-1 text-xs" style={{ color: C.muted }}>
                      / {maximumMarks(subject)}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text
                    className="text-2xl font-extrabold"
                    style={{ color: scoreColor }}
                  >
                    {score.toFixed(1)}%
                  </Text>
                  <Text
                    className="mt-0.5 text-[10px] font-bold"
                    style={{ color: scoreColor }}
                  >
                    Grade {grade(score)}
                  </Text>
                </View>
              </View>

              <View className="mt-3">
                <ProgressBar value={score} color={scoreColor} />
              </View>

              <View className="mt-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-[10px]" style={{ color: C.muted }}>
                    Internal marks
                  </Text>
                  <Text
                    className="mt-1 text-xs font-extrabold"
                    style={{ color: C.navy }}
                  >
                    {internalMarks(subject)} / {internalMaximum(subject)}
                  </Text>
                </View>

                <Pressable
                  onPress={() => openRevaluation(subject)}
                  className="flex-row items-center rounded-xl px-3 py-2.5"
                  style={{
                    backgroundColor: requested ? C.greenSoft : C.blueSoft,
                  }}
                >
                  <Ionicons
                    name={requested ? 'checkmark-circle' : 'refresh-outline'}
                    size={15}
                    color={requested ? C.green : C.blue}
                  />
                  <Text
                    className="ml-1.5 text-[10px] font-bold"
                    style={{ color: requested ? C.green : C.blue }}
                  >
                    {requested ? 'Requested' : 'Revaluation'}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View
              className="flex-row items-center rounded-2xl p-3"
              style={{ backgroundColor: C.orangeSoft }}
            >
              <Ionicons
                name="hourglass-outline"
                size={17}
                color={C.orange}
              />
              <Text
                className="ml-2 flex-1 text-[11px] font-semibold"
                style={{ color: C.orange }}
              >
                Marks have not been published yet.
              </Text>
            </View>
          )}
        </View>

        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#FAFBFE' }}
        >
          <Text className="text-[10px] font-medium" style={{ color: C.muted }}>
            View subject details
          </Text>
          <Ionicons name="chevron-forward" size={16} color={C.muted} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: C.bg }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-5 pb-5 pt-3">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons name="arrow-back" size={20} color={C.navy} />
            </Pressable>

            <View className="ml-3 flex-1">
              <Text
                className="text-[10px] font-bold tracking-[2px]"
                style={{ color: C.blue }}
              >
                CAMPUSOS / STUDENT
              </Text>
              <Text
                className="mt-1 text-lg font-extrabold"
                style={{ color: C.navy }}
              >
                Academic results
              </Text>
            </View>

            <Pressable
              onPress={shareResults}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons name="share-social-outline" size={19} color={C.navy} />
            </Pressable>
          </View>
        </View>

        <View className="px-5">
          {/* Performance card */}
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
            {/* Decorative graphics */}
            <View
              className="absolute -right-10 -top-12 h-40 w-40 rounded-full"
              style={{ backgroundColor: 'rgba(111,132,238,0.10)' }}
            />
            <View
              className="absolute right-24 top-28 h-16 w-16 rounded-full"
              style={{ backgroundColor: 'rgba(170,142,237,0.10)' }}
            />
            <View
              className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full"
              style={{ backgroundColor: 'rgba(125,165,255,0.08)' }}
            />

            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[10px] font-extrabold tracking-[1.8px] text-[#6478E8]">
                  YOUR PERFORMANCE
                </Text>

                <Text className="mt-2 text-2xl font-extrabold text-[#202D49]">
                  Semester {selectedSemester}
                </Text>

                <Text className="mt-1 text-xs font-medium text-[#8994A8]">
                  {currentSemester?.academicYear ?? 'Academic year unavailable'}
                </Text>
              </View>

              <View className="rounded-2xl border border-white bg-white/80 p-3">
                <Ionicons name="school-outline" size={23} color={C.blue} />
              </View>
            </View>

            <View className="mt-7 flex-row items-center">
              <View className="h-[106px] w-[106px] items-center justify-center rounded-full border-[7px] border-[#DCE4FF] bg-white/80">
                <Text className="text-2xl font-extrabold text-[#202D49]">
                  {publishedSubjects.length ? average.toFixed(0) : '—'}
                  {publishedSubjects.length ? '%' : ''}
                </Text>
                <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#8994A8]">
                  AVERAGE
                </Text>
              </View>

              <View className="ml-5 flex-1">
                <Text className="text-xs font-medium text-[#8994A8]">
                  Published subjects
                </Text>

                <Text className="mt-1 text-2xl font-extrabold text-[#202D49]">
                  {publishedSubjects.length}
                  <Text className="text-sm font-semibold text-[#8994A8]">
                    {' '}/ {subjects.length}
                  </Text>
                </Text>

                <View className="mt-3">
                  <ProgressBar
                    value={
                      subjects.length
                        ? (publishedSubjects.length / subjects.length) * 100
                        : 0
                    }
                    color={C.blue}
                    track="#DDE4F4"
                    height={6}
                  />
                </View>

                <View className="mt-2 flex-row items-center">
                  <Ionicons name="time-outline" size={13} color={C.orange} />
                  <Text className="ml-1 text-[10px] font-medium text-[#8994A8]">
                    {pendingCount} result{pendingCount === 1 ? '' : 's'} pending
                  </Text>
                </View>
              </View>
            </View>

            <View className="my-5 h-px bg-[#DFE5F2]" />

            <View className="flex-row">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="albums-outline" size={13} color={C.blue} />
                  <Text className="ml-1 text-[9px] font-bold tracking-wide text-[#8994A8]">
                    TOTAL CREDITS
                  </Text>
                </View>
                <Text className="mt-2 text-base font-extrabold text-[#202D49]">
                  {totalCredits}
                </Text>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={13}
                    color={C.green}
                  />
                  <Text className="ml-1 text-[9px] font-bold tracking-wide text-[#8994A8]">
                    EARNED CREDITS
                  </Text>
                </View>
                <Text className="mt-2 text-base font-extrabold text-[#199B78]">
                  {publishedCredits}
                </Text>
              </View>

              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="pulse-outline" size={13} color={C.purple} />
                  <Text className="ml-1 text-[9px] font-bold tracking-wide text-[#8994A8]">
                    STATUS
                  </Text>
                </View>
                <Text
                  className="mt-2 text-xs font-extrabold"
                  style={{ color: allPublished ? C.green : C.orange }}
                >
                  {allPublished ? 'Complete' : 'In progress'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Semester selector */}
          <View className="mt-7">
            <SectionHeading
              title="Select semester"
              subtitle="Choose a semester to view your academic records"
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (semester) => {
                  const active = selectedSemester === semester;

                  return (
                    <Pressable
                      key={semester}
                      onPress={() => changeSemester(semester)}
                      className="mr-2 items-center justify-center rounded-2xl px-5 py-3"
                      style={{
                        minWidth: 58,
                        backgroundColor: active ? C.blue : C.white,
                        borderWidth: 1,
                        borderColor: active ? C.blue : C.border,
                      }}
                    >
                      <Text
                        className="text-xs font-extrabold"
                        style={{ color: active ? C.white : C.muted }}
                      >
                        S{semester}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
          </View>

          {/* Quick summary */}
          <View className="mt-6 flex-row" style={{ gap: 12 }}>
            <StatCard
              icon="checkmark-circle-outline"
              label="Published"
              value={`${publishedSubjects.length}/${subjects.length}`}
              color={C.green}
              background={C.greenSoft}
            />
            <StatCard
              icon="time-outline"
              label="Pending"
              value={String(pendingCount)}
              color={C.orange}
              background={C.orangeSoft}
            />
          </View>

          {/* Assessment breakdown */}
          <View className="mt-8">
            <SectionHeading
              title="Assessment breakdown"
              subtitle="Track your marks across assessments"
            />

            <View
              className="rounded-3xl border p-4"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <View
                className="flex-row rounded-2xl p-1"
                style={{ backgroundColor: '#F1F4FA' }}
              >
                {(['Internal', 'Semester Exam'] as ExamTab[]).map((tab) => {
                  const active = examTab === tab;

                  return (
                    <Pressable
                      key={tab}
                      onPress={() => setExamTab(tab)}
                      className="flex-1 flex-row items-center justify-center rounded-xl py-3"
                      style={{
                        backgroundColor: active ? C.navy : 'transparent',
                      }}
                    >
                      <Ionicons
                        name={
                          tab === 'Internal'
                            ? 'clipboard-outline'
                            : 'school-outline'
                        }
                        size={15}
                        color={active ? C.white : C.muted}
                      />
                      <Text
                        className="ml-2 text-xs font-bold"
                        style={{ color: active ? C.white : C.muted }}
                      >
                        {tab}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {examTab === 'Internal' ? (
                <>
                  <View className="mt-5 flex-row items-center justify-between">
                    <View>
                      <Text
                        className="text-sm font-extrabold"
                        style={{ color: C.navy }}
                      >
                        Internal assessments
                      </Text>
                      <Text
                        className="mt-1 text-[10px]"
                        style={{ color: C.muted }}
                      >
                        Select an assessment
                      </Text>
                    </View>

                    <View
                      className="flex-row rounded-xl p-1"
                      style={{ backgroundColor: '#F0F3F9' }}
                    >
                      {([1, 2] as const).map((mid) => {
                        const active = selectedMid === mid;

                        return (
                          <Pressable
                            key={mid}
                            onPress={() => setSelectedMid(mid)}
                            className="rounded-lg px-3 py-2"
                            style={{
                              backgroundColor: active ? C.blue : 'transparent',
                            }}
                          >
                            <Text
                              className="text-[10px] font-extrabold"
                              style={{ color: active ? C.white : C.muted }}
                            >
                              Mid {mid}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View className="mt-5">
                    {subjects.length ? (
                      subjects.map((subject) => {
                        const marks =
                          selectedMid === 1 ? subject.mid1 : subject.mid2;

                        const isPending =
                          subject.status === 'Pending' &&
                          marks.obtained === 0;

                        const score =
                          marks.total > 0
                            ? (marks.obtained / marks.total) * 100
                            : 0;

                        return (
                          <View
                            key={subject.id}
                            className="mb-4 rounded-2xl border p-4"
                            style={{
                              backgroundColor: '#FCFDFF',
                              borderColor: C.border,
                            }}
                          >
                            <View className="mb-3 flex-row items-center justify-between">
                              <View className="flex-1 pr-3">
                                <Text
                                  className="text-xs font-bold"
                                  style={{ color: C.text }}
                                >
                                  {subject.name}
                                </Text>
                                <Text
                                  className="mt-1 text-[10px]"
                                  style={{ color: C.muted }}
                                >
                                  {subject.code}
                                </Text>
                              </View>

                              <View className="items-end">
                                <Text
                                  className="text-sm font-extrabold"
                                  style={{
                                    color: isPending ? C.orange : C.navy,
                                  }}
                                >
                                  {isPending
                                    ? 'Pending'
                                    : `${marks.obtained}/${marks.total}`}
                                </Text>
                                {!isPending ? (
                                  <Text
                                    className="mt-0.5 text-[10px] font-semibold"
                                    style={{ color: C.blue }}
                                  >
                                    {score.toFixed(0)}%
                                  </Text>
                                ) : null}
                              </View>
                            </View>

                            <ProgressBar
                              value={isPending ? 0 : score}
                              color={C.blue}
                            />
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        className="py-6 text-center text-xs"
                        style={{ color: C.muted }}
                      >
                        No subjects available for this semester.
                      </Text>
                    )}
                  </View>

                  {publishedSubjects.length > 0 ? (
                    <View
                      className="mt-1 rounded-2xl p-4"
                      style={{ backgroundColor: C.blueSoft }}
                    >
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text
                            className="text-[10px] font-bold"
                            style={{ color: C.muted }}
                          >
                            INTERNAL AVERAGE
                          </Text>
                          <Text
                            className="mt-1 text-2xl font-extrabold"
                            style={{ color: C.navy }}
                          >
                            {internalAverage.toFixed(1)}%
                          </Text>
                        </View>

                        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
                          <Ionicons
                            name="trending-up-outline"
                            size={22}
                            color={C.blue}
                          />
                        </View>
                      </View>

                      <View className="mt-3">
                        <ProgressBar
                          value={internalAverage}
                          color={C.blue}
                          track="#DCE5FF"
                          height={8}
                        />
                      </View>
                    </View>
                  ) : null}
                </>
              ) : (
                <View className="mt-5">
                  {subjects.length ? (
                    subjects.map((subject) => {
                      const marks = subject.semesterExam;
                      const isPending = subject.status === 'Pending';
                      const score =
                        marks.total > 0
                          ? (marks.obtained / marks.total) * 100
                          : 0;

                      return (
                        <View
                          key={subject.id}
                          className="mb-4 rounded-2xl border p-4"
                          style={{
                            backgroundColor: '#FCFDFF',
                            borderColor: C.border,
                          }}
                        >
                          <View className="mb-3 flex-row items-center justify-between">
                            <View className="flex-1 pr-3">
                              <Text
                                className="text-xs font-bold"
                                style={{ color: C.text }}
                              >
                                {subject.name}
                              </Text>
                              <Text
                                className="mt-1 text-[10px]"
                                style={{ color: C.muted }}
                              >
                                {subject.code}
                              </Text>
                            </View>

                            <Text
                              className="text-sm font-extrabold"
                              style={{
                                color: isPending ? C.orange : C.purple,
                              }}
                            >
                              {isPending
                                ? 'Pending'
                                : `${marks.obtained}/${marks.total}`}
                            </Text>
                          </View>

                          <ProgressBar
                            value={isPending ? 0 : score}
                            color={C.purple}
                            track="#F0ECFA"
                          />
                        </View>
                      );
                    })
                  ) : (
                    <Text
                      className="py-6 text-center text-xs"
                      style={{ color: C.muted }}
                    >
                      No subjects available for this semester.
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Performance insights */}
          <View className="mt-8">
            <SectionHeading
              title="Performance insights"
              subtitle="Your strongest and weakest subjects"
            />

            {publishedSubjects.length > 0 ? (
              <View
                className="rounded-3xl border p-4"
                style={{
                  backgroundColor: C.white,
                  borderColor: C.border,
                }}
              >
                <LinearGradient
                  colors={['#EEF3FF', '#F5F2FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20,
                    padding: 16,
                  }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{ color: C.muted }}
                  >
                    OVERALL AVERAGE
                  </Text>

                  <View className="mt-2 flex-row items-baseline">
                    <Text
                      className="text-4xl font-extrabold"
                      style={{ color: C.navy }}
                    >
                      {average.toFixed(1)}
                    </Text>
                    <Text
                      className="ml-1 text-base font-bold"
                      style={{ color: C.muted }}
                    >
                      %
                    </Text>
                  </View>

                  <View className="mt-4">
                    <ProgressBar
                      value={average}
                      color={C.green}
                      track="#DFEAE6"
                      height={8}
                    />
                  </View>

                  <Text
                    className="mt-2 text-[10px]"
                    style={{ color: C.muted }}
                  >
                    Based on {publishedSubjects.length} published subjects
                  </Text>
                </LinearGradient>

                <View className="mt-4 flex-row" style={{ gap: 10 }}>
                  {strongestSubject ? (
                    <View
                      className="flex-1 rounded-2xl p-3"
                      style={{ backgroundColor: C.greenSoft }}
                    >
                      <Ionicons
                        name="trophy-outline"
                        size={19}
                        color={C.green}
                      />
                      <Text
                        className="mt-2 text-[9px] font-extrabold tracking-wider"
                        style={{ color: C.green }}
                      >
                        TOP SUBJECT
                      </Text>
                      <Text
                        numberOfLines={2}
                        className="mt-1 text-xs font-bold"
                        style={{ color: C.navy }}
                      >
                        {strongestSubject.name}
                      </Text>
                      <Text
                        className="mt-2 text-base font-extrabold"
                        style={{ color: C.green }}
                      >
                        {percentage(strongestSubject).toFixed(1)}%
                      </Text>
                    </View>
                  ) : null}

                  {weakestSubject &&
                  weakestSubject.id !== strongestSubject?.id ? (
                    <View
                      className="flex-1 rounded-2xl p-3"
                      style={{ backgroundColor: C.orangeSoft }}
                    >
                      <Ionicons
                        name="book-outline"
                        size={19}
                        color={C.orange}
                      />
                      <Text
                        className="mt-2 text-[9px] font-extrabold tracking-wider"
                        style={{ color: C.orange }}
                      >
                        NEEDS ATTENTION
                      </Text>
                      <Text
                        numberOfLines={2}
                        className="mt-1 text-xs font-bold"
                        style={{ color: C.navy }}
                      >
                        {weakestSubject.name}
                      </Text>
                      <Text
                        className="mt-2 text-base font-extrabold"
                        style={{ color: C.orange }}
                      >
                        {percentage(weakestSubject).toFixed(1)}%
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <View
                className="items-center rounded-3xl border p-7"
                style={{
                  backgroundColor: C.white,
                  borderColor: C.border,
                }}
              >
                <Ionicons
                  name="analytics-outline"
                  size={28}
                  color={C.blue}
                />
                <Text
                  className="mt-3 text-sm font-extrabold"
                  style={{ color: C.navy }}
                >
                  Insights will appear here
                </Text>
                <Text
                  className="mt-1 text-center text-xs leading-5"
                  style={{ color: C.muted }}
                >
                  Published results are needed to calculate your performance.
                </Text>
              </View>
            )}
          </View>

          {/* Subject list */}
          <View className="mt-8">
            <SectionHeading
              title="Your subjects"
              subtitle={`${subjects.length} subjects · Semester ${selectedSemester}`}
            />

            {/* Search */}
            <View
              className="mb-3 flex-row items-center rounded-2xl border px-4"
              style={{
                backgroundColor: C.white,
                borderColor: C.border,
              }}
            >
              <Ionicons name="search-outline" size={18} color={C.muted} />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search subject or faculty"
                placeholderTextColor={C.muted}
                className="flex-1 py-4 pl-3 text-xs"
                style={{ color: C.navy }}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />

              {search.length > 0 ? (
                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={C.muted}
                  />
                </Pressable>
              ) : null}
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {(['All', 'Published', 'Pending'] as ResultFilter[]).map(
                (item) => {
                  const active = filter === item;
                  const count =
                    item === 'All'
                      ? subjects.length
                      : subjects.filter(
                          (subject) => subject.status === item,
                        ).length;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setFilter(item)}
                      className="mr-2 flex-row items-center rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: active ? C.navy : C.white,
                        borderWidth: 1,
                        borderColor: active ? C.navy : C.border,
                      }}
                    >
                      <Text
                        className="text-[11px] font-bold"
                        style={{ color: active ? C.white : C.muted }}
                      >
                        {item}
                      </Text>

                      <View
                        className="ml-2 rounded-md px-1.5 py-0.5"
                        style={{
                          backgroundColor: active ? '#405071' : '#F0F3F8',
                        }}
                      >
                        <Text
                          className="text-[9px] font-extrabold"
                          style={{ color: active ? C.white : C.muted }}
                        >
                          {count}
                        </Text>
                      </View>
                    </Pressable>
                  );
                },
              )}
            </ScrollView>

            {filteredSubjects.length > 0 ? (
              filteredSubjects.map(renderSubject)
            ) : (
              <View
                className="items-center rounded-3xl border p-8"
                style={{
                  backgroundColor: C.white,
                  borderColor: C.border,
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={28}
                  color={C.blue}
                />
                <Text
                  className="mt-3 text-sm font-extrabold"
                  style={{ color: C.navy }}
                >
                  No subjects found
                </Text>
                <Text
                  className="mt-1 text-center text-xs"
                  style={{ color: C.muted }}
                >
                  Try another search or change the filter.
                </Text>
              </View>
            )}
          </View>

          {/* Publication status */}
          <View
            className="mt-2 flex-row items-start rounded-2xl p-4"
            style={{
              backgroundColor: allPublished ? C.greenSoft : C.blueSoft,
            }}
          >
            <Ionicons
              name={
                allPublished
                  ? 'checkmark-circle-outline'
                  : 'information-circle-outline'
              }
              size={21}
              color={allPublished ? C.green : C.blue}
            />

            <View className="ml-3 flex-1">
              <Text
                className="text-xs font-extrabold"
                style={{ color: C.navy }}
              >
                {subjects.length === 0
                  ? 'No semester data'
                  : allPublished
                    ? 'All results are published'
                    : 'Some results are still pending'}
              </Text>

              <Text
                className="mt-1 text-[11px] leading-5"
                style={{ color: C.muted }}
              >
                {subjects.length === 0
                  ? 'No subjects are available for this semester.'
                  : allPublished
                    ? 'Your semester results are ready to view.'
                    : `${pendingCount} subject${pendingCount === 1 ? ' is' : 's are'} awaiting publication.`}
              </Text>
            </View>
          </View>

          <Text
            className="mt-6 text-center text-[10px] font-semibold tracking-wider"
            style={{ color: C.muted }}
          >
            CAMPUSOS · ACADEMIC RECORDS
          </Text>
        </View>
      </ScrollView>

      {/* Subject details modal */}
      <Modal
        visible={!!selectedSubject}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSubject(null)}
        statusBarTranslucent
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: '#10182D99' }}
        >
          <Pressable
            className="flex-1"
            onPress={() => setSelectedSubject(null)}
          />

          <View
            className="rounded-t-[30px] px-5 pb-8 pt-4"
            style={{
              backgroundColor: C.bg,
              maxHeight: '86%',
            }}
          >
            <View
              className="mb-5 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: '#D6DAE5' }}
            />

            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className="text-[10px] font-extrabold tracking-[2px]"
                  style={{ color: C.blue }}
                >
                  SUBJECT DETAILS
                </Text>
                <Text
                  className="mt-1 text-xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  {selectedSubject?.name}
                </Text>
              </View>

              <Pressable
                onPress={() => setSelectedSubject(null)}
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: C.white }}
              >
                <Ionicons name="close" size={21} color={C.navy} />
              </Pressable>
            </View>

            {selectedSubject ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  className="mb-4 rounded-2xl p-4"
                  style={{ backgroundColor: C.white }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-3">
                      <Text
                        className="text-[10px] font-semibold"
                        style={{ color: C.muted }}
                      >
                        SUBJECT CODE
                      </Text>
                      <Text
                        className="mt-1 text-base font-extrabold"
                        style={{ color: C.navy }}
                      >
                        {selectedSubject.code}
                      </Text>
                      <Text
                        className="mt-1 text-xs"
                        style={{ color: C.muted }}
                      >
                        {selectedSubject.credits} credits
                      </Text>
                    </View>

                    <StatusPill status={selectedSubject.status} />
                  </View>

                  <View
                    className="my-4 h-px"
                    style={{ backgroundColor: C.border }}
                  />

                  <Text
                    className="text-[10px] font-semibold"
                    style={{ color: C.muted }}
                  >
                    FACULTY
                  </Text>
                  <Text
                    className="mt-1 text-sm font-bold"
                    style={{ color: C.navy }}
                  >
                    {selectedSubject.faculty}
                  </Text>
                </View>

                <View
                  className="mb-4 rounded-2xl border p-4"
                  style={{
                    backgroundColor: C.white,
                    borderColor: C.border,
                  }}
                >
                  <Text
                    className="mb-5 text-sm font-extrabold"
                    style={{ color: C.navy }}
                  >
                    Marks breakdown
                  </Text>

                  {(
                    [
                      {
                        label: 'Midterm 1',
                        marks: selectedSubject.mid1,
                        color: C.blue,
                      },
                      {
                        label: 'Midterm 2',
                        marks: selectedSubject.mid2,
                        color: C.purple,
                      },
                      {
                        label: 'Semester examination',
                        marks: selectedSubject.semesterExam,
                        color: C.green,
                      },
                    ] as const
                  ).map((item) => {
                    const pending =
                      selectedSubject.status === 'Pending' &&
                      item.marks.obtained === 0;

                    const score =
                      item.marks.total > 0
                        ? (item.marks.obtained / item.marks.total) * 100
                        : 0;

                    return (
                      <View key={item.label} className="mb-5">
                        <View className="mb-2 flex-row items-center justify-between">
                          <Text
                            className="text-xs font-semibold"
                            style={{ color: C.text }}
                          >
                            {item.label}
                          </Text>
                          <Text
                            className="text-xs font-extrabold"
                            style={{
                              color: pending ? C.orange : C.navy,
                            }}
                          >
                            {pending
                              ? 'Pending'
                              : `${item.marks.obtained} / ${item.marks.total}`}
                          </Text>
                        </View>

                        <ProgressBar
                          value={pending ? 0 : score}
                          color={item.color}
                        />
                      </View>
                    );
                  })}

                  {selectedSubject.status === 'Published' ? (
                    <View
                      className="rounded-2xl p-4"
                      style={{ backgroundColor: C.blueSoft }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color: C.muted }}
                      >
                        OVERALL SCORE
                      </Text>

                      <View className="mt-2 flex-row items-baseline justify-between">
                        <Text
                          className="text-2xl font-extrabold"
                          style={{ color: C.navy }}
                        >
                          {totalMarks(selectedSubject)}
                          <Text
                            className="text-sm font-medium"
                            style={{ color: C.muted }}
                          >
                            {' '}/ {maximumMarks(selectedSubject)}
                          </Text>
                        </Text>

                        <Text
                          className="text-lg font-extrabold"
                          style={{
                            color: gradeColor(percentage(selectedSubject)),
                          }}
                        >
                          {percentage(selectedSubject).toFixed(1)}%
                        </Text>
                      </View>

                      <View className="mt-3">
                        <ProgressBar
                          value={percentage(selectedSubject)}
                          color={gradeColor(percentage(selectedSubject))}
                        />
                      </View>

                      <View className="mt-4 flex-row items-center justify-between">
                        <Text
                          className="text-xs"
                          style={{ color: C.muted }}
                        >
                          Grade
                        </Text>
                        <Text
                          className="text-base font-extrabold"
                          style={{ color: C.navy }}
                        >
                          {grade(percentage(selectedSubject))}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      className="rounded-xl p-4"
                      style={{ backgroundColor: C.orangeSoft }}
                    >
                      <Text
                        className="text-sm font-extrabold"
                        style={{ color: C.orange }}
                      >
                        Final result pending
                      </Text>
                      <Text
                        className="mt-1 text-xs leading-5"
                        style={{ color: C.text }}
                      >
                        Final marks will appear here after the result is
                        published.
                      </Text>
                    </View>
                  )}
                </View>

                {selectedSubject.status === 'Published' ? (
                  <Pressable
                    onPress={() => openRevaluation(selectedSubject)}
                    className="mb-3 flex-row items-center justify-center rounded-2xl py-4"
                    style={{ backgroundColor: C.navy }}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={18}
                      color={C.white}
                    />
                    <Text className="ml-2 text-sm font-bold text-white">
                      Request revaluation
                    </Text>
                  </Pressable>
                ) : null}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Revaluation modal */}
      <Modal
        visible={!!revaluationSubject}
        transparent
        animationType="fade"
        onRequestClose={() => setRevaluationSubject(null)}
        statusBarTranslucent
      >
        <View
          className="flex-1 items-center justify-center px-5"
          style={{ backgroundColor: '#10182D99' }}
        >
          <View
            className="w-full rounded-3xl p-5"
            style={{ backgroundColor: C.white }}
          >
            <View className="mb-5 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View
                  className="h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: C.blueSoft }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={C.blue}
                  />
                </View>

                <Text
                  className="mt-4 text-xl font-extrabold"
                  style={{ color: C.navy }}
                >
                  Revaluation request
                </Text>

                <Text
                  className="mt-1 text-xs leading-5"
                  style={{ color: C.muted }}
                >
                  {revaluationSubject?.code} · {revaluationSubject?.name}
                </Text>
              </View>

              <Pressable
                onPress={() => setRevaluationSubject(null)}
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={19} color={C.navy} />
              </Pressable>
            </View>

            <Text
              className="mb-2 text-xs font-extrabold"
              style={{ color: C.navy }}
            >
              REASON FOR REVIEW
            </Text>

            <TextInput
              value={revaluationReason}
              onChangeText={setRevaluationReason}
              placeholder="Explain why you would like this paper reviewed..."
              placeholderTextColor={C.muted}
              multiline
              textAlignVertical="top"
              className="min-h-32 rounded-xl border p-4 text-sm"
              style={{
                color: C.navy,
                borderColor: C.border,
                backgroundColor: C.bg,
              }}
              maxLength={500}
            />

            <Text
              className="mt-2 text-right text-[10px]"
              style={{ color: C.muted }}
            >
              {revaluationReason.length}/500 characters
            </Text>

            <Pressable
              onPress={submitRevaluation}
              className="mt-4 items-center rounded-xl py-4"
              style={{ backgroundColor: C.navy }}
            >
              <Text className="text-sm font-bold text-white">
                Submit request
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setRevaluationSubject(null)}
              className="mt-3 items-center py-2"
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: C.muted }}
              >
                Cancel
              </Text>
            </Pressable>

            <Text
              className="mt-2 text-center text-[10px] leading-4"
              style={{ color: C.muted }}
            >
              Demo only. A backend is required to submit this request to your
              college.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
