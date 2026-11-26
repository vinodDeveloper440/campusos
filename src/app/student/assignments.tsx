import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
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

type AssignmentStatus = 'Pending' | 'Submitted';
type SubmissionMethod = 'Online' | 'Physical';

type Assignment = {
  id: string;
  title: string;
  subject: string;
  professor: string;
  due: string;
  submissionMethod: SubmissionMethod;
  status: AssignmentStatus;
  documentName?: string;
};

type PopupType = 'online' | 'physical' | 'reopen' | 'success' | 'error';

type PopupData = {
  type: PopupType;
  title: string;
  message: string;
  actionLabel: string;
};

const COLORS = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  bg: '#F6F8FC',
  border: '#EAEFF5',
  green: '#23966B',
  red: '#D95463',
  orange: '#D99435',
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const initialAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Mathematics problem set',
    subject: 'Mathematics',
    professor: 'Dr. Priya Sharma',
    due: dateKey(addDays(new Date(), 1)),
    submissionMethod: 'Online',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Physics laboratory record',
    subject: 'Physics',
    professor: 'Prof. Arun Kumar',
    due: dateKey(new Date()),
    submissionMethod: 'Physical',
    status: 'Pending',
  },
  {
    id: '3',
    title: 'Data Structures assignment',
    subject: 'Computer Science',
    professor: 'Dr. Meena Raj',
    due: dateKey(addDays(new Date(), 3)),
    submissionMethod: 'Online',
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Software engineering report',
    subject: 'Software Engineering',
    professor: 'Prof. Karthik',
    due: dateKey(addDays(new Date(), -1)),
    submissionMethod: 'Online',
    status: 'Submitted',
    documentName: 'software_report.pdf',
  },
];

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [filter, setFilter] = useState<'All' | AssignmentStatus>('All');
  const [search, setSearch] = useState('');

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [popup, setPopup] = useState<PopupData | null>(null);

  const todayKey = dateKey(new Date());

  const pendingCount = assignments.filter(
    item => item.status === 'Pending',
  ).length;

  const submittedCount = assignments.filter(
    item => item.status === 'Submitted',
  ).length;

  const overdueCount = assignments.filter(
    item => item.status === 'Pending' && item.due < todayKey,
  ).length;

  const dueTodayCount = assignments.filter(
    item => item.status === 'Pending' && item.due === todayKey,
  ).length;

  const completion = assignments.length
    ? Math.round((submittedCount / assignments.length) * 100)
    : 0;

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter(item => {
      const matchesFilter =
        filter === 'All' || item.status === filter;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.professor.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [assignments, filter, search]);

  const formatDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const daysRemaining = (value: string) => {
    const due = new Date(`${value}T00:00:00`);
    const current = new Date();
    current.setHours(0, 0, 0, 0);

    return Math.round(
      (due.getTime() - current.getTime()) / 86400000,
    );
  };

  const isOverdue = (item: Assignment) =>
    item.status === 'Pending' && item.due < todayKey;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/student');
    }
  };

  const closePopup = () => {
    setPopup(null);
    setSelectedAssignment(null);
    setSelectedFile(null);
  };

  const updateAssignment = (
    id: string,
    updates: Partial<Assignment>,
  ) => {
    setAssignments(current =>
      current.map(item =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const showSuccess = (message: string) => {
    setPopup({
      type: 'success',
      title: 'Submission successful',
      message,
      actionLabel: 'Done',
    });
  };

  const submitOnline = async (assignment: Assignment) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setSelectedAssignment(assignment);
      setSelectedFile(result.assets[0]);

      setPopup({
        type: 'online',
        title: 'Review your submission',
        message:
          'Make sure you selected the correct document before confirming.',
        actionLabel: 'Confirm submission',
      });
    } catch {
      setPopup({
        type: 'error',
        title: 'Unable to select file',
        message: 'Please try selecting your document again.',
        actionLabel: 'Close',
      });
    }
  };

  const submitPhysical = (assignment: Assignment) => {
    setSelectedAssignment(assignment);

    setPopup({
      type: 'physical',
      title: 'Confirm hand-in',
      message: `Have you handed this assignment to ${assignment.professor}?`,
      actionLabel: 'Yes, submitted',
    });
  };

  const reopenAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);

    setPopup({
      type: 'reopen',
      title: 'Reopen assignment?',
      message: 'This assignment will move back to Pending status.',
      actionLabel: 'Reopen assignment',
    });
  };

  const handleSubmission = (assignment: Assignment) => {
    if (assignment.status === 'Submitted') {
      reopenAssignment(assignment);
    } else if (assignment.submissionMethod === 'Online') {
      void submitOnline(assignment);
    } else {
      submitPhysical(assignment);
    }
  };

  const confirmPopupAction = () => {
    if (popup?.type === 'success' || popup?.type === 'error') {
      closePopup();
      return;
    }

    if (!selectedAssignment) {
      closePopup();
      return;
    }

    if (popup?.type === 'online' && selectedFile) {
      updateAssignment(selectedAssignment.id, {
        status: 'Submitted',
        documentName: selectedFile.name,
      });

      showSuccess(
        'Your online assignment has been marked as submitted.',
      );
    } else if (popup?.type === 'physical') {
      updateAssignment(selectedAssignment.id, {
        status: 'Submitted',
      });

      showSuccess(
        'Your physical assignment has been marked as submitted.',
      );
    } else if (popup?.type === 'reopen') {
      updateAssignment(selectedAssignment.id, {
        status: 'Pending',
        documentName: undefined,
      });

      closePopup();
    }
  };

  const popupIcon = () => {
    switch (popup?.type) {
      case 'online':
        return 'cloud-upload-outline';
      case 'physical':
        return 'hand-left-outline';
      case 'reopen':
        return 'refresh-outline';
      case 'error':
        return 'alert-circle-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F6F8FC]">
      <StatusBar barStyle="dark-content"/>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between bg-white px-5 py-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={goBack}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-slate-100"
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color={COLORS.navy}
              />
            </Pressable>

            <View className="ml-3">
              <Text className="text-[10px] font-extrabold tracking-[2px] text-[#6478E8]">
                CAMPUSOS
              </Text>
              <Text className="mt-0.5 text-base font-extrabold text-[#202B49]">
                Assignments
              </Text>
            </View>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
            <Ionicons
              name="document-text-outline"
              size={21}
              color="#6478E8"
            />
          </View>
        </View>

{/* PREMIUM GRADIENT BACKGROUND HERO */}
<View className="px-4 pb-5 pt-4">
  <LinearGradient
    colors={['#DCE8FF', '#E9E4FF', '#F4E9FF', '#E8F3FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      borderRadius: 30,
      padding: 19,
      overflow: 'hidden',
    }}
  >
    {/* Decorative gradient circles */}
    <View
      className="absolute rounded-full"
      style={{
        width: 170,
        height: 170,
        backgroundColor: '#FFFFFF',
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
        backgroundColor: '#B7C6FF',
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
            CAMPUSOS • ACADEMICS
          </Text>
        </View>

        <Text className="mt-4 text-[29px] font-extrabold text-[#202B49]">
          Stay on track.
        </Text>

        <Text className="mt-2 max-w-[250px] text-xs leading-5 text-[#687797]">
          Keep your assignments organised and make every deadline count.
        </Text>
      </View>

      <View className="h-[58px] w-[58px] items-center justify-center rounded-[20px] bg-white/80">
        <Ionicons name="book-outline" size={28} color="#6478E8" />
      </View>
    </View>

    {/* Progress */}
    <View className="mt-6 rounded-[23px] bg-white/75 p-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] font-extrabold tracking-[1.2px] text-[#8792AD]">
            OVERALL COMPLETION
          </Text>

          <View className="mt-1 flex-row items-baseline">
            <Text className="text-[39px] font-extrabold text-[#27365C]">
              {completion}
            </Text>
            <Text className="ml-1 text-xl font-bold text-[#6478E8]">%</Text>
          </View>

          <Text className="mt-1 text-[11px] text-[#8992A6]">
            {submittedCount} of {assignments.length} completed
          </Text>
        </View>

        <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-[#E7EBFF]">
          <Ionicons name="trophy" size={22} color="#6478E8" />
          <Text className="mt-1 text-sm font-extrabold text-[#6478E8]">
            {completion}%
          </Text>
        </View>
      </View>

      <View className="mt-4 h-[8px] overflow-hidden rounded-full bg-[#DFE5F5]">
        <LinearGradient
          colors={['#6478E8', '#8794EE', '#B18CEB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: '100%',
            width: `${completion}%`,
            borderRadius: 20,
          }}
        />
      </View>
    </View>

    {/* Statistics */}
    <View className="mt-4 flex-row gap-2">
      <View className="flex-1 rounded-[18px] bg-white/75 p-3">
        <Ionicons name="time-outline" size={19} color="#C58B32" />
        <Text className="mt-3 text-[23px] font-extrabold text-[#B77A25]">
          {pendingCount}
        </Text>
        <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#A58A62]">
          PENDING
        </Text>
      </View>

      <View className="flex-1 rounded-[18px] bg-white/75 p-3">
        <Ionicons name="checkmark-circle-outline" size={19} color="#23966B" />
        <Text className="mt-3 text-[23px] font-extrabold text-[#23966B]">
          {submittedCount}
        </Text>
        <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#719C87]">
          SUBMITTED
        </Text>
      </View>

      <View className="flex-1 rounded-[18px] bg-white/75 p-3">
        <Ionicons name="alert-circle-outline" size={19} color="#D95463" />
        <Text className="mt-3 text-[23px] font-extrabold text-[#D95463]">
          {overdueCount}
        </Text>
        <Text className="mt-1 text-[9px] font-extrabold tracking-wider text-[#B98287]">
          OVERDUE
        </Text>
      </View>
    </View>

    {/* Deadline reminder */}
    <View className="mt-4 flex-row items-center rounded-[19px] bg-white/80 p-3">
      <View className="h-10 w-10 items-center justify-center rounded-[14px] bg-[#E9ECFF]">
        <Ionicons name="calendar-outline" size={20} color="#6478E8" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-xs font-extrabold text-[#27365C]">
          Today&apos;s deadlines
        </Text>
        <Text className="mt-1 text-[10px] leading-4 text-[#8992A6]">
          {dueTodayCount > 0
            ? `${dueTodayCount} assignment${dueTodayCount === 1 ? '' : 's'} due today.`
            : 'No assignments due today. Keep up the good work!'}
        </Text>
      </View>

      <View className={`rounded-xl px-3 py-2 ${
        dueTodayCount > 0 ? 'bg-[#FFF0D8]' : 'bg-[#E1F5E9]'
      }`}>
        <Text className={`text-[11px] font-extrabold ${
          dueTodayCount > 0 ? 'text-[#B77A25]' : 'text-[#23966B]'
        }`}>
          {dueTodayCount} Due
        </Text>
      </View>
    </View>
  </LinearGradient>
</View>

        {/* Deadline reminder */}
        {(overdueCount > 0 || dueTodayCount > 0) && (
          <View className="mx-5 mt-1 flex-row items-center rounded-2xl border border-rose-100 bg-white p-4">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
              <Ionicons
                name="notifications-outline"
                size={21}
                color="#D95463"
              />
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-sm font-extrabold text-[#202B49]">
                Deadline reminder
              </Text>

              <Text className="mt-1 text-xs leading-5 text-slate-500">
                {overdueCount > 0
                  ? `${overdueCount} overdue assignment(s) need your attention.`
                  : `${dueTodayCount} assignment(s) are due today.`}
              </Text>
            </View>

            <Ionicons
              name="alert-circle-outline"
              size={19}
              color="#D95463"
            />
          </View>
        )}

        {/* Search */}
        <View className="mx-5 mt-6 flex-row items-center rounded-2xl border border-[#E9EDF4] bg-white px-4">
          <Ionicons
            name="search-outline"
            size={20}
            color="#98A1B2"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search assignments..."
            placeholderTextColor="#A0A8B8"
            className="ml-3 flex-1 py-4 text-sm text-[#202B49]"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons
                name="close-circle"
                size={19}
                color="#98A1B2"
              />
            </Pressable>
          )}
        </View>

        {/* Assignment heading and filters */}
        <View className="mt-7 px-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-extrabold text-[#202B49]">
                Your assignments
              </Text>

              <Text className="mt-1 text-xs text-slate-500">
                Track and manage your coursework
              </Text>
            </View>

            <Text className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-500">
              {filteredAssignments.length} items
            </Text>
          </View>

          {/* Filters */}
          <View className="mt-4 flex-row rounded-2xl bg-[#EDEFF5] p-1">
            {(['All', 'Pending', 'Submitted'] as const).map(item => {
              const active = filter === item;

              const count =
                item === 'All'
                  ? assignments.length
                  : assignments.filter(a => a.status === item).length;

              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  className={`flex-1 flex-row items-center justify-center rounded-xl py-3 ${
                    active ? 'bg-white' : ''
                  }`}
                  style={
                    active
                      ? {
                          elevation: 2,
                          shadowColor: '#202B49',
                          shadowOpacity: 0.06,
                          shadowRadius: 4,
                        }
                      : undefined
                  }
                >
                  <Text
                    className={`text-xs font-bold ${
                      active ? 'text-indigo-700' : 'text-slate-500'
                    }`}
                  >
                    {item}
                  </Text>

                  <Text
                    className={`ml-1.5 text-[10px] font-bold ${
                      active ? 'text-indigo-500' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Assignment list */}
        <View className="mt-4 gap-4 px-5">
          {filteredAssignments.length === 0 ? (
            <View className="items-center rounded-[25px] border border-slate-100 bg-white px-6 py-12">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Ionicons
                  name="documents-outline"
                  size={29}
                  color="#6478E8"
                />
              </View>

              <Text className="mt-4 text-lg font-extrabold text-[#202B49]">
                No assignments found
              </Text>

              <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                Try another search or change your selected filter.
              </Text>

              <Pressable
                onPress={() => {
                  setSearch('');
                  setFilter('All');
                }}
                className="mt-4 rounded-xl bg-indigo-50 px-5 py-3"
              >
                <Text className="text-xs font-extrabold text-indigo-700">
                  Clear filters
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredAssignments.map(assignment => {
              const overdue = isOverdue(assignment);
              const remaining = daysRemaining(assignment.due);

              return (
                <View
                  key={assignment.id}
                  className="overflow-hidden rounded-[24px] border border-[#EAEFF5] bg-white"
                >
                  <View className="p-4">
                    {/* Assignment title */}
                    <View className="flex-row items-start">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F2FF]">
                        <Ionicons
                          name="document-text-outline"
                          size={23}
                          color="#6478E8"
                        />
                      </View>

                      <View className="ml-3 flex-1">
                        <Text className="text-[15px] font-extrabold leading-6 text-[#202B49]">
                          {assignment.title}
                        </Text>

                        <Text className="mt-1 text-xs font-medium text-slate-500">
                          {assignment.subject}
                        </Text>
                      </View>

                      <View
                        className={`flex-row items-center rounded-full px-3 py-1.5 ${
                          assignment.status === 'Submitted'
                            ? 'bg-emerald-50'
                            : 'bg-amber-50'
                        }`}
                      >
                        <View
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            assignment.status === 'Submitted'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />

                        <Text
                          className={`text-[10px] font-extrabold ${
                            assignment.status === 'Submitted'
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {assignment.status}
                        </Text>
                      </View>
                    </View>

                    {/* Professor */}
                    <View className="mt-4 flex-row items-center">
                      <Ionicons
                        name="person-outline"
                        size={17}
                        color="#98A1B2"
                      />

                      <Text className="ml-2 text-xs text-slate-500">
                        Assigned by
                      </Text>

                      <Text className="ml-1 flex-1 text-xs font-bold text-slate-700">
                        {assignment.professor}
                      </Text>
                    </View>

                    {/* Deadline */}
                    <View className="mt-4 rounded-2xl bg-[#F7F8FC] p-3.5">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <View
                            className={`h-10 w-10 items-center justify-center rounded-xl ${
                              overdue ? 'bg-rose-50' : 'bg-white'
                            }`}
                          >
                            <Ionicons
                              name="calendar-outline"
                              size={19}
                              color={overdue ? '#D95463' : '#6478E8'}
                            />
                          </View>

                          <View className="ml-3">
                            <Text className="text-[10px] font-bold tracking-wider text-slate-400">
                              DUE DATE
                            </Text>

                            <Text className="mt-1 text-xs font-extrabold text-[#202B49]">
                              {formatDate(assignment.due)}
                            </Text>
                          </View>
                        </View>

                        {assignment.status === 'Pending' && (
                          <View
                            className={`rounded-xl px-3 py-2 ${
                              overdue
                                ? 'bg-rose-50'
                                : remaining === 0
                                  ? 'bg-amber-50'
                                  : 'bg-indigo-50'
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-extrabold ${
                                overdue
                                  ? 'text-rose-600'
                                  : remaining === 0
                                    ? 'text-amber-700'
                                    : 'text-indigo-600'
                              }`}
                            >
                              {overdue
                                ? `${Math.abs(remaining)} days overdue`
                                : remaining === 0
                                  ? 'Due today'
                                  : `${remaining} days left`}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Submission method */}
                    <View className="mt-4 flex-row items-center">
                      <Ionicons
                        name={
                          assignment.submissionMethod === 'Online'
                            ? 'cloud-upload-outline'
                            : 'hand-left-outline'
                        }
                        size={17}
                        color="#8992A6"
                      />

                      <Text className="ml-2 text-xs font-semibold text-slate-500">
                        {assignment.submissionMethod} submission
                      </Text>
                    </View>

                    {/* Submitted document */}
                    {assignment.documentName && (
                      <View className="mt-3 flex-row items-center rounded-xl bg-emerald-50 p-3">
                        <Ionicons
                          name="document-attach-outline"
                          size={18}
                          color="#21865F"
                        />

                        <Text
                          numberOfLines={1}
                          className="ml-2 flex-1 text-xs font-bold text-emerald-700"
                        >
                          {assignment.documentName}
                        </Text>

                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color="#21865F"
                        />
                      </View>
                    )}

                    {/* Action button */}
                    <Pressable
                      onPress={() => handleSubmission(assignment)}
                      className="mt-4 overflow-hidden rounded-2xl"
                    >
                      {assignment.status === 'Submitted' ? (
                        <View className="flex-row items-center justify-center rounded-2xl bg-[#F0F2F7] py-3.5">
                          <Ionicons
                            name="refresh-outline"
                            size={17}
                            color="#64748B"
                          />

                          <Text className="ml-2 text-xs font-extrabold text-slate-600">
                            Reopen assignment
                          </Text>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={['#6478E8', '#8291F0']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 14,
                            borderRadius: 16,
                          }}
                        >
                          <Ionicons
                            name={
                              assignment.submissionMethod === 'Online'
                                ? 'cloud-upload-outline'
                                : 'checkmark-circle-outline'
                            }
                            size={17}
                            color="white"
                          />

                          <Text className="ml-2 text-xs font-extrabold text-white">
                            {assignment.submissionMethod === 'Online'
                              ? 'Upload assignment'
                              : 'Confirm hand-in'}
                          </Text>

                          <Ionicons
                            name="arrow-forward"
                            size={15}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        </LinearGradient>
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Information footer */}
        <View className="mx-5 mt-6 flex-row items-start rounded-2xl border border-indigo-100 bg-[#F0F2FF] p-4">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#6478E8"
          />

          <Text className="ml-2 flex-1 text-xs leading-5 text-indigo-800">
            Assignments are managed by your professors or connected academic system. Submissions shown here are local preview data until your backend is connected.
          </Text>
        </View>
      </ScrollView>

      {/* SUBMISSION MODAL */}
      <Modal
        visible={popup !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closePopup}
      >
        <View className="flex-1 items-center justify-center bg-[#17213A]/60 px-5">
          <View className="w-full max-w-[410px] overflow-hidden rounded-[28px] bg-white">
            <LinearGradient
              colors={
                popup?.type === 'success'
                  ? ['#E9F8F0', '#F8FCFA']
                  : popup?.type === 'error'
                    ? ['#FFF0F0', '#FFFAFA']
                    : ['#EEF1FF', '#F9FAFF']
              }
              style={{
                alignItems: 'center',
                paddingHorizontal: 24,
                paddingTop: 30,
                paddingBottom: 25,
              }}
            >
              <Pressable
                onPress={closePopup}
                className="absolute right-4 top-4 h-9 w-9 items-center justify-center rounded-full bg-white"
              >
                <Ionicons
                  name="close"
                  size={19}
                  color="#64748B"
                />
              </Pressable>

              <View className="h-[68px] w-[68px] items-center justify-center rounded-[22px] bg-white">
                <Ionicons
                  name={popupIcon() as any}
                  size={32}
                  color={
                    popup?.type === 'success'
                      ? '#21865F'
                      : popup?.type === 'error'
                        ? '#D95463'
                        : '#6478E8'
                  }
                />
              </View>

              <Text className="mt-5 text-center text-xl font-extrabold text-[#202B49]">
                {popup?.title}
              </Text>

              <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                {popup?.message}
              </Text>
            </LinearGradient>

            <View className="px-5 pb-5 pt-4">
              {/* Selected document */}
              {popup?.type === 'online' && selectedFile && (
                <View className="mb-4 flex-row items-center rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                    <Ionicons
                      name="document-text-outline"
                      size={21}
                      color="#6478E8"
                    />
                  </View>

                  <View className="ml-3 flex-1">
                    <Text className="text-[9px] font-extrabold tracking-widest text-indigo-500">
                      SELECTED DOCUMENT
                    </Text>

                    <Text
                      numberOfLines={1}
                      className="mt-1 text-xs font-bold text-[#202B49]"
                    >
                      {selectedFile.name}
                    </Text>
                  </View>

                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#21865F"
                  />
                </View>
              )}

              {/* Assignment details */}
              {selectedAssignment &&
                popup?.type !== 'success' &&
                popup?.type !== 'error' && (
                  <View className="mb-4 rounded-2xl bg-slate-50 p-3.5">
                    <Text className="text-[9px] font-extrabold tracking-widest text-slate-400">
                      ASSIGNMENT DETAILS
                    </Text>

                    <Text className="mt-1.5 text-sm font-extrabold text-[#202B49]">
                      {selectedAssignment.title}
                    </Text>

                    <Text className="mt-1 text-xs text-slate-500">
                      {selectedAssignment.subject}
                    </Text>
                  </View>
                )}

              {/* Confirm button */}
              <Pressable
                onPress={confirmPopupAction}
                className="overflow-hidden rounded-2xl"
              >
                <LinearGradient
                  colors={
                    popup?.type === 'reopen'
                      ? ['#64748B', '#8290A3']
                      : popup?.type === 'error'
                        ? ['#D95463', '#E77B85']
                        : ['#6478E8', '#8291F0']
                  }
                  style={{
                    alignItems: 'center',
                    borderRadius: 16,
                    paddingVertical: 15,
                  }}
                >
                  <Text className="text-sm font-extrabold text-white">
                    {popup?.actionLabel}
                  </Text>
                </LinearGradient>
              </Pressable>

              {/* Cancel */}
              {popup?.type !== 'success' &&
                popup?.type !== 'error' && (
                  <Pressable
                    onPress={closePopup}
                    className="mt-3 items-center rounded-2xl bg-slate-100 py-4"
                  >
                    <Text className="text-sm font-bold text-slate-600">
                      Cancel
                    </Text>
                  </Pressable>
                )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
