import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export type PortalRole = 'parent' | 'faculty' | 'hod' | 'principal';
export type PortalSection = 'Overview' | 'Work' | 'Updates' | 'Profile' | 'Department' | 'Campus';
export type IconName = keyof typeof Ionicons.glyphMap;

type PortalConfig = {
  label: string;
  title: string;
  subtitle: string;
  person: string;
  context: string;
  color: string;
  tint: string;
  icon: IconName;
  stats: { label: string; value: string; icon: IconName }[];
  workTitle: string;
  workDescription: string;
};

const PORTALS: Record<PortalRole, PortalConfig> = {
  parent: {
    label: 'Parent',
    title: 'Family dashboard',
    subtitle: 'A clear view of your child’s campus life.',
    person: 'Maya Patel',
    context: 'Parent account · Greenfield College',
    color: '#8B63D9',
    tint: '#F3EDFF',
    icon: 'heart-outline',
    stats: [
      { label: 'Attendance', value: '94%', icon: 'calendar-outline' },
      { label: 'Term average', value: '8.6 GPA', icon: 'ribbon-outline' },
      { label: 'Fee balance', value: '₹12,000', icon: 'wallet-outline' },
      { label: 'New updates', value: '2', icon: 'notifications-outline' },
    ],
    workTitle: 'Your child’s progress',
    workDescription: 'Attendance, academics, fees and school communication.',
  },
  faculty: {
    label: 'Faculty',
    title: 'Faculty workspace',
    subtitle: 'Your classes, students and teaching tasks.',
    person: 'Dr. Priya Sharma',
    context: 'Computer Science · Greenfield College',
    color: '#159A75',
    tint: '#E9F8F2',
    icon: 'book-outline',
    stats: [
      { label: 'Classes today', value: '4', icon: 'calendar-outline' },
      { label: 'Students', value: '126', icon: 'people-outline' },
      { label: 'To review', value: '3', icon: 'clipboard-outline' },
      { label: 'Class attendance', value: '89%', icon: 'checkmark-circle-outline' },
    ],
    workTitle: 'Today’s teaching tasks',
    workDescription: 'Take attendance, manage assignments and support learners.',
  },
  hod: {
    label: 'HOD',
    title: 'Department overview',
    subtitle: 'Keep your department moving forward.',
    person: 'Dr. Arjun Mehta',
    context: 'Head of Computer Science · Greenfield College',
    color: '#6478E8',
    tint: '#EEF1FF',
    icon: 'school-outline',
    stats: [
      { label: 'Faculty', value: '18', icon: 'people-outline' },
      { label: 'Active courses', value: '12', icon: 'book-outline' },
      { label: 'Approvals', value: '7', icon: 'time-outline' },
      { label: 'Attendance', value: '91%', icon: 'checkmark-circle-outline' },
    ],
    workTitle: 'Department actions',
    workDescription: 'Review requests, monitor courses and support faculty.',
  },
  principal: {
    label: 'Principal',
    title: 'Campus overview',
    subtitle: 'A focused view of campus priorities and progress.',
    person: 'Dr. Anita Rao',
    context: 'Principal’s office · Greenfield College',
    color: '#B68A37',
    tint: '#FFF6E5',
    icon: 'business-outline',
    stats: [
      { label: 'Students', value: '2,840', icon: 'people-outline' },
      { label: 'Faculty', value: '142', icon: 'school-outline' },
      { label: 'Approvals', value: '14', icon: 'time-outline' },
      { label: 'Attendance', value: '93%', icon: 'checkmark-circle-outline' },
    ],
    workTitle: 'Campus priorities',
    workDescription: 'Review key requests, school performance and operations.',
  },
};

const FACULTY_CLASSES = [
  { name: 'Data Structures', section: 'CSE · II Year · A', time: '09:00 AM' },
  { name: 'Database Systems', section: 'CSE · III Year · B', time: '10:30 AM' },
  { name: 'Software Engineering', section: 'CSE · II Year · B', time: '01:30 PM' },
];

const SAMPLE_STUDENTS = [
  'Aarav Nair', 'Ananya Shah', 'Dev Patel', 'Ishita Rao',
  'Kabir Mehta', 'Mira Joseph', 'Rohan Das', 'Sara Khan',
];

const APPROVALS: Record<Exclude<PortalRole, 'parent' | 'faculty'>, { title: string; detail: string; tag: string }[]> = {
  hod: [
    { title: 'Lab equipment request', detail: 'Dr. K. Iyer · Data Science Lab', tag: 'Budget review' },
    { title: 'Project review schedule', detail: 'Final year · 8 project teams', tag: 'Academic' },
    { title: 'Faculty leave request', detail: 'Prof. R. Menon · 2 days', tag: 'People' },
  ],
  principal: [
    { title: 'Department budget plan', detail: 'Computer Science · Q3 allocation', tag: 'Finance' },
    { title: 'Campus event proposal', detail: 'Student Council · Annual tech fest', tag: 'Campus' },
    { title: 'Staff development request', detail: 'Faculty Development Programme', tag: 'People' },
  ],
};

