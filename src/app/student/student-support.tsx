
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
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';

const C = {
  navy: '#202B49',
  blue: '#6478E8',
  blueDark: '#5268D6',
  muted: '#8992A6',
  border: '#E8ECF5',
  bg: '#F6F8FD',
  white: '#FFFFFF',
  green: '#249B79',
  orange: '#D99138',
  red: '#DD626B',
  purple: '#9277D6',

  paleBlue: '#EEF1FF',
  paleGreen: '#EAF8F1',
  paleOrange: '#FFF5E8',
  paleRed: '#FFF0F1',
  palePurple: '#F4EFFF',
};

type TicketStatus = 'Open' | 'In Progress' | 'Resolved';
type Priority = 'Low' | 'Normal' | 'High';

type Ticket = {
  id: string;
  subject: string;
  category: string;
  department: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  date: string;
  response: string;
  attachment?: string;
};

const categories = [
  {
    name: 'Academic',
    fullName: 'Academic Issues',
    icon: 'school-outline',
    color: C.blue,
    bg: C.paleBlue,
    department: 'Academic Office',
  },
  {
    name: 'Fees',
    fullName: 'Fee & Payments',
    icon: 'wallet-outline',
    color: C.orange,
    bg: C.paleOrange,
    department: 'Accounts Office',
  },
  {
    name: 'Library',
    fullName: 'Library Issues',
    icon: 'library-outline',
    color: C.purple,
    bg: C.palePurple,
    department: 'Library Department',
  },
  {
    name: 'Attendance',
    fullName: 'Attendance Issues',
    icon: 'calendar-outline',
    color: C.green,
    bg: C.paleGreen,
    department: 'Academic Office',
  },
  {
    name: 'Technical',
    fullName: 'Technical Issues',
    icon: 'laptop-outline',
    color: C.blue,
    bg: C.paleBlue,
    department: 'IT Support',
  },
  {
    name: 'Exams',
    fullName: 'Examination Issues',
    icon: 'document-text-outline',
    color: C.red,
    bg: C.paleRed,
    department: 'Examination Cell',
  },
  {
    name: 'Hostel',
    fullName: 'Hostel & Transport',
    icon: 'bus-outline',
    color: C.orange,
    bg: C.paleOrange,
    department: 'Student Affairs',
  },
  {
    name: 'Other',
    fullName: 'Other Complaints',
    icon: 'chatbubble-ellipses-outline',
    color: C.muted,
    bg: '#F0F2F7',
    department: 'Student Affairs',
  },
] as const;

const contacts = [
  {
    name: 'Academic Office',
    detail: 'Academic queries and faculty assistance',
    phone: '+91 98765 43210',
    email: 'academic@campus.edu',
    icon: 'school-outline',
    color: C.blue,
    bg: C.paleBlue,
  },
  {
    name: 'Accounts Office',
    detail: 'Fees, receipts and payment queries',
    phone: '+91 98765 43212',
    email: 'accounts@campus.edu',
    icon: 'wallet-outline',
    color: C.orange,
    bg: C.paleOrange,
  },
  {
    name: 'Library Department',
    detail: 'Books, returns and library services',
    phone: '+91 98765 43213',
    email: 'library@campus.edu',
    icon: 'library-outline',
    color: C.purple,
    bg: C.palePurple,
  },
  {
    name: 'Technical Support',
    detail: 'Portal login and technical problems',
    phone: '+91 98765 43214',
    email: 'support@campus.edu',
    icon: 'laptop-outline',
    color: C.green,
    bg: C.paleGreen,
  },
  {
    name: 'Examination Cell',
    detail: 'Exam schedules and results',
    phone: '+91 98765 43211',
    email: 'exams@campus.edu',
    icon: 'document-text-outline',
    color: C.red,
    bg: C.paleRed,
  },
];

