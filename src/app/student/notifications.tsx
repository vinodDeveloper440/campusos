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
import { router, type Href } from 'expo-router';

type Category = 'Academic' | 'Fees' | 'Events' | 'General';
type Filter = 'All' | Category;
type IconName = React.ComponentProps<typeof Ionicons>['name'];

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  category: Category;
  time: string;
  icon: IconName;
  color: string;
  unread: boolean;
  route: Href;
  actionLabel: string;
};

const C = {
  navy: '#172554',
  background: '#F6F7FB',
  white: '#FFFFFF',
  muted: '#8992A8',
  border: '#E9ECF3',
  blue: '#5369DB',
  green: '#16845B',
  red: '#D94C57',
  text: '#34415C',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Assignment deadline',
    message:
      'Your Data Structures assignment is due tomorrow. Review the instructions, complete your work, and submit it before the deadline.',
    category: 'Academic',
    time: '10 min ago',
    icon: 'document-text-outline',
    color: '#6554C0',
    unread: true,
    route: '/student/assignments' as Href,
    actionLabel: 'View assignments',
  },
  {
    id: '2',
    title: 'Attendance updated',
    message:
      'Your attendance records are ready to review. Check your subject-wise attendance and monitor your attendance percentage.',
    category: 'Academic',
    time: '1 hour ago',
    icon: 'checkmark-circle-outline',
    color: '#21845B',
    unread: true,
    route: '/student/attendance' as Href,
    actionLabel: 'View attendance',
  },
  {
    id: '3',
    title: 'Fee payment reminder',
    message:
      'Review your current fee status and payment due dates. Please check the fee section for the latest available details.',
    category: 'Fees',
    time: '3 hours ago',
    icon: 'card-outline',
    color: '#C76A2A',
    unread: true,
    route: '/student/fees' as Href,
    actionLabel: 'View fee details',
  },
  {
    id: '4',
    title: 'Campus event announced',
    message:
      'A new campus event has been announced. Explore the event details, schedule, and registration information.',
    category: 'Events',
    time: 'Yesterday',
    icon: 'calendar-outline',
    color: '#2877C7',
    unread: false,
    route: '/student/events' as Href,
    actionLabel: 'Explore events',
  },
  {
    id: '5',
    title: 'Welcome to CampusOS',
    message:
      'Your student portal brings together academic updates, attendance, your planner, and campus services.',
    category: 'General',
    time: '2 days ago',
    icon: 'school-outline',
    color: '#D14F77',
    unread: false,
    route: '/student' as Href,
    actionLabel: 'Open dashboard',
  },
];

const FILTERS: Filter[] = [
  'All',
  'Academic',
  'Fees',
  'Events',
  'General',
];