const INITIAL_UPDATES: { title: string; detail: string; icon: IconName }[] = [
  { title: 'Mid-term schedule is available', detail: 'Academic Office · Today, 9:15 AM', icon: 'calendar-outline' as const },
  { title: 'Campus maintenance this weekend', detail: 'Campus Services · Yesterday', icon: 'construct-outline' as const },
  { title: 'Student wellness week begins Monday', detail: 'Student Affairs · Nov 9', icon: 'heart-outline' as const },
];

const ROLE_DESTINATIONS: Record<PortalRole, { work: string; updates: string; department?: string; campus?: string }> = {
  parent: { work: '/parent/academics', updates: '/parent/school' },
  faculty: { work: '/faculty/classes', updates: '/faculty/updates' },
  hod: { work: '/hod/approvals', updates: '/hod/updates', department: '/hod/department' },
  principal: { work: '/principal/approvals', updates: '/principal/updates', campus: '/principal/campus' },
};

export default function RolePortalDashboard({ role, section }: { role: PortalRole; section: PortalSection }) {
  const config = PORTALS[role];
  const [childIndex, setChildIndex] = useState(0);
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [savedAttendance, setSavedAttendance] = useState(false);
  const [decisions, setDecisions] = useState<Record<string, 'Approved' | 'Needs review'>>({});
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});
  const [updates, setUpdates] = useState(INITIAL_UPDATES);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [activeClass, setActiveClass] = useState(0);

  const child = childIndex === 0
    ? { name: 'Aarav Patel', grade: 'Grade 10 · Section A', attendance: '94%', average: '8.6 GPA', due: '₹12,000' }
    : { name: 'Anaya Patel', grade: 'Grade 7 · Section B', attendance: '97%', average: '9.1 GPA', due: 'Paid' };

  const stats = useMemo(() => {
    if (role !== 'parent') return config.stats;
    return [
      { ...config.stats[0], value: child.attendance },
      { ...config.stats[1], value: child.average },
      { ...config.stats[2], value: child.due },
      config.stats[3],
    ];
  }, [child.attendance, child.average, child.due, config.stats, role]);

  const updateDecision = (id: string, decision: 'Approved' | 'Needs review') => {
    setDecisions((current) => ({ ...current, [id]: decision }));
  };

  const submitDraft = () => {
    const message = draft.trim();
    if (!message) {
      Alert.alert('Add a message', 'Write a short update before saving.');
      return;
    }
    setUpdates((current) => [
      { title: message, detail: `Saved just now · ${config.label}`, icon: 'chatbubble-ellipses-outline' },
      ...current,
    ]);
    setDraft('');
    setComposeOpen(false);
    Alert.alert('Saved on this device', 'This is a demo message. Connect your campus system to deliver it.');
  };

  const openComposer = () => {
    setDraft('');
    setComposeOpen(true);
  };

  const navigateTo = (destination: 'work' | 'updates' | 'department' | 'campus') => {
    const path = ROLE_DESTINATIONS[role][destination];
    if (path) router.navigate(path as never);
  };

  const parentStats = () => (
    <View style={styles.childCard}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: config.tint }]}>
            <Ionicons name="person-outline" size={19} color={config.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{child.name}</Text>
            <Text style={styles.helperText}>{child.grade}</Text>
          </View>
        </View>
        <Pressable onPress={() => setChildIndex((current) => (current === 0 ? 1 : 0))} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: config.color }]}>Switch</Text>
        </Pressable>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: child.attendance, backgroundColor: config.color }]} />
      </View>
      <Text style={styles.helperText}>Attendance this term · {child.attendance}</Text>
    </View>
  );

  const renderOverview = () => (
    <>
      {role === 'parent' ? parentStats() : (
        <View style={styles.focusCard}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.focusEyebrow}>{role === 'faculty' ? 'NEXT UP' : role === 'hod' ? 'DEPARTMENT PULSE' : 'CAMPUS PULSE'}</Text>
              <Text style={styles.focusTitle}>{role === 'faculty' ? 'Data Structures' : role === 'hod' ? 'Computer Science' : 'Greenfield College'}</Text>
              <Text style={styles.focusCopy}>{role === 'faculty' ? '09:00 AM · CSE II Year A · Room 204' : role === 'hod' ? '12 courses · 18 faculty members · 3 items need attention' : 'Academic year 2026–27 · 6 active departments'}</Text>
            </View>
            <View style={styles.focusIcon}><Ionicons name={config.icon} size={24} color="#FFFFFF" /></View>
          </View>
          <Pressable onPress={() => navigateTo(role === 'hod' ? 'department' : role === 'principal' ? 'campus' : 'work')} style={styles.focusAction}>
            <Text style={styles.focusActionText}>{role === 'faculty' ? 'Open class tools' : 'Review priorities'}</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: config.tint }]}>
              <Ionicons name={stat.icon} size={18} color={config.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <SectionHeading title={role === 'parent' ? 'Coming up for your family' : 'Today at a glance'} subtitle={role === 'parent' ? 'A few things worth knowing' : 'Your important items in one place'} />
      <View style={styles.panel}>
        {(role === 'parent' ? [
          { title: 'Mathematics assignment due Friday', detail: '2 days left · View the assignment', icon: 'document-text-outline' as const },
          { title: 'Parent–teacher meeting', detail: 'Thursday · 3:30 PM · Room 12', icon: 'people-outline' as const },
          { title: child.due === 'Paid' ? 'Term fee paid' : 'Term fee payment due', detail: child.due === 'Paid' ? 'Receipt available in fees' : `${child.due} · Due Nov 20`, icon: 'wallet-outline' as const },
        ] : role === 'faculty' ? [
          { title: 'Attendance needs recording', detail: 'Data Structures · 32 students', icon: 'checkbox-outline' as const },
          { title: '3 submissions to review', detail: 'Database Systems · Due today', icon: 'document-text-outline' as const },
          { title: 'Faculty meeting', detail: '4:00 PM · Department conference room', icon: 'people-outline' as const },
        ] : role === 'hod' ? [
          { title: '7 department requests pending', detail: 'Leave, lab and academic requests', icon: 'time-outline' as const },
          { title: 'Course progress review', detail: 'Semester 3 · Update due Friday', icon: 'bar-chart-outline' as const },
          { title: 'Faculty meeting', detail: 'Thursday · 2:00 PM · Seminar room', icon: 'people-outline' as const },
        ] : [
          { title: '14 campus requests pending', detail: 'Across academics, people and facilities', icon: 'time-outline' as const },
          { title: 'Monthly leadership review', detail: 'Friday · 10:00 AM · Board room', icon: 'bar-chart-outline' as const },
          { title: 'Student wellness week', detail: 'Begins Monday · Campus-wide', icon: 'heart-outline' as const },
        ]).map((item) => <InfoRow key={item.title} {...item} />)}
      </View>
      {role === 'parent' ? (
        <Pressable onPress={() => navigateTo('updates')} style={[styles.wideAction, { backgroundColor: config.tint }]}>
          <Ionicons name="chatbubbles-outline" size={19} color={config.color} />
          <Text style={[styles.wideActionText, { color: config.color }]}>Contact the school</Text>
          <Ionicons name="chevron-forward" size={17} color={config.color} />
        </Pressable>
      ) : null}
    </>
  );

  const renderFacultyWork = () => {
    const classInfo = FACULTY_CLASSES[activeClass];
    const presentCount = SAMPLE_STUDENTS.reduce((total, name) => total + (presence[name] === false ? 0 : 1), 0);
    return (
      <>
        <View style={styles.rowScroll}>
          {FACULTY_CLASSES.map((item, index) => (
            <Pressable key={item.name} onPress={() => { setActiveClass(index); setSavedAttendance(false); }} style={[styles.classChip, index === activeClass && { backgroundColor: config.color, borderColor: config.color }]}>
              <Text style={[styles.classChipText, index === activeClass && { color: '#FFFFFF' }]}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.panel}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{classInfo.name}</Text>
              <Text style={styles.helperText}>{classInfo.section} · {classInfo.time}</Text>
            </View>
            <Text style={[styles.countBadge, { color: config.color, backgroundColor: config.tint }]}>{presentCount}/{SAMPLE_STUDENTS.length}</Text>
          </View>
          <Text style={styles.sectionLabel}>CLASS ROSTER</Text>
          {SAMPLE_STUDENTS.map((name, index) => {
            const isPresent = presence[name] !== false;
            return (
              <Pressable key={name} onPress={() => { setPresence((current) => ({ ...current, [name]: !isPresent })); setSavedAttendance(false); }} style={styles.rosterRow}>
                <View style={[styles.miniAvatar, { backgroundColor: index % 2 ? '#F0F2FF' : '#EEF7F2' }]}><Text style={styles.miniAvatarText}>{name.split(' ').map((part) => part[0]).join('')}</Text></View>
                <Text style={styles.rosterName}>{name}</Text>
                <View style={[styles.presenceToggle, isPresent && { backgroundColor: '#E8F7EF' }]}>
                  <Ionicons name={isPresent ? 'checkmark-circle' : 'close-circle-outline'} size={17} color={isPresent ? '#209A6B' : '#8992A6'} />
                  <Text style={[styles.presenceText, isPresent && { color: '#209A6B' }]}>{isPresent ? 'Present' : 'Absent'}</Text>
                </View>
              </Pressable>
            );
          })}
          <Pressable onPress={() => { setSavedAttendance(true); Alert.alert('Attendance saved', 'This demo attendance record is stored in the current screen only.'); }} style={[styles.primaryButton, { backgroundColor: config.color }]}>
            <Ionicons name={savedAttendance ? 'checkmark-circle-outline' : 'save-outline'} size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>{savedAttendance ? 'Attendance saved' : 'Save attendance'}</Text>
          </Pressable>
        </View>
        <SectionHeading title="Teaching tools" subtitle="Create and manage class work" />
        <ActionRow title="Create an assignment" detail="Add instructions and a due date" icon="add-circle-outline" color={config.color} tint={config.tint} button="Create" onPress={openComposer} />
        <ActionRow title="Review submissions" detail="3 student submissions are waiting" icon="document-text-outline" color={config.color} tint={config.tint} button="Open" onPress={() => Alert.alert('Submissions', 'Connect your learning platform to load student work.')} />
      </>
    );
  };

  const renderParentWork = () => (
    <>
      <View style={styles.panel}>
        <Text style={styles.cardTitle}>{child.name} · {child.grade}</Text>
        <Text style={[styles.helperText, { marginTop: 5 }]}>Academic snapshot · Term 1</Text>
        <View style={styles.metricLine}><Text style={styles.metricLabel}>Attendance</Text><Text style={styles.metricValue}>{child.attendance}</Text></View>
        <View style={styles.metricLine}><Text style={styles.metricLabel}>Term average</Text><Text style={styles.metricValue}>{child.average}</Text></View>
        <View style={styles.metricLine}><Text style={styles.metricLabel}>Fee status</Text><Text style={styles.metricValue}>{child.due === 'Paid' ? 'Paid' : `${child.due} due`}</Text></View>
        <View style={styles.metricLine}><Text style={styles.metricLabel}>Next assessment</Text><Text style={styles.metricValue}>Nov 18</Text></View>
      </View>
      <SectionHeading title="Family actions" subtitle="Stay connected with the school" />
      <ActionRow title="Message the class teacher" detail="Ask a question or request a callback" icon="chatbubble-ellipses-outline" color={config.color} tint={config.tint} button="Message" onPress={openComposer} />
      <ActionRow title="Acknowledge school notices" detail="Confirm you have seen important updates" icon="checkmark-done-outline" color={config.color} tint={config.tint} button={acknowledged.notice ? 'Done' : 'Acknowledge'} onPress={() => setAcknowledged((current) => ({ ...current, notice: true }))} />
      <ActionRow title="View fee information" detail="Balance, due date and receipts" icon="wallet-outline" color={config.color} tint={config.tint} button="View" onPress={() => Alert.alert('Fee information', 'Connect the college fee system to load statements and receipts.')} />
    </>
  );

  const renderApprovals = () => {
    const requests = APPROVALS[role as 'hod' | 'principal'];
    return (
      <>
        <View style={[styles.noteBanner, { backgroundColor: config.tint }]}>
          <Ionicons name="information-circle-outline" size={19} color={config.color} />
          <Text style={[styles.noteText, { color: config.color }]}>Review decisions are saved only in this demo workspace.</Text>
        </View>
        {requests.map((request) => {
          const decision = decisions[request.title];
          return (
            <View key={request.title} style={styles.requestCard}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.cardTitle}>{request.title}</Text>
                  <Text style={[styles.helperText, { marginTop: 5 }]}>{request.detail}</Text>
                </View>
                <Text style={[styles.tag, { color: config.color, backgroundColor: config.tint }]}>{decision ?? request.tag}</Text>
              </View>
              <View style={styles.row}>
                <Pressable onPress={() => updateDecision(request.title, 'Approved')} style={[styles.smallButton, { backgroundColor: config.color }]}><Text style={styles.smallButtonText}>Approve</Text></Pressable>
                <Pressable onPress={() => updateDecision(request.title, 'Needs review')} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Needs review</Text></Pressable>
              </View>
            </View>
          );
        })}
        <ActionRow title="Publish a campus notice" detail="Share a brief update with your community" icon="megaphone-outline" color={config.color} tint={config.tint} button="Compose" onPress={openComposer} />
      </>
    );
  };

  const renderDepartment = () => (
    <>
      <View style={styles.panel}>
        <Text style={styles.cardTitle}>Course progress</Text>
        <Text style={[styles.helperText, { marginTop: 4 }]}>Semester 5 · Updated this week</Text>
        <ProgressMeterRow label="Data Structures" value="82%" progress="82%" color={config.color} />
        <ProgressMeterRow label="Database Systems" value="74%" progress="74%" color={config.color} />
        <ProgressMeterRow label="Artificial Intelligence" value="68%" progress="68%" color={config.color} />
      </View>
      <SectionHeading title="Faculty coordination" subtitle="Department coverage and follow-ups" />
      <View style={styles.panel}>
        <InfoRow title="Teaching plans received" detail="16 of 18 faculty · 2 need follow-up" icon="document-text-outline" />
        <InfoRow title="Student concerns" detail="4 open · 2 awaiting faculty response" icon="chatbubbles-outline" />
        <InfoRow title="Lab readiness" detail="3 labs checked · 1 equipment request pending" icon="flask-outline" />
      </View>
      <Pressable onPress={() => navigateTo('work')} style={[styles.wideAction, { backgroundColor: config.tint }]}>
        <Ionicons name="time-outline" size={19} color={config.color} />
        <Text style={[styles.wideActionText, { color: config.color }]}>Review department requests</Text>
        <Ionicons name="chevron-forward" size={17} color={config.color} />
      </Pressable>
    </>
  );

  const renderCampus = () => (
    <>
      <View style={styles.panel}>
        <Text style={styles.cardTitle}>Campus performance</Text>
        <Text style={[styles.helperText, { marginTop: 4 }]}>Institution snapshot · Current term</Text>
        <ProgressMeterRow label="Average attendance" value="93%" progress="93%" color={config.color} />
        <ProgressMeterRow label="Fee collection" value="88%" progress="88%" color={config.color} />
        <ProgressMeterRow label="Student support cases resolved" value="76%" progress="76%" color={config.color} />
      </View>
      <SectionHeading title="Campus operations" subtitle="Areas with active follow-up" />
      <View style={styles.panel}>
        <InfoRow title="Facilities" detail="2 maintenance requests need review" icon="construct-outline" />
        <InfoRow title="Student wellbeing" detail="Wellness week starts Monday" icon="heart-outline" />
        <InfoRow title="Academic quality" detail="6 department reports ready to review" icon="bar-chart-outline" />
      </View>
      <Pressable onPress={() => Alert.alert('Report prepared', 'This demo summary is ready to connect to your institution reporting system.')} style={[styles.wideAction, { backgroundColor: config.tint }]}>
        <Ionicons name="document-text-outline" size={19} color={config.color} />
        <Text style={[styles.wideActionText, { color: config.color }]}>Prepare campus summary</Text>
        <Ionicons name="chevron-forward" size={17} color={config.color} />
      </Pressable>
    </>
  );

  const renderWork = () => {
    if (role === 'faculty') return renderFacultyWork();
    if (role === 'parent') return renderParentWork();
    return renderApprovals();
  };

  const renderUpdates = () => (
    <>
      <View style={styles.updateIntro}>
        <Text style={styles.cardTitle}>Campus notices</Text>
        <Text style={[styles.helperText, { marginTop: 4 }]}>Updates relevant to your role</Text>
      </View>
      {role === 'faculty' || role === 'hod' || role === 'principal' || role === 'parent' ? (
        <Pressable onPress={openComposer} style={[styles.composeButton, { backgroundColor: config.tint }]}>
          <Ionicons name={role === 'parent' ? 'chatbubble-ellipses-outline' : 'add-circle-outline'} size={19} color={config.color} />
          <Text style={[styles.composeText, { color: config.color }]}>{role === 'parent' ? 'Message the school' : 'Create an update'}</Text>
          <Ionicons name="arrow-forward" size={16} color={config.color} />
        </Pressable>
      ) : null}
      <View style={styles.panel}>
        {updates.map((item, index) => (
          <View key={`${item.title}-${index}`} style={styles.updateRow}>
            <View style={[styles.updateIcon, { backgroundColor: config.tint }]}><Ionicons name={item.icon} size={18} color={config.color} /></View>
            <View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.helperText}>{item.detail}</Text></View>
          </View>
        ))}
      </View>
    </>
  );

  const renderProfile = () => (
    <>
      <View style={styles.profileCard}>
        <View style={[styles.profileAvatar, { backgroundColor: config.tint }]}><Ionicons name={config.icon} size={28} color={config.color} /></View>
        <Text style={styles.profileName}>{config.person}</Text>
        <Text style={styles.profileContext}>{config.context}</Text>
        <View style={[styles.roleBadge, { backgroundColor: config.tint }]}><Text style={[styles.roleBadgeText, { color: config.color }]}>{config.label.toUpperCase()} PORTAL</Text></View>
      </View>
      <SectionHeading title="Preferences" subtitle="Choose how CampusOS keeps you informed" />
      <PreferenceRow title="Push notifications" detail="Time-sensitive campus updates" enabled={pushEnabled} onPress={() => setPushEnabled((value) => !value)} color={config.color} />
      <PreferenceRow title="Email summaries" detail="A weekly digest of important activity" enabled={emailEnabled} onPress={() => setEmailEnabled((value) => !value)} color={config.color} />
      <Pressable onPress={() => router.replace('/login')} style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={18} color="#D85C65" />
        <Text style={styles.signOutText}>Sign out / switch role</Text>
      </Pressable>
      <Text style={styles.demoFootnote}>This portal uses sample campus records. Connect your institution’s system for live data and delivery.</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><Text style={styles.brandLetter}>C</Text></View>
            <View><Text style={styles.brandName}>CampusOS</Text><Text style={styles.brandTag}>CAMPUS, CONNECTED</Text></View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open campus updates" onPress={() => navigateTo('updates')} style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={21} color="#202B49" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.welcomeRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.greeting}>Hello, {config.person.split(' ')[0]}</Text>
            <Text style={styles.pageTitle}>{config.title}</Text>
            <Text style={styles.pageSubtitle}>{config.subtitle}</Text>
          </View>
          <View style={[styles.headerAvatar, { backgroundColor: config.tint }]}><Ionicons name={config.icon} size={22} color={config.color} /></View>
        </View>

        <View style={styles.demoPill}><View style={styles.demoDot} /><Text style={styles.demoPillText}>DEMO WORKSPACE · SAMPLE RECORDS</Text></View>

        {section === 'Overview' ? renderOverview() : null}
        {section === 'Work' ? <><SectionHeading title={config.workTitle} subtitle={config.workDescription} />{renderWork()}</> : null}
        {section === 'Department' ? <><SectionHeading title="Department" subtitle="Course delivery, faculty support and student concerns." />{renderDepartment()}</> : null}
        {section === 'Campus' ? <><SectionHeading title="Campus operations" subtitle="Performance indicators and institution-wide priorities." />{renderCampus()}</> : null}
        {section === 'Updates' ? renderUpdates() : null}
        {section === 'Profile' ? renderProfile() : null}
      </ScrollView>

      <Modal visible={composeOpen} animationType="slide" transparent onRequestClose={() => setComposeOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <Pressable style={styles.modalScrim} onPress={() => setComposeOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.rowBetween}>
              <View><Text style={styles.modalTitle}>{role === 'parent' ? 'Message the school' : role === 'faculty' ? 'Create an assignment' : 'Create a campus update'}</Text><Text style={styles.helperText}>Saved locally as a demo</Text></View>
              <Pressable onPress={() => setComposeOpen(false)} style={styles.closeButton}><Ionicons name="close" size={20} color="#8992A6" /></Pressable>
            </View>
            <TextInput value={draft} onChangeText={setDraft} placeholder={role === 'parent' ? 'Write a message for the class teacher…' : role === 'faculty' ? 'Assignment title and instructions…' : 'Write your announcement…'} placeholderTextColor="#A0A8B8" multiline textAlignVertical="top" style={styles.composeInput} />
            <Pressable onPress={submitDraft} style={[styles.primaryButton, { backgroundColor: config.color }]}><Ionicons name="save-outline" size={18} color="#FFFFFF" /><Text style={styles.primaryButtonText}>Save demo draft</Text></Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}</Text>{subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}</View>;
}