const initialTickets: Ticket[] = [
  {
    id: 'CS-2026-1042',
    subject: 'Attendance percentage mismatch',
    category: 'Attendance',
    department: 'Academic Office',
    description:
      'My attendance percentage is showing incorrectly for Data Structures. Kindly verify my attendance records.',
    priority: 'High',
    status: 'In Progress',
    date: '04 Nov 2026',
    response:
      'Your request has been forwarded to the respective faculty member for verification.',
  },
  {
    id: 'CS-2026-1038',
    subject: 'Library book return status',
    category: 'Library',
    department: 'Library Department',
    description:
      'I have returned my book, but the portal still shows it as issued.',
    priority: 'Normal',
    status: 'Resolved',
    date: '02 Nov 2026',
    response:
      'The library team has verified your return. Your book return status has been updated.',
  },
  {
    id: 'CS-2026-1031',
    subject: 'Unable to access study materials',
    category: 'Technical',
    department: 'IT Support',
    description:
      'The study materials section is not loading on my student dashboard.',
    priority: 'High',
    status: 'Open',
    date: '01 Nov 2026',
    response:
      'Your complaint has been registered and is awaiting review by the technical team.',
  },
];

const faqs = [
  {
    q: 'How do I submit a support request?',
    a: 'Select Raise a Request, choose your issue category, enter the details and submit. A unique ticket ID will be generated.',
  },
  {
    q: 'How can I check my complaint status?',
    a: 'Go to My Requests and select your ticket to see its current status and the latest department response.',
  },
  {
    q: 'How long will it take to resolve my issue?',
    a: 'The resolution time depends on the department and type of issue. You can track updates directly from your support page.',
  },
  {
    q: 'Can I attach documents?',
    a: 'Yes. You can attach supporting documents, screenshots or other files when creating a support request.',
  },
  {
    q: 'What should I do if my issue is not resolved?',
    a: 'You can reopen a resolved request if the problem continues, or contact the relevant department directly.',
  },
];

const statusInfo = (status: TicketStatus) => {
  if (status === 'Resolved') {
    return { color: C.green, bg: C.paleGreen, icon: 'checkmark-circle-outline' };
  }
  if (status === 'In Progress') {
    return { color: C.orange, bg: C.paleOrange, icon: 'time-outline' };
  }
  return { color: C.red, bg: C.paleRed, icon: 'alert-circle-outline' };
};