export default function StudentNotifications() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] =
    useState<NotificationItem | null>(null);

  const unreadCount = notifications.filter(
    (item) => item.unread,
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesCategory =
        activeFilter === 'All' || item.category === activeFilter;

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [notifications, activeFilter, search]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    );

    setSelected((current) =>
      current?.id === id ? { ...current, unread: false } : current,
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: true } : item,
      ),
    );

    setSelected(null);
  };

  const openNotification = (item: NotificationItem) => {
    markAsRead(item.id);
    setSelected({ ...item, unread: false });
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) return;

    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false })),
    );

    setSelected((current) =>
      current ? { ...current, unread: false } : null,
    );
  };

  const openRelatedPage = () => {
    if (!selected) return;

    const destination = selected.route;
    setSelected(null);
    router.push(destination);
  };

  const clearSearch = () => setSearch('');

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'Academic':
        return '#6554C0';
      case 'Fees':
        return '#C76A2A';
      case 'Events':
        return '#2877C7';
      case 'General':
        return '#D14F77';
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: C.background }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle="dark-content"
      />

      {/* Header */}
      <View className="px-5 pt-3">
        <View className="mb-7 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center rounded-2xl border bg-white"
            style={{ borderColor: C.border }}
          >
            <Ionicons name="arrow-back" size={21} color={C.navy} />
          </Pressable>

          <View className="items-center">
            <Text
              className="text-xs font-extrabold tracking-[2.5px]"
              style={{ color: C.navy }}
            >
              CAMPUSOS
            </Text>
            <Text className="mt-1 text-[10px] font-semibold tracking-widest text-slate-400">
              STUDENT PORTAL
            </Text>
          </View>

          <View
            className="h-11 w-11 items-center justify-center rounded-2xl border bg-white"
            style={{ borderColor: C.border }}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={C.navy}
            />
            {unreadCount > 0 && (
              <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
            )}
          </View>
        </View>

        <Text className="mb-2 text-xs font-bold tracking-[2px] text-slate-400">
          STAY UPDATED
        </Text>

        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: C.navy }}
            >
              Notifications
            </Text>
            <Text className="mt-2 text-sm text-slate-500">
              Your academic and campus updates.
            </Text>
          </View>

          <View className="ml-3 rounded-2xl bg-indigo-50 px-3 py-2.5">
            <Text className="text-lg font-extrabold text-indigo-700">
              {unreadCount}
            </Text>
            <Text className="text-[10px] font-bold text-indigo-600">
              UNREAD
            </Text>
          </View>
        </View>

        {/* Search */}
        <View
          className="mb-5 h-12 flex-row items-center rounded-2xl border bg-white px-3"
          style={{ borderColor: C.border }}
        >
          <Ionicons name="search-outline" size={20} color={C.muted} />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search notifications..."
            placeholderTextColor="#A0A8B8"
            returnKeyType="search"
            className="ml-2 flex-1 text-sm"
            style={{ color: C.navy, paddingVertical: 0 }}
            accessibilityLabel="Search notifications"
          />

          {search.length > 0 && (
            <Pressable
              onPress={clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              className="h-8 w-8 items-center justify-center"
            >
              <Ionicons name="close-circle" size={19} color={C.muted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 36,
        }}
      >
        {/* Inbox status */}
        <View
          className="mb-6 rounded-[25px] p-5"
          style={{ backgroundColor: C.navy }}
        >
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Ionicons
                name="mail-unread-outline"
                size={25}
                color="white"
              />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium text-indigo-100">
                Your inbox
              </Text>
              <Text className="mt-1 text-xs text-indigo-200">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread updates`
                  : 'You are all caught up'}
              </Text>
            </View>

            <Pressable
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              className="rounded-xl bg-white px-3 py-3"
              style={{
                opacity: unreadCount === 0 ? 0.55 : 1,
              }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: C.navy }}
              >
                Mark all read
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Filter buttons */}
        <View className="mb-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Text
              className="text-base font-extrabold"
              style={{ color: C.navy }}
            >
              Filter by category
            </Text>

            {activeFilter !== 'All' && (
              <Pressable
                onPress={() => setActiveFilter('All')}
                accessibilityRole="button"
                accessibilityLabel="Reset category filter"
              >
                <Text className="text-xs font-bold text-indigo-600">
                  Reset
                </Text>
              </Pressable>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {FILTERS.map((filter) => {
              const active = activeFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  className="mr-2 rounded-full border px-4 py-2.5"
                  style={{
                    backgroundColor: active ? C.navy : C.white,
                    borderColor: active ? C.navy : C.border,
                  }}
                >
                  <Text
                    className="text-xs font-bold"
                    style={{
                      color: active ? C.white : '#64748B',
                    }}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* List header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text
            className="text-base font-extrabold"
            style={{ color: C.navy }}
          >
            Recent updates
          </Text>

          <Text className="text-xs font-medium text-slate-400">
            {filteredNotifications.length}{' '}
            {filteredNotifications.length === 1
              ? 'notification'
              : 'notifications'}
          </Text>
        </View>

        {/* Notifications */}
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const categoryColor = getCategoryColor(item.category);

            return (
              <Pressable
                key={item.id}
                onPress={() => openNotification(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${item.unread ? 'Unread.' : 'Read.'} Open details.`}
                className="mb-3 rounded-[23px] border bg-white p-4"
                style={{
                  borderColor: item.unread ? '#D6DDFC' : C.border,
                }}
              >
                <View className="flex-row items-start">
                  <View
                    className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: item.color + '18',
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={23}
                      color={item.color}
                    />
                  </View>

                  <View className="flex-1">
                    <View className="mb-1 flex-row items-start">
                      <Text
                        className="flex-1 pr-2 text-sm font-extrabold leading-5"
                        style={{ color: C.navy }}
                      >
                        {item.title}
                      </Text>

                      {item.unread && (
                        <View className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </View>

                    <Text
                      numberOfLines={2}
                      className="text-xs leading-5 text-slate-500"
                    >
                      {item.message}
                    </Text>

                    <View className="mt-3 flex-row items-center justify-between">
                      <View
                        className="rounded-lg px-2 py-1"
                        style={{
                          backgroundColor: categoryColor + '16',
                        }}
                      >
                        <Text
                          className="text-[10px] font-bold"
                          style={{ color: categoryColor }}
                        >
                          {item.category}
                        </Text>
                      </View>

                      <Text className="text-[10px] text-slate-400">
                        {item.time}
                      </Text>
                    </View>

                    <View className="mt-3 flex-row items-center">
                      <Text className="mr-1 text-xs font-bold text-indigo-600">
                        View details
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={13}
                        color={C.blue}
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View className="items-center rounded-[26px] border border-dashed bg-white px-6 py-12"
            style={{ borderColor: C.border }}
          >
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-slate-50">
              <Ionicons
                name={search ? 'search-outline' : 'notifications-off-outline'}
                size={30}
                color="#94A3B8"
              />
            </View>

            <Text
              className="text-base font-extrabold"
              style={{ color: C.navy }}
            >
              {search ? 'No matching notifications' : 'Nothing here yet'}
            </Text>

            <Text className="mt-2 text-center text-sm leading-5 text-slate-400">
              {search
                ? 'Try another keyword or clear your search.'
                : 'There are no notifications in this category.'}
            </Text>

            <Pressable
              onPress={() => {
                setActiveFilter('All');
                clearSearch();
              }}
              accessibilityRole="button"
              className="mt-5 rounded-xl bg-indigo-50 px-5 py-3"
            >
              <Text className="text-xs font-bold text-indigo-700">
                Show all notifications
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Notification details */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelected(null)}
      >
        <View className="flex-1 justify-center px-5">
          <Pressable
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(10,18,40,0.68)' }}
            onPress={() => setSelected(null)}
            accessibilityRole="button"
            accessibilityLabel="Close notification details"
          />

          {selected && (
            <View
              className="rounded-[28px] border bg-white p-6"
              style={{
                borderColor: C.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.18,
                shadowRadius: 24,
                elevation: 15,
              }}
            >
              <View className="mb-5 flex-row items-start justify-between">
                <View
                  className="h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: selected.color + '18',
                  }}
                >
                  <Ionicons
                    name={selected.icon}
                    size={28}
                    color={selected.color}
                  />
                </View>

                <Pressable
                  onPress={() => setSelected(null)}
                  accessibilityRole="button"
                  accessibilityLabel="Close details"
                  className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                >
                  <Ionicons name="close" size={22} color="#475569" />
                </Pressable>
              </View>

              <View
                className="mb-3 self-start rounded-lg px-3 py-1.5"
                style={{
                  backgroundColor: selected.color + '18',
                }}
              >
                <Text
                  className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: selected.color }}
                >
                  {selected.category}
                </Text>
              </View>

              <Text
                className="mb-3 text-2xl font-extrabold leading-8"
                style={{ color: C.navy }}
              >
                {selected.title}
              </Text>

              <Text className="text-sm leading-6 text-slate-500">
                {selected.message}
              </Text>

              <View className="my-5 h-px bg-slate-100" />

              <View className="mb-5 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={C.muted}
                  />
                  <Text className="ml-2 text-xs text-slate-500">
                    {selected.time}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <View
                    className="mr-1.5 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: selected.unread
                        ? C.blue
                        : C.green,
                    }}
                  />
                  <Text className="text-xs font-semibold text-slate-500">
                    {selected.unread ? 'Unread' : 'Read'}
                  </Text>
                </View>
              </View>

              {/* Main action */}
              <Pressable
                onPress={openRelatedPage}
                accessibilityRole="button"
                accessibilityLabel={selected.actionLabel}
                className="h-14 flex-row items-center justify-center rounded-2xl"
                style={{ backgroundColor: C.navy }}
              >
                <Text className="mr-2 text-sm font-bold text-white">
                  {selected.actionLabel}
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="white"
                />
              </Pressable>

              {/* Secondary action */}
              <Pressable
                onPress={() => {
                  if (selected.unread) {
                    markAsRead(selected.id);
                  } else {
                    markAsUnread(selected.id);
                  }
                }}
                accessibilityRole="button"
                className="mt-3 h-12 flex-row items-center justify-center rounded-2xl border"
                style={{ borderColor: C.border }}
              >
                <Ionicons
                  name={
                    selected.unread
                      ? 'mail-open-outline'
                      : 'mail-unread-outline'
                  }
                  size={17}
                  color={C.navy}
                />
                <Text
                  className="ml-2 text-sm font-bold"
                  style={{ color: C.navy }}
                >
                  {selected.unread
                    ? 'Mark as read'
                    : 'Mark as unread'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelected(null)}
                accessibilityRole="button"
                className="mt-3 items-center py-2"
              >
                <Text className="text-sm font-semibold text-slate-400">
                  Close
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