function InfoRow({ title, detail, icon }: { title: string; detail: string; icon: IconName }) {
  return <View style={styles.infoRow}><View style={styles.infoIcon}><Ionicons name={icon} size={18} color="#6478E8" /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.helperText}>{detail}</Text></View><Ionicons name="chevron-forward" size={16} color="#A4ACBA" /></View>;
}

function ActionRow({ title, detail, icon, color, tint, button, onPress }: { title: string; detail: string; icon: IconName; color: string; tint: string; button: string; onPress: () => void }) {
  return <View style={styles.actionRow}><View style={[styles.infoIcon, { backgroundColor: tint }]}><Ionicons name={icon} size={19} color={color} /></View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.helperText}>{detail}</Text></View><Pressable onPress={onPress} style={[styles.actionChip, { backgroundColor: tint }]}><Text style={[styles.actionChipText, { color }]}>{button}</Text></Pressable></View>;
}

function PreferenceRow({ title, detail, enabled, onPress, color }: { title: string; detail: string; enabled: boolean; onPress: () => void; color: string }) {
  return <Pressable onPress={onPress} style={styles.preferenceRow}><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.helperText}>{detail}</Text></View><View style={[styles.switchTrack, enabled && { backgroundColor: color }]}><View style={[styles.switchThumb, enabled && styles.switchThumbOn]} /></View></Pressable>;
}