function SectionTitle({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-1">
        <Text className="text-[17px] font-bold" style={{ color: C.navy }}>
          {title}
        </Text>
        {!!subtitle && (
          <Text className="text-[11px] mt-1" style={{ color: C.muted }}>
            {subtitle}
          </Text>
        )}
      </View>
      {!!action && (
        <Pressable onPress={onAction}>
          <Text className="text-xs font-bold" style={{ color: C.blue }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-xs font-bold mb-2" style={{ color: C.navy }}>
      {children}
    </Text>
  );
}

export default function StudentSupportScreen() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const [activeTab, setActiveTab] = useState('Overview');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [attachment, setAttachment] = useState('');

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const [popup, setPopup] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
  });

  const counts = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    progress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  }), [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesFilter = filter === 'All' || ticket.status === filter;
      const query = search.toLowerCase();

      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

  const notify = (
    title: string,
    message: string,
    type = 'success'
  ) => {
    setPopup({ visible: true, title, message, type });
  };

  const resetForm = () => {
    setCategory('');
    setDepartment('');
    setSubject('');
    setDescription('');
    setPriority('Normal');
    setAttachment('');
  };

  const selectCategory = (name: string) => {
    const selected = categories.find(item => item.fullName === name);

    setCategory(name);
    setDepartment(selected?.department || '');
  };

  const chooseDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.length) {
        setAttachment(result.assets[0].name);
      }
    } catch {
      notify('Attachment error', 'Unable to select your document.', 'error');
    }
  };

  const submitTicket = () => {
    if (!category || !subject.trim() || !description.trim()) {
      notify(
        'Missing information',
        'Please select a category and complete the subject and description.',
        'error'
      );
      return;
    }

    const ticketId = `CS-2026-${Date.now().toString().slice(-6)}`;

    const newTicket: Ticket = {
      id: ticketId,
      subject: subject.trim(),
      category,
      department,
      description: description.trim(),
      priority,
      status: 'Open',
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      response: 'Your support request has been submitted successfully. The department will review your issue.',
      attachment: attachment || undefined,
    };

    setTickets(prev => [newTicket, ...prev]);
    resetForm();
    setShowForm(false);
    setActiveTab('My Requests');
    setFilter('All');

    notify(
      'Request submitted!',
      `Your ticket ID is ${ticketId}. Keep this ID for future reference.`
    );
  };

  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const reopenTicket = () => {
    if (!selectedTicket) return;

    const updated: Ticket = {
      ...selectedTicket,
      status: 'Open',
      response: 'Your request has been reopened. The department will review your issue again.',
    };

    setTickets(prev =>
      prev.map(t => t.id === updated.id ? updated : t)
    );

    setSelectedTicket(updated);

    notify(
      'Request reopened',
      'Your support request has been submitted for another review.'
    );
  };

  const renderTicket = (ticket: Ticket) => {
    const info = statusInfo(ticket.status);

    return (
      <Pressable
        key={ticket.id}
        onPress={() => openTicket(ticket)}
        className="bg-white rounded-2xl p-4 mb-3 border"
        style={{
          borderColor: C.border,
          shadowColor: '#263B68',
          shadowOpacity: 0.035,
          shadowRadius: 8,
          elevation: 1,
        }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text
              className="text-[10px] font-bold mb-1"
              style={{ color: C.blue }}
            >
              {ticket.id}
            </Text>

            <Text className="text-sm font-bold" style={{ color: C.navy }}>
              {ticket.subject}
            </Text>

            <Text className="text-[11px] mt-1" style={{ color: C.muted }}>
              {ticket.category} · {ticket.date}
            </Text>
          </View>

          <View
            className="px-2.5 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: info.bg }}
          >
            <View
              className="w-1.5 h-1.5 rounded-full mr-1.5"
              style={{ backgroundColor: info.color }}
            />
            <Text
              className="text-[9px] font-bold"
              style={{ color: info.color }}
            >
              {ticket.status}
            </Text>
          </View>
        </View>

        <View className="h-px my-3" style={{ backgroundColor: C.border }} />

        <View className="flex-row items-center">
          <Ionicons name="business-outline" size={14} color={C.muted} />
          <Text className="text-[10px] ml-2 flex-1" style={{ color: C.muted }}>
            {ticket.department}
          </Text>

          <Ionicons name="chevron-forward" size={16} color={C.muted} />
        </View>

        <View className="flex-row items-center mt-3">
          <Ionicons name="chatbubble-ellipses-outline" size={13} color={C.blue} />
          <Text className="text-[10px] ml-2" style={{ color: C.blue }}>
            View latest response
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        {/* HEADER */}
        <View className="px-5 pt-3 pb-4">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white items-center justify-center border"
              style={{ borderColor: C.border }}
            >
              <Ionicons name="arrow-back" size={20} color={C.navy} />
            </Pressable>

            <View className="flex-1 ml-3">
              <Text
                className="text-[10px] font-bold tracking-[2px]"
                style={{ color: C.blue }}
              >
                CAMPUSOS
              </Text>
              <Text className="text-lg font-bold" style={{ color: C.navy }}>
                Student Support
              </Text>
            </View>

            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: C.paleBlue }}
            >
              <Ionicons name="headset-outline" size={21} color={C.blue} />
            </View>
          </View>
        </View>

        {/* LIGHT GRADIENT HERO */}
        <View className="px-5">
          <LinearGradient
            colors={['#E7EDFF', '#F0F0FF', '#F4EFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 19,
              borderWidth: 1,
              borderColor: '#E3E7FB',
            }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <View className="flex-row items-center">
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FFFFFFB8' }}
                  >
                    <Text
                      className="text-[9px] font-bold tracking-wider"
                      style={{ color: C.blue }}
                    >
                      STUDENT HELP CENTRE
                    </Text>
                  </View>
                </View>

                <Text
                  className="text-[23px] font-bold mt-3"
                  style={{ color: C.navy }}
                >
                  How can we help?
                </Text>

                <Text
                  className="text-xs leading-5 mt-2"
                  style={{ color: '#65718E' }}
                >
                  Get assistance with your academics, fees, library and campus services.
                </Text>
              </View>

              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: '#FFFFFFB8' }}
              >
                <Ionicons name="chatbubbles-outline" size={29} color={C.blue} />
              </View>
            </View>

            <Pressable
              onPress={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex-row items-center justify-center rounded-xl py-3.5 mt-5"
              style={{
                backgroundColor: C.navy,
                shadowColor: C.navy,
                shadowOpacity: 0.13,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Ionicons name="add-circle-outline" size={19} color="white" />
              <Text className="text-white text-xs font-bold ml-2">
                Raise a Request
              </Text>
            </Pressable>

            <View className="flex-row items-center mt-4">
              <Ionicons name="shield-checkmark-outline" size={14} color={C.green} />
              <Text className="text-[10px] ml-2" style={{ color: '#65718E' }}>
                Your requests are tracked with a unique ticket ID.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* NAVIGATION */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 mt-5 mb-5"
        >
          {['Overview', 'My Requests', 'Contacts', 'FAQs'].map(tab => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="mr-2 px-4 py-2.5 rounded-full"
              style={{
                backgroundColor: activeTab === tab ? C.navy : C.white,
                borderWidth: 1,
                borderColor: activeTab === tab ? C.navy : C.border,
              }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{
                  color: activeTab === tab ? C.white : C.muted,
                }}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <View className="px-5">
            <SectionTitle
              title="Your Support Activity"
              subtitle="A quick overview of your requests"
            />

            <View className="flex-row flex-wrap justify-between">
              {[
                {
                  label: 'Total Requests',
                  value: counts.total,
                  icon: 'documents-outline',
                  color: C.blue,
                  bg: C.paleBlue,
                },
                {
                  label: 'Awaiting Review',
                  value: counts.open,
                  icon: 'alert-circle-outline',
                  color: C.red,
                  bg: C.paleRed,
                },
                {
                  label: 'Being Reviewed',
                  value: counts.progress,
                  icon: 'time-outline',
                  color: C.orange,
                  bg: C.paleOrange,
                },
                {
                  label: 'Resolved',
                  value: counts.resolved,
                  icon: 'checkmark-circle-outline',
                  color: C.green,
                  bg: C.paleGreen,
                },
              ].map(item => (
                <View
                  key={item.label}
                  className="w-[48.5%] rounded-2xl p-4 mb-3 bg-white border"
                  style={{
                    borderColor: C.border,
                    shadowColor: '#263B68',
                    shadowOpacity: 0.03,
                    shadowRadius: 8,
                    elevation: 1,
                  }}
                >
                  <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={19}
                      color={item.color}
                    />
                  </View>

                  <Text
                    className="text-2xl font-bold mt-3"
                    style={{ color: C.navy }}
                  >
                    {item.value}
                  </Text>

                  <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* QUICK HELP */}
            <SectionTitle
              title="What do you need help with?"
              subtitle="Choose a category to get started"
            />

            <View className="bg-white rounded-2xl p-4 border mb-5" style={{ borderColor: C.border }}>
              <View className="flex-row flex-wrap justify-between">
                {categories.map(item => (
                  <Pressable
                    key={item.name}
                    onPress={() => {
                      resetForm();
                      selectCategory(item.fullName);
                      setShowForm(true);
                    }}
                    className="w-[48.5%] rounded-xl p-3 mb-2.5 flex-row items-center"
                    style={{ backgroundColor: item.bg }}
                  >
                    <View
                      className="w-9 h-9 rounded-xl items-center justify-center"
                      style={{ backgroundColor: '#FFFFFFC9' }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={19}
                        color={item.color}
                      />
                    </View>

                    <View className="flex-1 ml-2">
                      <Text className="text-[11px] font-bold" style={{ color: C.navy }}>
                        {item.name}
                      </Text>
                      <Text className="text-[9px] mt-0.5" style={{ color: C.muted }}>
                        Get help
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* RECENT REQUESTS */}
            <SectionTitle
              title="Recent Requests"
              subtitle="Stay updated on your complaints"
              action="View all"
              onAction={() => setActiveTab('My Requests')}
            />

            {tickets.slice(0, 2).map(renderTicket)}

            {/* SUPPORT INFORMATION */}
            <LinearGradient
              colors={['#F0F3FF', '#F4F0FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 16,
                marginTop: 5,
                borderWidth: 1,
                borderColor: '#E7E8FA',
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: '#FFFFFFC9' }}
                >
                  <Ionicons name="information-circle-outline" size={23} color={C.blue} />
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold" style={{ color: C.navy }}>
                    Need immediate assistance?
                  </Text>
                  <Text className="text-[10px] mt-1 leading-4" style={{ color: C.muted }}>
                    Find the relevant department contact information.
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setActiveTab('Contacts')}
                className="flex-row items-center mt-3"
              >
                <Text className="text-xs font-bold" style={{ color: C.blue }}>
                  View department contacts
                </Text>
                <Ionicons name="arrow-forward" size={14} color={C.blue} style={{ marginLeft: 6 }} />
              </Pressable>
            </LinearGradient>
          </View>
        )}

        {/* MY REQUESTS */}
        {activeTab === 'My Requests' && (
          <View className="px-5">
            <SectionTitle
              title="My Requests"
              subtitle="View and track your submitted complaints"
            />

            <View
              className="flex-row items-center rounded-xl px-3 bg-white border mb-4"
              style={{ borderColor: C.border }}
            >
              <Ionicons name="search-outline" size={19} color={C.muted} />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search ticket ID or subject..."
                placeholderTextColor={C.muted}
                className="flex-1 py-3 px-2 text-xs"
                style={{ color: C.navy }}
              />

              {!!search && (
                <Pressable onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color={C.muted} />
                </Pressable>
              )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              {['All', 'Open', 'In Progress', 'Resolved'].map(item => (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  className="mr-2 px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: filter === item ? C.paleBlue : C.white,
                    borderWidth: 1,
                    borderColor: filter === item ? C.blue : C.border,
                  }}
                >
                  <Text
                    className="text-[10px] font-bold"
                    style={{ color: filter === item ? C.blue : C.muted }}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold" style={{ color: C.navy }}>
                {filteredTickets.length} requests found
              </Text>
              <Text className="text-[10px]" style={{ color: C.muted }}>
                Latest first
              </Text>
            </View>

            {filteredTickets.length > 0 ? (
              filteredTickets.map(renderTicket)
            ) : (
              <View className="bg-white rounded-2xl p-8 items-center border" style={{ borderColor: C.border }}>
                <Ionicons name="file-tray-outline" size={37} color={C.muted} />
                <Text className="text-sm font-bold mt-3" style={{ color: C.navy }}>
                  No requests found
                </Text>
                <Text className="text-xs mt-2 text-center leading-5" style={{ color: C.muted }}>
                  Try another search or create a new support request.
                </Text>
                <Pressable
                  onPress={() => setShowForm(true)}
                  className="rounded-xl px-5 py-3 mt-4"
                  style={{ backgroundColor: C.navy }}
                >
                  <Text className="text-white text-xs font-bold">Raise a Request</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* CONTACTS */}
        {activeTab === 'Contacts' && (
          <View className="px-5">
            <SectionTitle
              title="Department Contacts"
              subtitle="Get in touch with the right department"
            />

            <LinearGradient
              colors={['#EAF0FF', '#F1EEFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 18, padding: 15, marginBottom: 16 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={22} color={C.blue} />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold" style={{ color: C.navy }}>
                    Contact the right team
                  </Text>
                  <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                    For quicker assistance, select the department related to your issue.
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {contacts.map(item => (
              <View
                key={item.name}
                className="bg-white rounded-2xl p-4 mb-3 border"
                style={{ borderColor: C.border }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Ionicons name={item.icon as any} size={21} color={item.color} />
                  </View>

                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-bold" style={{ color: C.navy }}>
                      {item.name}
                    </Text>
                    <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                      {item.detail}
                    </Text>
                  </View>
                </View>

                <View className="h-px my-3" style={{ backgroundColor: C.border }} />

                <View className="flex-row items-center mb-2">
                  <Ionicons name="call-outline" size={15} color={C.muted} />
                  <Text className="text-xs ml-2" style={{ color: C.navy }}>
                    {item.phone}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={15} color={C.muted} />
                  <Text className="text-xs ml-2" style={{ color: C.navy }}>
                    {item.email}
                  </Text>
                </View>
              </View>
            ))}

            <Text className="text-[10px] text-center mt-2 leading-4" style={{ color: C.muted }}>
              Contact details shown are sample details. Replace them with your college&apos;s official information.
            </Text>
          </View>
        )}

        {/* FAQ */}
        {activeTab === 'FAQs' && (
          <View className="px-5">
            <SectionTitle
              title="Frequently Asked Questions"
              subtitle="Find answers to common student queries"
            />

            {faqs.map((faq, index) => (
              <Pressable
                key={faq.q}
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="bg-white rounded-2xl p-4 mb-3 border"
                style={{ borderColor: C.border }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: C.paleBlue }}
                  >
                    <Text className="text-xs font-bold" style={{ color: C.blue }}>
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                  </View>

                  <Text className="text-xs font-bold flex-1 pr-2" style={{ color: C.navy }}>
                    {faq.q}
                  </Text>

                  <Ionicons
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={C.blue}
                  />
                </View>

                {expandedFaq === index && (
                  <Text className="text-xs leading-5 mt-4 pl-11" style={{ color: C.muted }}>
                    {faq.a}
                  </Text>
                )}
              </Pressable>
            ))}

            <LinearGradient
              colors={['#EAF0FF', '#F3EFFF']}
              style={{ borderRadius: 20, padding: 18, marginTop: 5 }}
            >
              <Text className="text-sm font-bold" style={{ color: C.navy }}>
                Didn&apos;t find your answer?
              </Text>

              <Text className="text-xs mt-2 leading-5" style={{ color: C.muted }}>
                Send us your question and get help from the appropriate department.
              </Text>

              <Pressable
                onPress={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="rounded-xl py-3 items-center mt-4"
                style={{ backgroundColor: C.navy }}
              >
                <Text className="text-white text-xs font-bold">
                  Contact Student Support
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
        )}
      </ScrollView>

      {/* RAISE REQUEST MODAL */}
      <Modal
        visible={showForm}
        animationType="slide"
        transparent
        onRequestClose={() => setShowForm(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: '#17223C70' }}>
          <View
            className="bg-white rounded-t-[28px]"
            style={{ maxHeight: '94%' }}
          >
            <View
              className="flex-row items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: C.border }}
            >
              <View>
                <Text className="text-lg font-bold" style={{ color: C.navy }}>
                  Raise a Request
                </Text>
                <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                  Tell us what you need help with
                </Text>
              </View>

              <Pressable
                onPress={() => setShowForm(false)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={20} color={C.navy} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20, paddingBottom: 35 }}
            >
              <FieldLabel>What do you need help with? *</FieldLabel>

              <View className="flex-row flex-wrap justify-between mb-4">
                {categories.map(item => (
                  <Pressable
                    key={item.fullName}
                    onPress={() => selectCategory(item.fullName)}
                    className="w-[48.5%] rounded-xl p-3 mb-2 flex-row items-center"
                    style={{
                      backgroundColor: category === item.fullName ? C.paleBlue : C.bg,
                      borderWidth: 1,
                      borderColor: category === item.fullName ? C.blue : C.border,
                    }}
                  >
                    <Ionicons name={item.icon as any} size={17} color={item.color} />
                    <Text className="text-[10px] font-bold ml-2 flex-1" style={{ color: C.navy }}>
                      {item.name}
                    </Text>
                    {category === item.fullName && (
                      <Ionicons name="checkmark-circle" size={15} color={C.blue} />
                    )}
                  </Pressable>
                ))}
              </View>

              <FieldLabel>Assigned Department</FieldLabel>

              <View
                className="flex-row items-center rounded-xl px-4 py-3 mb-4"
                style={{ backgroundColor: C.paleBlue }}
              >
                <Ionicons name="business-outline" size={17} color={C.blue} />
                <Text className="text-xs font-semibold ml-2" style={{ color: C.navy }}>
                  {department || 'Select an issue category first'}
                </Text>
              </View>

              <FieldLabel>Request Subject *</FieldLabel>

              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter a short title for your issue"
                placeholderTextColor={C.muted}
                maxLength={100}
                className="rounded-xl border px-4 py-3 text-xs mb-4"
                style={{
                  borderColor: C.border,
                  color: C.navy,
                  backgroundColor: C.white,
                }}
              />

              <FieldLabel>Explain Your Issue *</FieldLabel>

              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your problem in detail. Include relevant dates, subject names or reference numbers..."
                placeholderTextColor={C.muted}
                multiline
                textAlignVertical="top"
                maxLength={1000}
                className="rounded-xl border px-4 py-3 text-xs"
                style={{
                  borderColor: C.border,
                  color: C.navy,
                  minHeight: 125,
                  backgroundColor: C.white,
                }}
              />

              <Text className="text-right text-[10px] mt-2 mb-4" style={{ color: C.muted }}>
                {description.length}/1000 characters
              </Text>

              <FieldLabel>How urgent is your issue?</FieldLabel>

              <View className="flex-row justify-between mb-5">
                {(['Low', 'Normal', 'High'] as Priority[]).map(item => (
                  <Pressable
                    key={item}
                    onPress={() => setPriority(item)}
                    className="flex-1 py-3 rounded-xl items-center mx-1 border"
                    style={{
                      backgroundColor: priority === item
                        ? item === 'High' ? C.paleRed : C.paleBlue
                        : C.white,
                      borderColor: priority === item
                        ? item === 'High' ? C.red : C.blue
                        : C.border,
                    }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{
                        color: item === 'High' ? C.red : C.blue,
                      }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <FieldLabel>Attach Supporting Document (Optional)</FieldLabel>

              <Pressable
                onPress={chooseDocument}
                className="rounded-xl p-4 flex-row items-center mb-5 border"
                style={{
                  backgroundColor: C.paleBlue,
                  borderColor: '#DDE3FC',
                  borderStyle: 'dashed',
                }}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: C.white }}
                >
                  <Ionicons name="cloud-upload-outline" size={22} color={C.blue} />
                </View>

                <View className="flex-1 ml-3">
                  <Text className="text-xs font-bold" style={{ color: C.navy }}>
                    {attachment || 'Choose a document'}
                  </Text>
                  <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                    PDF, DOC, JPG or PNG
                  </Text>
                </View>

                <Ionicons name="add-circle-outline" size={21} color={C.blue} />
              </Pressable>

              <Pressable
                onPress={submitTicket}
                className="rounded-xl py-4 items-center"
                style={{ backgroundColor: C.navy }}
              >
                <Text className="text-white text-sm font-bold">
                  Submit Request
                </Text>
              </Pressable>

              <Text className="text-[10px] text-center mt-3" style={{ color: C.muted }}>
                Your request will receive a unique tracking ID.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* REQUEST DETAILS MODAL */}
      <Modal
        visible={showDetails}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDetails(false)}
      >
        <View
          className="flex-1 justify-center px-5"
          style={{ backgroundColor: '#17223C70' }}
        >
          <View
            className="bg-white rounded-3xl p-5"
            style={{ maxHeight: '85%' }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-lg font-bold" style={{ color: C.navy }}>
                  Request Details
                </Text>
                <Text className="text-[10px] mt-1" style={{ color: C.muted }}>
                  Your support request information
                </Text>
              </View>

              <Pressable
                onPress={() => setShowDetails(false)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: C.bg }}
              >
                <Ionicons name="close" size={19} color={C.navy} />
              </Pressable>
            </View>

            {selectedTicket && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* TICKET ID */}
                <LinearGradient
                  colors={['#EAF0FF', '#F2EFFF']}
                  style={{ borderRadius: 17, padding: 15, marginBottom: 16 }}
                >
                  <Text className="text-[9px] font-bold tracking-wider" style={{ color: C.blue }}>
                    TICKET REFERENCE
                  </Text>

                  <Text className="text-lg font-bold mt-1" style={{ color: C.navy }}>
                    {selectedTicket.id}
                  </Text>

                  <View className="flex-row items-center justify-between mt-3">
                    <View
                      className="rounded-full px-3 py-1.5"
                      style={{ backgroundColor: statusInfo(selectedTicket.status).bg }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color: statusInfo(selectedTicket.status).color }}
                      >
                        {selectedTicket.status}
                      </Text>
                    </View>

                    <Text className="text-[10px]" style={{ color: C.muted }}>
                      {selectedTicket.date}
                    </Text>
                  </View>
                </LinearGradient>

                <Text className="text-sm font-bold mb-2" style={{ color: C.navy }}>
                  {selectedTicket.subject}
                </Text>

                <Text className="text-xs leading-5 mb-4" style={{ color: C.muted }}>
                  {selectedTicket.description}
                </Text>

                {[
                  ['Category', selectedTicket.category],
                  ['Department', selectedTicket.department],
                  ['Priority', selectedTicket.priority],
                  ['Submitted on', selectedTicket.date],
                ].map(([label, value]) => (
                  <View
                    key={label}
                    className="flex-row justify-between py-3 border-b"
                    style={{ borderColor: C.border }}
                  >
                    <Text className="text-xs" style={{ color: C.muted }}>
                      {label}
                    </Text>
                    <Text className="text-xs font-bold flex-1 text-right ml-3" style={{ color: C.navy }}>
                      {value}
                    </Text>
                  </View>
                ))}

                {!!selectedTicket.attachment && (
                  <View
                    className="flex-row items-center rounded-xl p-3 mt-3"
                    style={{ backgroundColor: C.bg }}
                  >
                    <Ionicons name="document-attach-outline" size={19} color={C.blue} />
                    <Text className="text-xs ml-2 flex-1" style={{ color: C.navy }}>
                      {selectedTicket.attachment}
                    </Text>
                  </View>
                )}

                {/* RESPONSE */}
                <Text className="text-xs font-bold mt-5 mb-2" style={{ color: C.navy }}>
                  Latest Department Response
                </Text>

                <View
                  className="rounded-xl p-4"
                  style={{ backgroundColor: C.paleBlue }}
                >
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={C.blue} />
                    <Text className="text-[10px] font-bold ml-2" style={{ color: C.blue }}>
                      SUPPORT TEAM
                    </Text>
                  </View>

                  <Text className="text-xs leading-5" style={{ color: C.navy }}>
                    {selectedTicket.response}
                  </Text>
                </View>

                {/* STUDENT ACTION */}
                {selectedTicket.status === 'Resolved' && (
                  <View className="mt-4">
                    <View
                      className="rounded-xl p-3 mb-3"
                      style={{ backgroundColor: C.paleGreen }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle-outline" size={18} color={C.green} />
                        <Text className="text-xs font-bold ml-2" style={{ color: C.green }}>
                          Request marked as resolved
                        </Text>
                      </View>

                      <Text className="text-[10px] leading-4 mt-2" style={{ color: C.navy }}>
                        If your issue still exists, you can reopen this request.
                      </Text>
                    </View>

                    <Pressable
                      onPress={reopenTicket}
                      className="rounded-xl py-3 items-center"
                      style={{ backgroundColor: C.paleBlue }}
                    >
                      <Text className="text-xs font-bold" style={{ color: C.blue }}>
                        Reopen Request
                      </Text>
                    </Pressable>
                  </View>
                )}

                <Text className="text-[9px] text-center mt-5 mb-2" style={{ color: C.muted }}>
                  For further assistance, contact the assigned department.
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* CUSTOM NOTIFICATION */}
      <Modal
        visible={popup.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopup(prev => ({ ...prev, visible: false }))}
      >
        <View
          className="flex-1 items-center justify-center px-7"
          style={{ backgroundColor: '#17223C70' }}
        >
          <View className="w-full rounded-3xl bg-white p-6 items-center">
            <LinearGradient
              colors={
                popup.type === 'error'
                  ? ['#FFF0F1', '#FFF6F6']
                  : ['#EAF0FF', '#F2EFFF']
              }
              style={{
                width: 58,
                height: 58,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons
                name={popup.type === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline'}
                size={30}
                color={popup.type === 'error' ? C.red : C.blue}
              />
            </LinearGradient>

            <Text className="text-base font-bold text-center" style={{ color: C.navy }}>
              {popup.title}
            </Text>

            <Text className="text-xs leading-5 text-center mt-2" style={{ color: C.muted }}>
              {popup.message}
            </Text>

            <Pressable
              onPress={() => setPopup(prev => ({ ...prev, visible: false }))}
              className="w-full rounded-xl py-3.5 items-center mt-5"
              style={{ backgroundColor: C.navy }}
            >
              <Text className="text-white text-xs font-bold">
                Okay, Got it
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
