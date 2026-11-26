
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlannerAlert, {
  type PlannerAlertType,
} from '@/components/PlannerAlert';

type Priority = 'High' | 'Medium' | 'Low';
type Category = 'Study' | 'Assignment' | 'Exam' | 'Project';
type SubmissionMethod = 'Online' | 'Physical';

type Task = {
  id: string;
  title: string;
  subject: string;
  due: string;
  priority: Priority;
  category: Category;
  done: boolean;
  submissionMethod: SubmissionMethod;
  documentName?: string;
};

const C = {
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  bg: '#F8F9FE',
  border: '#E9EDF5',
  white: '#FFFFFF',
  green: '#259B78',
  orange: '#D99035',
  red: '#DC626B',
  purple: '#9277D6',
  paleBlue: '#EEF3FF',
  palePurple: '#F4F0FF',
};

const dateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const today = new Date();

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete mathematics assignment',
    subject: 'Mathematics',
    due: dateKey(addDays(today, 1)),
    priority: 'High',
    category: 'Assignment',
    done: false,
    submissionMethod: 'Online',
  },
  {
    id: '2',
    title: 'Prepare physics lab record',
    subject: 'Physics',
    due: dateKey(today),
    priority: 'Medium',
    category: 'Study',
    done: false,
    submissionMethod: 'Physical',
  },
  {
    id: '3',
    title: 'Review data structures',
    subject: 'Computer Science',
    due: dateKey(today),
    priority: 'High',
    category: 'Exam',
    done: false,
    submissionMethod: 'Online',
  },
  {
    id: '4',
    title: 'Project documentation',
    subject: 'Software Engineering',
    due: dateKey(addDays(today, 2)),
    priority: 'Low',
    category: 'Project',
    done: true,
    submissionMethod: 'Online',
  },
];

const categories: Category[] = [
  'Study',
  'Assignment',
  'Exam',
  'Project',
];

const priorityConfig = {
  High: {
    color: '#E46A78',
    bg: '#FFF0F1',
  },
  Medium: {
    color: '#D99035',
    bg: '#FFF6E9',
  },
  Low: {
    color: '#259B78',
    bg: '#EAF8F2',
  },
};

const categoryConfig: Record<
  Category,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  Study: {
    icon: 'book-outline',
    color: '#6478E8',
    bg: '#EEF0FF',
  },
  Assignment: {
    icon: 'document-text-outline',
    color: '#9277D6',
    bg: '#F3EFFF',
  },
  Exam: {
    icon: 'school-outline',
    color: '#DC626B',
    bg: '#FFF0F1',
  },
  Project: {
    icon: 'rocket-outline',
    color: '#259B78',
    bg: '#EAF8F2',
  },
};

const GradientButton = ({
  title,
  onPress,
  icon,
}: {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      borderRadius: 17,
      overflow: 'hidden',
      shadowColor: '#8797D8',
      shadowOpacity: 0.13,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }}
  >
    <LinearGradient
      colors={['#DCE5FF', '#E9E2FF', '#F3EDFF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        minHeight: 51,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        borderWidth: 1,
        borderColor: '#E0E5FF',
      }}
    >
      {icon && <Ionicons name={icon} size={19} color="#596BC5" />}
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#46598F' }}>
        {title}
      </Text>
    </LinearGradient>
  </Pressable>
);

const GraphicCircle = ({
  size,
  top,
  right,
  color,
}: {
  size: number;
  top: number;
  right: number;
  color: string;
}) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      width: size,
      height: size,
      top,
      right,
      borderRadius: size / 2,
      backgroundColor: color,
    }}
  />
);

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <View>
    <Text className="text-[21px] font-extrabold text-[#202B49]">
      {title}
    </Text>
    <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text>
  </View>
);