function ProgressMeterRow({ label, value, progress, color }: { label: string; value: string; progress: string; color: string }) {
  return (
    <View style={styles.progressRow}>
      <View style={styles.rowBetween}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: progress, backgroundColor: color }]} /></View>
    </View>
  );
}

const styles = {
  safe: { flex: 1, backgroundColor: '#F5F7FC' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 112 },
  header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  brandRow: { flexDirection: 'row' as const, alignItems: 'center' as const },
  brandMark: { width: 43, height: 43, borderRadius: 15, backgroundColor: '#202B49', alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 11 },
  brandLetter: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' as const },
  brandName: { color: '#202B49', fontSize: 17, fontWeight: '900' as const, letterSpacing: -0.4 },
  brandTag: { color: '#8992A6', fontSize: 7, fontWeight: '800' as const, letterSpacing: 1.5, marginTop: 2 },
  headerButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF4', alignItems: 'center' as const, justifyContent: 'center' as const },
  notificationDot: { position: 'absolute' as const, top: 9, right: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: '#E76C74' },
  welcomeRow: { flexDirection: 'row' as const, alignItems: 'center' as const, marginTop: 26 },
  greeting: { fontSize: 12, fontWeight: '700' as const, color: '#8992A6' },
  pageTitle: { marginTop: 3, fontSize: 25, fontWeight: '900' as const, letterSpacing: -0.8, color: '#202B49' },
  pageSubtitle: { marginTop: 5, color: '#8992A6', fontSize: 11, lineHeight: 17 },
  headerAvatar: { width: 49, height: 49, borderRadius: 18, alignItems: 'center' as const, justifyContent: 'center' as const },
  demoPill: { alignSelf: 'flex-start' as const, flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: '#FFFFFF', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 7, marginTop: 15, marginBottom: 19, borderWidth: 1, borderColor: '#E8ECF4' },
  demoDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#D99035', marginRight: 7 },
  demoPillText: { color: '#8992A6', fontSize: 8, fontWeight: '800' as const, letterSpacing: 0.8 },
  focusCard: { borderRadius: 24, padding: 18, backgroundColor: '#202B49', overflow: 'hidden' as const },
  rowBetween: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const },
  row: { flexDirection: 'row' as const, alignItems: 'center' as const },
  focusEyebrow: { color: '#B8C3E3', fontSize: 8, letterSpacing: 1.5, fontWeight: '900' as const },
  focusTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' as const, marginTop: 7 },
  focusCopy: { color: '#CDD5EA', fontSize: 10, lineHeight: 16, marginTop: 5 },
  focusIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#FFFFFF24' },
  focusAction: { flexDirection: 'row' as const, alignItems: 'center' as const, alignSelf: 'flex-start' as const, gap: 7, marginTop: 16, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 13, backgroundColor: '#FFFFFF20' },
  focusActionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' as const },
  statsGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'space-between' as const, marginTop: 13 },
  statCard: { width: '48.3%' as const, minHeight: 110, padding: 13, borderRadius: 19, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF4', marginBottom: 10 },
  statIcon: { width: 32, height: 32, borderRadius: 11, alignItems: 'center' as const, justifyContent: 'center' as const },
  statValue: { marginTop: 9, color: '#202B49', fontSize: 18, fontWeight: '900' as const },
  statLabel: { marginTop: 3, color: '#8992A6', fontSize: 9, fontWeight: '700' as const },
  sectionHeading: { marginTop: 13, marginBottom: 12 },
  sectionTitle: { color: '#202B49', fontSize: 17, fontWeight: '900' as const, letterSpacing: -0.3 },
  sectionSubtitle: { color: '#8992A6', fontSize: 10, lineHeight: 15, marginTop: 4 },
  panel: { padding: 14, backgroundColor: '#FFFFFF', borderRadius: 21, borderWidth: 1, borderColor: '#E8ECF4' },
  infoRow: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F0F2F6' },
  infoIcon: { width: 39, height: 39, borderRadius: 14, backgroundColor: '#EEF1FF', alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 11 },
  rowTitle: { color: '#202B49', fontSize: 11, fontWeight: '800' as const },
  helperText: { color: '#8992A6', fontSize: 9, lineHeight: 14, marginTop: 3 },
  childCard: { padding: 15, borderRadius: 22, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF4' },
  avatar: { width: 43, height: 43, borderRadius: 15, alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 10 },
  cardTitle: { color: '#202B49', fontSize: 13, fontWeight: '900' as const },
  linkButton: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 11, backgroundColor: '#F7F8FC' },
  linkText: { fontSize: 9, fontWeight: '900' as const },
  progressTrack: { height: 7, borderRadius: 6, backgroundColor: '#F0F1F6', marginTop: 15, overflow: 'hidden' as const },
  progressFill: { height: 7, borderRadius: 6 },
  wideAction: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 14, borderRadius: 17, marginTop: 12, gap: 10 },
  wideActionText: { flex: 1, fontSize: 11, fontWeight: '900' as const },
  rowScroll: { flexDirection: 'row' as const, gap: 8, marginBottom: 12 },
  classChip: { borderRadius: 14, borderWidth: 1, borderColor: '#E8ECF4', backgroundColor: '#FFFFFF', paddingHorizontal: 11, paddingVertical: 10 },
  classChipText: { color: '#69738A', fontSize: 9, fontWeight: '800' as const },
  countBadge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 11, fontSize: 10, fontWeight: '900' as const },
  sectionLabel: { color: '#8992A6', fontSize: 8, fontWeight: '900' as const, letterSpacing: 1.2, marginTop: 17, marginBottom: 4 },
  rosterRow: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F2F6' },
  miniAvatar: { width: 31, height: 31, borderRadius: 11, alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 9 },
  miniAvatarText: { color: '#52607C', fontSize: 9, fontWeight: '900' as const },
  rosterName: { flex: 1, color: '#202B49', fontSize: 10, fontWeight: '700' as const },
  presenceToggle: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, paddingHorizontal: 7, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F5F6F8' },
  presenceText: { color: '#8992A6', fontSize: 8, fontWeight: '800' as const },
  primaryButton: { height: 47, borderRadius: 15, marginTop: 14, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '900' as const },
  actionRow: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 12, backgroundColor: '#FFFFFF', borderRadius: 17, borderWidth: 1, borderColor: '#E8ECF4', marginBottom: 9 },
  actionChip: { borderRadius: 11, paddingHorizontal: 10, paddingVertical: 8, marginLeft: 7 },
  actionChipText: { fontSize: 9, fontWeight: '900' as const },
  metricLine: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F6' },
  metricLabel: { color: '#7C869A', fontSize: 10 },
  metricValue: { color: '#202B49', fontSize: 10, fontWeight: '900' as const },
  noteBanner: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, padding: 12, borderRadius: 14, marginBottom: 11 },
  noteText: { flex: 1, fontSize: 9, fontWeight: '700' as const, lineHeight: 14 },
  requestCard: { padding: 14, borderRadius: 19, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF4', marginBottom: 10 },
  tag: { borderRadius: 10, overflow: 'hidden' as const, paddingHorizontal: 8, paddingVertical: 6, fontSize: 8, fontWeight: '900' as const },
  smallButton: { marginTop: 14, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9, marginRight: 8 },
  smallButtonText: { color: '#FFFFFF', fontSize: 9, fontWeight: '900' as const },
  secondaryButton: { marginTop: 14, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: '#F4F5F8' },
  secondaryButtonText: { color: '#677187', fontSize: 9, fontWeight: '900' as const },
  updateIntro: { marginTop: 6, marginBottom: 12 },
  composeButton: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: 13, borderRadius: 16, gap: 9, marginBottom: 12 },
  composeText: { flex: 1, fontSize: 10, fontWeight: '900' as const },
  updateRow: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F6' },
  updateIcon: { width: 38, height: 38, borderRadius: 14, alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 10 },
  profileCard: { alignItems: 'center' as const, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, borderWidth: 1, borderColor: '#E8ECF4' },
  profileAvatar: { width: 66, height: 66, borderRadius: 23, alignItems: 'center' as const, justifyContent: 'center' as const },
  profileName: { color: '#202B49', fontSize: 16, fontWeight: '900' as const, marginTop: 12 },
  profileContext: { color: '#8992A6', fontSize: 9, marginTop: 5, textAlign: 'center' as const },
  roleBadge: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7, marginTop: 11 },
  roleBadgeText: { fontSize: 8, fontWeight: '900' as const, letterSpacing: 1 },
  preferenceRow: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: '#E8ECF4' },
  switchTrack: { width: 39, height: 23, borderRadius: 13, backgroundColor: '#D5D9E2', padding: 3, justifyContent: 'center' as const },
  switchThumb: { width: 17, height: 17, borderRadius: 9, backgroundColor: '#FFFFFF' },
  switchThumbOn: { alignSelf: 'flex-end' as const },
  signOutButton: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, paddingVertical: 14, marginTop: 9 },
  signOutText: { color: '#D85C65', fontSize: 10, fontWeight: '900' as const },
  demoFootnote: { color: '#A0A8B8', fontSize: 9, lineHeight: 14, textAlign: 'center' as const, marginHorizontal: 14, marginTop: 4 },
  progressRow: { marginTop: 16 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end' as const },
  modalScrim: { position: 'absolute' as const, top: 0, right: 0, bottom: 0, left: 0, backgroundColor: '#111A3566' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  modalHandle: { alignSelf: 'center' as const, width: 38, height: 4, borderRadius: 3, backgroundColor: '#DCE0E8', marginBottom: 17 },
  modalTitle: { color: '#202B49', fontSize: 17, fontWeight: '900' as const },
  closeButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#F5F6F9', alignItems: 'center' as const, justifyContent: 'center' as const },
  composeInput: { minHeight: 122, maxHeight: 190, borderWidth: 1, borderColor: '#E8ECF4', borderRadius: 17, padding: 13, marginTop: 18, color: '#202B49', fontSize: 12, lineHeight: 19 },
};