export default function PlannerScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Pending' | 'Completed'
  >('All');

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Assignment');
  const [submissionMethod, setSubmissionMethod] =
    useState<SubmissionMethod>('Online');

  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [submissionDocument, setSubmissionDocument] = useState('');

  const [plannerAlert, setPlannerAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: PlannerAlertType;
    confirmText: string;
    cancelText: string;
    showCancel: boolean;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Continue',
    cancelText: 'Cancel',
    showCancel: true,
    onConfirm: () => {},
  });

  const showPlannerAlert = (
    alertTitle: string,
    message: string,
    options?: {
      type?: PlannerAlertType;
      confirmText?: string;
      cancelText?: string;
      showCancel?: boolean;
      onConfirm?: () => void;
    },
  ) => {
    setPlannerAlert({
      visible: true,
      title: alertTitle,
      message,
      type: options?.type ?? 'info',
      confirmText: options?.confirmText ?? 'Continue',
      cancelText: options?.cancelText ?? 'Cancel',
      showCancel: options?.showCancel ?? true,
      onConfirm: options?.onConfirm ?? (() => {}),
    });
  };

  const closePlannerAlert = () => {
    setPlannerAlert((previous) => ({
      ...previous,
      visible: false,
    }));
  };

  const confirmPlannerAlert = () => {
    const action = plannerAlert.onConfirm;

    setPlannerAlert((previous) => ({
      ...previous,
      visible: false,
    }));

    action();
  };

  const weekDates = useMemo(() => {
    const current = new Date();
    const start = new Date(current);
    const day = start.getDay();

    start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
    start.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, index) =>
      addDays(start, index),
    );
  }, []);

  const selectedDateObject = new Date(`${selectedDate}T12:00:00`);

  const dayTasks = useMemo(
    () => tasks.filter((task) => task.due === selectedDate),
    [tasks, selectedDate],
  );

  const filteredTasks = useMemo(
    () =>
      dayTasks.filter((task) => {
        if (statusFilter === 'Pending') return !task.done;
        if (statusFilter === 'Completed') return task.done;
        return true;
      }),
    [dayTasks, statusFilter],
  );

  const totalTasks = dayTasks.length;
  const completedTasks = dayTasks.filter((task) => task.done).length;
  const pendingTasks = totalTasks - completedTasks;
  const allPending = tasks.filter((task) => !task.done).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const isToday = selectedDate === dateKey(new Date());

  const formattedSelectedDate = selectedDateObject.toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    },
  );

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        return result.assets[0];
      }
    } catch {
      showPlannerAlert(
        'Unable to select file',
        'Something went wrong while opening your documents.',
        {
          type: 'error',
          confirmText: 'Try again',
          showCancel: false,
          onConfirm: () => {
            void pickDocument();
          },
        },
      );
    }

    return null;
  };

  const chooseSubmissionFile = async () => {
    const file = await pickDocument();
    if (file) setSubmissionDocument(file.name);
  };

  const startSubmission = (task: Task) => {
    if (task.done) return;

    if (task.submissionMethod === 'Physical') {
      showPlannerAlert(
        'Physical submission',
        `Confirm that you have physically submitted "${task.title}".`,
        {
          type: 'warning',
          confirmText: 'Confirm submission',
          onConfirm: () => {
            setTasks((old) =>
              old.map((item) =>
                item.id === task.id
                  ? { ...item, done: true }
                  : item,
              ),
            );

            showPlannerAlert(
              'Marked as completed',
              'Your task has been marked as completed.',
              {
                type: 'success',
                confirmText: 'Done',
                showCancel: false,
              },
            );
          },
        },
      );
      return;
    }

    setSubmittingTask(task);
    setSubmissionDocument('');
    setSubmissionModalVisible(true);
  };

  const confirmOnlineSubmission = () => {
    if (!submittingTask || !submissionDocument) {
      showPlannerAlert(
        'Document required',
        'Please attach your assignment before submitting online.',
        {
          type: 'warning',
          confirmText: 'Choose document',
          onConfirm: () => {
            void chooseSubmissionFile();
          },
        },
      );
      return;
    }

    const taskId = submittingTask.id;
    const fileName = submissionDocument;
    const taskTitle = submittingTask.title;

    showPlannerAlert(
      'Submit assignment?',
      `Submit "${taskTitle}" with "${fileName}"?`,
      {
        type: 'info',
        confirmText: 'Submit now',
        onConfirm: () => {
          setTasks((old) =>
            old.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    done: true,
                    documentName: fileName,
                  }
                : task,
            ),
          );

          setSubmissionModalVisible(false);
          setSubmittingTask(null);
          setSubmissionDocument('');

          showPlannerAlert(
            'Submitted successfully',
            'Your task has been marked as completed.',
            {
              type: 'success',
              confirmText: 'Done',
              showCancel: false,
            },
          );
        },
      },
    );
  };

  const addTask = () => {
    if (!title.trim() || !subject.trim()) {
      showPlannerAlert(
        'Missing details',
        'Enter both a task title and subject.',
        {
          type: 'warning',
          confirmText: 'Got it',
          showCancel: false,
        },
      );
      return;
    }

    const newTask: Task = {
      id: `${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      due: selectedDate,
      priority,
      category,
      done: false,
      submissionMethod,
    };

    setTasks((old) => [newTask, ...old]);
    setAddModalVisible(false);
    setTitle('');
    setSubject('');
    setPriority('Medium');
    setCategory('Assignment');
    setSubmissionMethod('Online');

    showPlannerAlert(
      'Task created',
      'Your new task has been added to your planner.',
      {
        type: 'success',
        confirmText: 'Done',
        showCancel: false,
      },
    );
  };

  const deleteTask = (task: Task) => {
    showPlannerAlert(
      'Delete task?',
      `Are you sure you want to delete "${task.title}"?`,
      {
        type: 'error',
        confirmText: 'Delete',
        onConfirm: () => {
          setTasks((old) => old.filter((item) => item.id !== task.id));

          showPlannerAlert(
            'Task deleted',
            'Your task has been removed from the planner.',
            {
              type: 'success',
              confirmText: 'Done',
              showCancel: false,
            },
          );
        },
      },
    );
  };

  const toggleTask = (task: Task) => {
    if (!task.done) {
      startSubmission(task);
      return;
    }

    showPlannerAlert(
      'Reopen task?',
      `Mark "${task.title}" as pending again?`,
      {
        type: 'warning',
        confirmText: 'Reopen task',
        onConfirm: () => {
          setTasks((old) =>
            old.map((item) =>
              item.id === task.id
                ? { ...item, done: false, documentName: undefined }
                : item,
            ),
          );
        },
      },
    );
  };

  const refreshTasks = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      <StatusBar barStyle="dark-content"  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTasks}
            tintColor={C.blue}
          />
        }
      >
        {/* HEADER */}
        <View className="px-5 pb-2 pt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center">
                <View className="h-2 w-2 rounded-full bg-indigo-500" />
                <Text className="ml-2 text-[11px] font-extrabold tracking-[2.5px] text-indigo-500">
                  CAMPUSOS / STUDENT
                </Text>
              </View>

              <Text className="mt-3 text-[32px] font-extrabold tracking-tight text-[#202B49]">
                My Planner
              </Text>

              <Text className="mt-1 text-sm text-slate-500">
                Plan smarter. Achieve more.
              </Text>
            </View>

            <Pressable
              onPress={() => setAddModalVisible(true)}
              style={{
                borderRadius: 19,
                overflow: 'hidden',
                elevation: 3,
                shadowColor: '#9AA8E8',
                shadowOpacity: 0.2,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <LinearGradient
                colors={['#DCE6FF', '#E8E1FF', '#F3EDFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 55,
                  width: 55,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#E0E5FF',
                }}
              >
                <Ionicons name="add" size={29} color="#596BC5" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* LIGHT HERO CARD */}
        <View
          className="mx-5 mt-6 overflow-hidden rounded-[30px]"
          style={{
            elevation: 4,
            shadowColor: '#A5ADD1',
            shadowOpacity: 0.14,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          <LinearGradient
            colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 21,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#E5E9FA',
            }}
          >
            <GraphicCircle
              size={190}
              top={-100}
              right={-55}
              color="rgba(151,169,239,0.13)"
            />
            <GraphicCircle
              size={125}
              top={-45}
              right={55}
              color="rgba(183,158,238,0.12)"
            />
            <GraphicCircle
              size={100}
              top={145}
              right={-35}
              color="rgba(155,174,241,0.13)"
            />

            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center">
                  <Ionicons
                    name="sparkles-outline"
                    size={15}
                    color="#7587D6"
                  />
                  <Text className="ml-2 text-[10px] font-extrabold tracking-[2px] text-indigo-500">
                    YOUR PRODUCTIVITY
                  </Text>
                </View>

                <Text className="mt-3 text-[25px] font-extrabold text-[#202B49]">
                  {isToday ? "Today's focus" : 'Daily focus'}
                </Text>

                <Text className="mt-1 text-sm font-medium text-slate-500">
                  {formattedSelectedDate}
                </Text>

                <Text className="mt-4 max-w-[210px] text-xs leading-5 text-slate-500">
                  Small progress every day creates extraordinary results.
                </Text>
              </View>

              {/* PROGRESS CIRCLE */}
              <View
                className="h-[94px] w-[94px] items-center justify-center rounded-full"
                style={{
                  borderWidth: 6,
                  borderColor: '#DDE5FF',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  shadowColor: '#8799D9',
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <Text className="text-[25px] font-extrabold text-indigo-600">
                  {progress}%
                </Text>
                <Text className="text-[9px] font-bold tracking-widest text-slate-400">
                  COMPLETE
                </Text>
              </View>
            </View>

            {/* PROGRESS BAR */}
            <View
              className="mt-6 h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: '#DFE5F6' }}
            >
              <LinearGradient
                colors={['#8298ED', '#A18BE7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  borderRadius: 20,
                }}
              />
            </View>

            {/* STATISTICS */}
            <View className="mt-5 flex-row gap-2.5">
              {[
                {
                  label: 'Total',
                  value: totalTasks,
                  icon: 'layers-outline' as const,
                  color: '#6478E8',
                  bg: '#E9EEFF',
                },
                {
                  label: 'Pending',
                  value: pendingTasks,
                  icon: 'time-outline' as const,
                  color: '#D99035',
                  bg: '#FFF3E4',
                },
                {
                  label: 'Completed',
                  value: completedTasks,
                  icon: 'checkmark-circle-outline' as const,
                  color: '#259B78',
                  bg: '#E8F7F0',
                },
              ].map((item) => (
                <View
                  key={item.label}
                  className="flex-1 rounded-2xl border p-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.82)',
                    borderColor: '#E8EAF6',
                  }}
                >
                  <View
                    className="h-8 w-8 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={item.color}
                    />
                  </View>

                  <Text className="mt-2 text-[23px] font-extrabold text-[#202B49]">
                    {item.value}
                  </Text>

                  <Text className="mt-0.5 text-[10px] font-semibold text-slate-500">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* DAILY TIP */}
            <View
              className="mt-4 flex-row items-center rounded-2xl px-3.5 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderWidth: 1,
                borderColor: '#E9EAF7',
              }}
            >
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-amber-50">
                <Ionicons name="bulb-outline" size={18} color="#D99035" />
              </View>

              <Text className="ml-2 flex-1 text-xs leading-5 text-slate-600">
                {pendingTasks === 0
                  ? 'Amazing! You have completed everything for this day.'
                  : `You have ${pendingTasks} task${pendingTasks === 1 ? '' : 's'} remaining. Keep going!`}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* WORKLOAD CARD */}
        <View
          className="mx-5 mt-4 flex-row items-center rounded-[23px] border p-4"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E8EAF5',
            elevation: 2,
            shadowColor: '#A0A9CA',
            shadowOpacity: 0.07,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
          }}
        >
          <LinearGradient
            colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
            style={{
              height: 49,
              width: 49,
              borderRadius: 17,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#E8EAF8',
            }}
          >
            <Ionicons name="analytics-outline" size={25} color={C.blue} />
          </LinearGradient>

          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-[#202B49]">
              Your active workload
            </Text>
            <Text className="mt-1 text-xs text-slate-500">
              Pending tasks across all dates
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-[25px] font-extrabold text-indigo-600">
              {allPending}
            </Text>
            <Text className="text-[9px] font-bold tracking-widest text-slate-400">
              TASKS
            </Text>
          </View>
        </View>

        {/* WEEKLY SCHEDULE */}
        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between px-5">
            <SectionHeading
              title="Your schedule"
              subtitle="Stay ahead of your week"
            />

            <Pressable
              onPress={() => setSelectedDate(dateKey(new Date()))}
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E2E6F8',
                }}
              >
                <Text className="text-xs font-bold text-indigo-600">
                  Today
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 10,
            }}
          >
            {weekDates.map((date) => {
              const key = dateKey(date);
              const isSelected = selectedDate === key;
              const hasTasks = tasks.some((task) => task.due === key);
              const isCurrentDay = key === dateKey(new Date());

              return (
                <Pressable
                  key={key}
                  onPress={() => setSelectedDate(key)}
                  style={{
                    borderRadius: 21,
                    overflow: 'hidden',
                    elevation: isSelected ? 3 : 0,
                    shadowColor: '#8999D9',
                    shadowOpacity: isSelected ? 0.15 : 0,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                  }}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#DDE6FF', '#E9E2FF', '#F4F0FF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 67,
                        alignItems: 'center',
                        paddingVertical: 14,
                        borderRadius: 21,
                        borderWidth: 1,
                        borderColor: '#DCE2FA',
                      }}
                    >
                      <Text className="text-[11px] font-bold text-indigo-600">
                        {isCurrentDay
                          ? 'Today'
                          : date.toLocaleDateString('en-IN', {
                              weekday: 'short',
                            })}
                      </Text>

                      <Text className="mt-2 text-[23px] font-extrabold text-[#34436E]">
                        {date.getDate()}
                      </Text>

                      <View
                        className="mt-2 h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: hasTasks ? '#6478E8' : 'transparent',
                        }}
                      />
                    </LinearGradient>
                  ) : (
                    <View
                      className="w-[67px] items-center rounded-[21px] border bg-white py-3.5"
                      style={{ borderColor: '#E8EAF3' }}
                    >
                      <Text className="text-[11px] font-bold text-slate-500">
                        {isCurrentDay
                          ? 'Today'
                          : date.toLocaleDateString('en-IN', {
                              weekday: 'short',
                            })}
                      </Text>

                      <Text className="mt-2 text-[23px] font-extrabold text-[#202B49]">
                        {date.getDate()}
                      </Text>

                      <View
                        className="mt-2 h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: hasTasks ? C.blue : 'transparent',
                        }}
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* TASK SECTION */}
        <View className="mt-8 px-5">
          <View className="mb-5 flex-row items-center justify-between">
            <SectionHeading
              title="Your tasks"
              subtitle={isToday ? "Today's priorities" : formattedSelectedDate}
            />

            <View className="rounded-xl bg-indigo-50 px-3 py-2">
              <Text className="text-xs font-bold text-indigo-600">
                {filteredTasks.length} shown
              </Text>
            </View>
          </View>

          {/* FILTERS */}
          <View className="flex-row gap-2">
            {(['All', 'Pending', 'Completed'] as const).map((item) => {
              const selected = statusFilter === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setStatusFilter(item)}
                  style={{ flex: 1, borderRadius: 30, overflow: 'hidden' }}
                >
                  {selected ? (
                    <LinearGradient
                      colors={['#DDE6FF', '#E9E2FF', '#F4F0FF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        paddingVertical: 12,
                        alignItems: 'center',
                        borderRadius: 30,
                        borderWidth: 1,
                        borderColor: '#DFE4FA',
                      }}
                    >
                      <Text className="text-xs font-bold text-indigo-700">
                        {item}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      className="items-center rounded-full border bg-white py-3"
                      style={{ borderColor: '#E8EAF3' }}
                    >
                      <Text className="text-xs font-bold text-slate-500">
                        {item}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* TASK CARDS */}
        <View className="mt-5 gap-3.5 px-5">
          {filteredTasks.length === 0 ? (
            <View
              className="items-center rounded-[27px] border bg-white px-6 py-10"
              style={{ borderColor: '#E8EAF3' }}
            >
              <LinearGradient
                colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                style={{
                  height: 76,
                  width: 76,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: '#E8EAF8',
                }}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={34}
                  color={C.blue}
                />
              </LinearGradient>

              <Text className="mt-5 text-lg font-extrabold text-[#202B49]">
                Nothing on your list
              </Text>

              <Text className="mt-2 text-center text-sm leading-6 text-slate-500">
                No tasks match your selected filters. Add something to organise your day.
              </Text>

              <View className="mt-5 w-full">
                <GradientButton
                  title="Create a task"
                  icon="add"
                  onPress={() => setAddModalVisible(true)}
                />
              </View>
            </View>
          ) : (
            filteredTasks.map((task) => {
              const priorityStyle = priorityConfig[task.priority];
              const categoryStyle = categoryConfig[task.category];

              return (
                <View
                  key={task.id}
                  className="rounded-[25px] border bg-white p-4"
                  style={{
                    borderColor: task.done ? '#D9F0E5' : '#E8EAF3',
                    shadowColor: '#263653',
                    shadowOpacity: 0.045,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-start">
                    <Pressable
                      onPress={() => toggleTask(task)}
                      className={`mr-3 mt-1 h-6 w-6 items-center justify-center rounded-full border-2 ${
                        task.done
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-300 bg-white'
                      }`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: task.done }}
                    >
                      {task.done && (
                        <Ionicons
                          name="checkmark"
                          size={15}
                          color="white"
                        />
                      )}
                    </Pressable>

                    <View className="flex-1">
                      <View className="flex-row items-start">
                        <View className="flex-1 pr-2">
                          <Text
                            className={`text-[15px] font-extrabold leading-6 ${
                              task.done
                                ? 'text-slate-400 line-through'
                                : 'text-[#202B49]'
                            }`}
                          >
                            {task.title}
                          </Text>

                          <Text className="mt-1.5 text-xs font-medium text-slate-500">
                            {task.subject}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => deleteTask(task)}
                          className="h-9 w-9 items-center justify-center rounded-xl bg-rose-50"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={17}
                            color="#DC626B"
                          />
                        </Pressable>
                      </View>

                      {/* CATEGORY AND PRIORITY */}
                      <View className="mt-4 flex-row flex-wrap gap-2">
                        <View
                          className="flex-row items-center rounded-full px-3 py-1.5"
                          style={{ backgroundColor: priorityStyle.bg }}
                        >
                          <View
                            className="mr-1.5 h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: priorityStyle.color }}
                          />
                          <Text
                            className="text-[10px] font-bold"
                            style={{ color: priorityStyle.color }}
                          >
                            {task.priority} priority
                          </Text>
                        </View>

                        <View
                          className="flex-row items-center rounded-full px-3 py-1.5"
                          style={{ backgroundColor: categoryStyle.bg }}
                        >
                          <Ionicons
                            name={categoryStyle.icon}
                            size={12}
                            color={categoryStyle.color}
                          />
                          <Text
                            className="ml-1.5 text-[10px] font-bold"
                            style={{ color: categoryStyle.color }}
                          >
                            {task.category}
                          </Text>
                        </View>

                        <View className="rounded-full bg-indigo-50 px-3 py-1.5">
                          <Text className="text-[10px] font-bold text-indigo-600">
                            Personal task
                          </Text>
                        </View>
                      </View>

                      {/* ATTACHED DOCUMENT */}
                      {task.documentName ? (
                        <View className="mt-3 flex-row items-center rounded-xl bg-emerald-50 p-3">
                          <Ionicons
                            name="document-text-outline"
                            size={18}
                            color="#059669"
                          />
                          <Text
                            numberOfLines={1}
                            className="ml-2 flex-1 text-xs font-semibold text-emerald-700"
                          >
                            {task.documentName}
                          </Text>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#059669"
                          />
                        </View>
                      ) : null}

                      {/* FOOTER */}
                      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3.5">
                        <View className="flex-1 flex-row items-center">
                          <View className="h-9 w-9 items-center justify-center rounded-xl bg-slate-50">
                            <Ionicons
                              name={
                                task.submissionMethod === 'Online'
                                  ? 'cloud-upload-outline'
                                  : 'hand-left-outline'
                              }
                              size={17}
                              color="#64748B"
                            />
                          </View>

                          <View className="ml-2">
                            <Text className="text-xs font-bold text-slate-700">
                              {task.submissionMethod}
                            </Text>
                            <Text className="mt-0.5 text-[10px] text-slate-400">
                              Created by you
                            </Text>
                          </View>
                        </View>

                        {task.done ? (
                          <View className="flex-row items-center rounded-full bg-emerald-50 px-3 py-2">
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color="#059669"
                            />
                            <Text className="ml-1.5 text-[10px] font-bold text-emerald-700">
                              Completed
                            </Text>
                          </View>
                        ) : (
                          <Pressable
                            onPress={() => startSubmission(task)}
                            style={{ borderRadius: 12, overflow: 'hidden' }}
                          >
                            <LinearGradient
                              colors={['#E3EAFF', '#ECE6FF', '#F5F0FF']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={{
                                paddingHorizontal: 13,
                                paddingVertical: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: '#E2E6FA',
                              }}
                            >
                              <Text className="text-[11px] font-bold text-indigo-700">
                                {task.submissionMethod === 'Online'
                                  ? 'Submit'
                                  : 'Mark submitted'}
                              </Text>
                              <Ionicons
                                name="arrow-forward"
                                size={13}
                                color="#6478E8"
                                style={{ marginLeft: 5 }}
                              />
                            </LinearGradient>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* CREATE TASK MODAL */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-slate-950/50">
          <Pressable
            className="flex-1"
            onPress={() => setAddModalVisible(false)}
          />

          <View
            className="max-h-[90%] rounded-t-[32px] bg-white px-5 pb-8 pt-5"
          >
            <View className="mb-5 h-1.5 w-11 self-center rounded-full bg-slate-200" />

            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-[23px] font-extrabold text-[#202B49]">
                  Create a task
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Organise your next achievement.
                </Text>
              </View>

              <Pressable
                onPress={() => setAddModalVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={21} color="#334155" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text className="mb-2 text-sm font-bold text-slate-700">
                Task title
              </Text>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Finish assignment"
                placeholderTextColor="#94A3B8"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900"
                returnKeyType="next"
              />

              <Text className="mb-2 mt-4 text-sm font-bold text-slate-700">
                Subject
              </Text>

              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Mathematics"
                placeholderTextColor="#94A3B8"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900"
              />

              <Text className="mb-3 mt-5 text-sm font-bold text-slate-700">
                Category
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {categories.map((item) => {
                  const selected = category === item;
                  const config = categoryConfig[item];

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setCategory(item)}
                      style={{ borderRadius: 20, overflow: 'hidden' }}
                    >
                      {selected ? (
                        <LinearGradient
                          colors={['#DDE6FF', '#E9E2FF', '#F4F0FF']}
                          style={{
                            paddingHorizontal: 15,
                            paddingVertical: 11,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            borderWidth: 1,
                            borderColor: '#E0E5FA',
                            borderRadius: 20,
                          }}
                        >
                          <Ionicons
                            name={config.icon}
                            size={14}
                            color="#596BC5"
                          />
                          <Text className="text-xs font-bold text-indigo-700">
                            {item}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View
                          className="flex-row items-center rounded-full border px-4 py-2.5"
                          style={{
                            borderColor: C.border,
                            backgroundColor: config.bg,
                          }}
                        >
                          <Ionicons
                            name={config.icon}
                            size={14}
                            color={config.color}
                          />
                          <Text
                            className="ml-1.5 text-xs font-bold"
                            style={{ color: config.color }}
                          >
                            {item}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <Text className="mb-3 mt-5 text-sm font-bold text-slate-700">
                Priority level
              </Text>

              <View className="flex-row gap-2">
                {(['High', 'Medium', 'Low'] as const).map((item) => {
                  const selected = priority === item;
                  const config = priorityConfig[item];

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setPriority(item)}
                      className="flex-1 items-center rounded-2xl border py-3.5"
                      style={{
                        backgroundColor: selected ? config.bg : 'white',
                        borderColor: selected ? config.color : C.border,
                      }}
                    >
                      <View
                        className="mb-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <Text
                        className="text-xs font-bold"
                        style={{
                          color: selected ? config.color : '#64748B',
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text className="mb-3 mt-5 text-sm font-bold text-slate-700">
                Submission method
              </Text>

              <View className="flex-row gap-3">
                {(['Online', 'Physical'] as const).map((item) => {
                  const selected = submissionMethod === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setSubmissionMethod(item)}
                      className="flex-1 flex-row items-center justify-center rounded-2xl border py-4"
                      style={{
                        borderColor: selected ? '#C7D0FF' : C.border,
                        backgroundColor: selected ? '#EEF0FF' : 'white',
                      }}
                    >
                      <Ionicons
                        name={
                          item === 'Online'
                            ? 'cloud-upload-outline'
                            : 'hand-left-outline'
                        }
                        size={18}
                        color={selected ? C.blue : '#64748B'}
                      />
                      <Text
                        className="ml-2 text-xs font-bold"
                        style={{
                          color: selected ? C.blue : '#64748B',
                        }}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="mt-7">
                <GradientButton
                  title="Create task"
                  icon="add-circle-outline"
                  onPress={addTask}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ONLINE SUBMISSION MODAL */}
      <Modal
        visible={submissionModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setSubmissionModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-slate-950/50">
          <Pressable
            className="flex-1"
            onPress={() => setSubmissionModalVisible(false)}
          />

          <View className="rounded-t-[32px] bg-white px-5 pb-8 pt-5">
            <View className="mb-5 h-1.5 w-11 self-center rounded-full bg-slate-200" />

            <View className="mb-5 flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-[23px] font-extrabold text-[#202B49]">
                  Submit assignment
                </Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Upload your completed academic work.
                </Text>
              </View>

              <Pressable
                onPress={() => setSubmissionModalVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={21} color="#334155" />
              </Pressable>
            </View>

            {submittingTask && (
              <View
                className="overflow-hidden rounded-2xl"
                style={{ borderWidth: 1, borderColor: '#E8EAF8' }}
              >
                <LinearGradient
                  colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                  style={{ padding: 16 }}
                >
                  <View className="flex-row items-center">
                    <View className="h-11 w-11 items-center justify-center rounded-xl bg-white">
                      <Ionicons
                        name="document-text-outline"
                        size={22}
                        color={C.blue}
                      />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text className="text-[10px] font-extrabold tracking-widest text-indigo-500">
                        ASSIGNMENT
                      </Text>
                      <Text className="mt-1 text-sm font-extrabold text-[#202B49]">
                        {submittingTask.title}
                      </Text>
                      <Text className="mt-1 text-xs text-slate-500">
                        {submittingTask.subject}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            <Pressable
              onPress={() => void chooseSubmissionFile()}
              className="mt-4 items-center rounded-[24px] border border-dashed border-indigo-300 px-5 py-7"
              style={{ backgroundColor: '#F8F8FF' }}
            >
              <LinearGradient
                colors={['#EEF3FF', '#F4F0FF', '#FFFFFF']}
                style={{
                  height: 65,
                  width: 65,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: '#E7E9FA',
                }}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color={C.blue}
                />
              </LinearGradient>

              <Text className="mt-4 text-base font-extrabold text-[#202B49]">
                {submissionDocument
                  ? 'Document selected'
                  : 'Upload your document'}
              </Text>

              <Text className="mt-1 text-xs text-slate-500">
                PDF, DOC or DOCX
              </Text>

              {submissionDocument ? (
                <View className="mt-4 w-full flex-row items-center rounded-2xl border border-emerald-100 bg-white p-3">
                  <Ionicons
                    name="document-text-outline"
                    size={21}
                    color="#059669"
                  />
                  <Text
                    numberOfLines={1}
                    className="ml-2 flex-1 text-xs font-bold text-slate-700"
                  >
                    {submissionDocument}
                  </Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#059669"
                  />
                </View>
              ) : null}

              <Text className="mt-4 text-xs font-extrabold text-indigo-600">
                {submissionDocument ? 'Tap to change file' : 'Browse files'}
              </Text>
            </Pressable>

            <View className="mt-5">
              <GradientButton
                title="Submit assignment"
                icon="cloud-upload-outline"
                onPress={confirmOnlineSubmission}
              />
            </View>

            <Pressable
              onPress={() => setSubmissionModalVisible(false)}
              className="mt-3 items-center py-3"
            >
              <Text className="text-sm font-bold text-slate-500">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* CUSTOM ALERT */}
      <PlannerAlert
        visible={plannerAlert.visible}
        title={plannerAlert.title}
        message={plannerAlert.message}
        type={plannerAlert.type}
        confirmText={plannerAlert.confirmText}
        cancelText={plannerAlert.cancelText}
        showCancel={plannerAlert.showCancel}
        onCancel={closePlannerAlert}
        onConfirm={confirmPlannerAlert}
      />
    </SafeAreaView>
  );
}
