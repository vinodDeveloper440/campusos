import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;
type FacultySection = "home" | "classes" | "tasks" | "updates" | "profile";
type FacultyFeature =
  | "timetable"
  | "attendance"
  | "assignments"
  | "create-assignment"
  | "materials"
  | "marks"
  | "students"
  | "announcements"
  | "leave-request"
  | "exams"
  | "performance"
  | "reports"
  | "notifications"
  | "subjects"
  | "tasks"
  | "attendance-history"
  | "attendance-reports";

const C = {
  navy: "#202B49",
  blue: "#6478E8",
  bg: "#F5F7FC",
  white: "#FFFFFF",
  muted: "#8992A6",
  border: "#E8ECF4",
  green: "#259B78",
  orange: "#D99035",
  red: "#DC626B",
  paleBlue: "#EEF1FF",
  paleGreen: "#EAF8F1",
  paleOrange: "#FFF5E8",
  palePurple: "#F3EFFF",
};

const schedule = [
  {
    time: "09:00 – 10:00 AM",
    subject: "Data Structures",
    section: "CSE 3A",
    room: "Block B · Room 204",
    status: "Completed",
    color: C.green,
    tint: C.paleGreen,
  },
  {
    time: "10:00 – 11:00 AM",
    subject: "Java Programming",
    section: "CSE 3B",
    room: "Block A · Room 102",
    status: "Ongoing",
    color: C.blue,
    tint: C.paleBlue,
  },
  {
    time: "11:15 AM – 12:15 PM",
    subject: "Database Management Systems",
    section: "CSE 3A",
    room: "Block B · Room 205",
    status: "Upcoming",
    color: C.orange,
    tint: C.paleOrange,
  },
  {
    time: "01:30 – 02:30 PM",
    subject: "Computer Networks",
    section: "CSE 3B",
    room: "Block A · Room 103",
    status: "Upcoming",
    color: C.orange,
    tint: C.paleOrange,
  },
  {
    time: "02:30 – 03:30 PM",
    subject: "Data Structures Lab",
    section: "CSE 3A",
    room: "Computer Lab 2",
    status: "Upcoming",
    color: C.orange,
    tint: C.paleOrange,
  },
];

const subjects = [
  {
    name: "Data Structures",
    code: "CS301",
    semester: "Semester 3",
    section: "CSE 3A",
    students: 32,
    progress: 72,
    icon: "git-branch-outline" as IconName,
    tint: C.paleBlue,
    color: C.blue,
  },
  {
    name: "Java Programming",
    code: "CS501",
    semester: "Semester 5",
    section: "CSE 3B",
    students: 30,
    progress: 64,
    icon: "code-slash-outline" as IconName,
    tint: C.palePurple,
    color: "#8567CE",
  },
  {
    name: "Database Management Systems",
    code: "CS502",
    semester: "Semester 5",
    section: "CSE 3A",
    students: 32,
    progress: 81,
    icon: "server-outline" as IconName,
    tint: C.paleGreen,
    color: C.green,
  },
  {
    name: "Computer Networks",
    code: "CS503",
    semester: "Semester 5",
    section: "CSE 3B",
    students: 26,
    progress: 58,
    icon: "globe-outline" as IconName,
    tint: C.paleOrange,
    color: C.orange,
  },
];

const tasks = [
  {
    title: "Evaluate Java Programming Assignments",
    detail: "12 submissions · Java Programming",
    due: "Due today",
    priority: "High",
    icon: "document-text-outline" as IconName,
  },
  {
    title: "Complete Internal Assessment Marks",
    detail: "CSE 3A · Data Structures",
    due: "Due Nov 14",
    priority: "High",
    icon: "create-outline" as IconName,
  },
  {
    title: "Upload Unit 4 Study Materials",
    detail: "Computer Networks · Semester 5",
    due: "Due Nov 16",
    priority: "Medium",
    icon: "cloud-upload-outline" as IconName,
  },
  {
    title: "Submit Monthly Attendance Report",
    detail: "November · All assigned sections",
    due: "Due Nov 20",
    priority: "Medium",
    icon: "calendar-outline" as IconName,
  },
  {
    title: "Complete Data Structures Syllabus",
    detail: "Unit 5 · Trees and graphs",
    due: "Due Nov 24",
    priority: "Low",
    icon: "book-outline" as IconName,
  },
];

const assignments = [
  {
    title: "Java OOP Concepts",
    subject: "Java Programming",
    submitted: 26,
    total: 30,
    due: "Nov 12",
  },
  {
    title: "Data Structures Trees",
    subject: "Data Structures",
    submitted: 28,
    total: 32,
    due: "Nov 15",
  },
  {
    title: "DBMS SQL Queries",
    subject: "Database Management Systems",
    submitted: 22,
    total: 32,
    due: "Nov 18",
  },
  {
    title: "Computer Networks Assignment",
    subject: "Computer Networks",
    submitted: 18,
    total: 26,
    due: "Nov 21",
  },
];

const notices = [
  {
    title: "HOD requested internal marks submission",
    detail: "Academic Office · 10 min ago",
    icon: "clipboard-outline" as IconName,
    unread: true,
  },
  {
    title: "Timetable updated for Semester 5",
    detail: "Timetable Office · 1 hour ago",
    icon: "calendar-outline" as IconName,
    unread: true,
  },
  {
    title: "Department meeting scheduled",
    detail: "CSE Department · Yesterday",
    icon: "people-outline" as IconName,
    unread: false,
  },
  {
    title: "Assignment evaluation deadline approaching",
    detail: "Academic Office · Yesterday",
    icon: "time-outline" as IconName,
    unread: false,
  },
  {
    title: "New academic announcement received",
    detail: "Campus Administration · Nov 9",
    icon: "megaphone-outline" as IconName,
    unread: false,
  },
];

function goFeature(screen: FacultyFeature) {
  router.navigate(`/faculty/${screen}` as never);
}

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
    <View style={s.sectionHeading}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={s.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {action && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={s.textAction}
        >
          <Text style={s.textActionLabel}>{action}</Text>
          <Ionicons name="chevron-forward" size={15} color={C.blue} />
        </Pressable>
      ) : null}
    </View>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[s.card, style]}>{children}</View>;
}

function ProgressBar({
  value,
  color = C.blue,
}: {
  value: number;
  color?: string;
}) {
  return (
    <View style={s.progressTrack}>
      <View
        style={[
          s.progressFill,
          {
            width: `${Math.max(0, Math.min(100, value))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function Header() {
  return (
    <View style={s.header}>
      <LinearGradient
        colors={["#263653", "#536B9A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.brandMark}
      >
        <Text style={s.brandLetter}>C</Text>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={s.brandEyebrow}>CAMPUSOS</Text>
        <Text style={s.brandTitle}>Faculty Portal</Text>
      </View>
      <Pressable
        accessibilityLabel="Open notifications"
        accessibilityRole="button"
        onPress={() => goFeature("notifications")}
        style={s.iconButton}
      >
        <Ionicons name="notifications-outline" size={21} color={C.navy} />
        <View style={s.notificationBadge}>
          <Text style={s.notificationBadgeText}>2</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel="Open faculty profile"
        accessibilityRole="button"
        onPress={() => router.navigate("/faculty/profile" as never)}
        style={s.profileButton}
      >
        <Ionicons name="person-outline" size={21} color={C.blue} />
      </Pressable>
    </View>
  );
}

const pageCopy: Record<Exclude<FacultySection, "home">, { title: string; subtitle: string }> = {
  classes: { title: "My classes", subtitle: "Your courses, students and teaching schedule" },
  tasks: { title: "Tasks & assignments", subtitle: "Keep your teaching work moving forward" },
  updates: { title: "Notifications", subtitle: "Recent updates from your department" },
  profile: { title: "My profile", subtitle: "Your faculty details and preferences" },
};

function PageIntro({ section }: { section: Exclude<FacultySection, "home"> }) {
  return (
    <View style={s.pageIntro}>
      <Text style={s.pageIntroTitle}>{pageCopy[section].title}</Text>
      <Text style={s.pageIntroSubtitle}>{pageCopy[section].subtitle}</Text>
    </View>
  );
}

function DatePill() {
  const today = new Date();
  const date = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return (
    <View style={s.datePill}>
      <Ionicons name="calendar-clear-outline" size={14} color={C.blue} />
      <Text style={s.dateText}>{date} · Semester 5</Text>
    </View>
  );
}

function WelcomeHero() {
  return (
    <LinearGradient
      colors={["#E8EDFF", "#F2F4FF", "#EEF5FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.welcomeHero}
    >
      <View style={s.welcomeHeroTop}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <DatePill />
          <Text style={s.welcomeTitle}>Good morning, Faculty 👋</Text>
          <Text style={s.welcomeName}>Dr. Vinod Kumar</Text>
          <Text style={s.welcomeSubtitle}>Assistant Professor · Computer Science and Engineering</Text>
        </View>
        <View style={s.welcomeAvatar}>
          <Text style={s.welcomeAvatarText}>VK</Text>
        </View>
      </View>
      <View style={s.welcomeDetails}>
        <View style={s.welcomeDetail}>
          <Ionicons name="id-card-outline" size={15} color={C.blue} />
          <View style={{ marginLeft: 7 }}>
            <Text style={s.welcomeDetailLabel}>EMPLOYEE ID</Text>
            <Text style={s.welcomeDetailValue}>FAC2026001</Text>
          </View>
        </View>
        <View style={s.welcomeDivider} />
        <View style={s.welcomeDetail}>
          <Ionicons name="layers-outline" size={15} color={C.blue} />
          <View style={{ marginLeft: 7 }}>
            <Text style={s.welcomeDetailLabel}>ACADEMIC TERM</Text>
            <Text style={s.welcomeDetailValue}>Semester 5 · 2026–27</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

function QuickAccess() {
  return (
    <>
      <SectionTitle title="Quick access" subtitle="Your frequently used faculty tools" />
      <Card style={s.quickGrid}>
        {quickActions.map((action) => (
          <QuickAction
            key={action.title}
            {...action}
            onPress={() => goFeature(action.screen)}
          />
        ))}
      </Card>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tint,
  color,
  onPress,
}: {
  label: string;
  value: string;
  icon: IconName;
  tint: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.statCard}>
      <View style={[s.statIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Pressable>
  );
}

function ScheduleList({ compact = false }: { compact?: boolean }) {
  const items = compact ? schedule.slice(0, 3) : schedule;
  return (
    <LinearGradient
      colors={["#E7EDFF", "#F4F6FF", "#EDF4FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.scheduleShell}
    >
      <View style={s.scheduleInner}>
        {items.map((item, index) => (
          <Pressable
            key={item.subject}
            onPress={() => goFeature("timetable")}
            style={[
              s.scheduleRow,
              index === items.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={s.scheduleTime}>
              <Text style={s.scheduleTimeText}>{item.time.split(" – ")[0]}</Text>
              <Text style={s.scheduleTimeSub}>{item.time.split(" – ")[1]}</Text>
            </View>
            <View style={[s.timelineDot, { backgroundColor: item.color }]} />
            <View style={{ flex: 1, paddingHorizontal: 11 }}>
              <Text style={s.rowTitle}>{item.subject}</Text>
              <Text style={s.rowSub}>{item.section} · {item.room}</Text>
            </View>
            <View style={[s.statusPill, { backgroundColor: item.tint }]}>
              <Text style={[s.statusText, { color: item.color }]}>
                {item.status}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </LinearGradient>
  );
}

function SubjectCard({
  item,
  onPress,
}: {
  item: (typeof subjects)[number];
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={s.subjectCard}
    >
      <View style={s.subjectTop}>
        <View style={[s.subjectIcon, { backgroundColor: item.tint }]}>
          <Ionicons name={item.icon} size={19} color={item.color} />
        </View>
        <Text style={s.subjectCode}>{item.code}</Text>
      </View>
      <Text style={s.subjectName}>{item.name}</Text>
      <Text style={s.rowSub}>
        {item.semester} · {item.section}
      </Text>
      <View style={s.subjectMeta}>
        <Text style={s.rowSub}>{item.students} students</Text>
        <Text style={[s.rowSub, { color: item.color, fontWeight: "800" }]}>
          {item.progress}% complete
        </Text>
      </View>
      <ProgressBar value={item.progress} color={item.color} />
    </Pressable>
  );
}

function TaskRow({
  item,
  done,
  onPress,
}: {
  item: (typeof tasks)[number];
  done?: boolean;
  onPress?: () => void;
}) {
  const priorityColor =
    item.priority === "High"
      ? C.red
      : item.priority === "Medium"
        ? C.orange
        : C.green;
  const priorityTint =
    item.priority === "High"
      ? "#FFF0F1"
      : item.priority === "Medium"
        ? C.paleOrange
        : C.paleGreen;
  return (
    <Pressable onPress={onPress} style={s.taskRow}>
      <View style={[s.infoIcon, { backgroundColor: priorityTint }]}>
        <Ionicons
          name={done ? "checkmark-circle" : item.icon}
          size={18}
          color={done ? C.green : priorityColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            s.rowTitle,
            done && { textDecorationLine: "line-through", color: C.muted },
          ]}
        >
          {item.title}
        </Text>
        <Text style={s.rowSub}>{item.detail}</Text>
        <Text style={[s.taskDue, { color: priorityColor }]}>
          {done ? "Completed" : `${item.due}  ·  ${item.priority} priority`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#AAB2C1" />
    </Pressable>
  );
}

function AssignmentCard({ item }: { item: (typeof assignments)[number] }) {
  const percent = Math.round((item.submitted / item.total) * 100);
  return (
    <View style={s.assignmentRow}>
      <View style={s.rowBetween}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={s.rowTitle}>{item.title}</Text>
          <Text style={s.rowSub}>
            {item.subject} · Due {item.due}
          </Text>
        </View>
        <Text style={s.assignmentCount}>
          {item.submitted}/{item.total}
        </Text>
      </View>
      <ProgressBar value={percent} color={C.blue} />
      <Text style={s.progressCaption}>
        {percent}% submitted · {item.total - item.submitted} to review
      </Text>
    </View>
  );
}

function NotificationRow({
  item,
  onPress,
}: {
  item: (typeof notices)[number];
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.noticeRow}>
      <View style={s.infoIcon}>
        <Ionicons name={item.icon} size={18} color={C.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{item.title}</Text>
        <Text style={s.rowSub}>{item.detail}</Text>
      </View>
      {item.unread ? (
        <View style={s.unreadDot} />
      ) : (
        <Ionicons name="chevron-forward" size={15} color="#AAB2C1" />
      )}
    </Pressable>
  );
}

function QuickAction({
  title,
  icon,
  tint,
  color,
  onPress,
}: {
  title: string;
  icon: IconName;
  tint: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={s.quickAction}
    >
      <View style={[s.quickIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={s.quickLabel}>{title}</Text>
    </Pressable>
  );
}

const quickActions: {
  title: string;
  icon: IconName;
  screen: FacultyFeature;
  tint: string;
  color: string;
}[] = [
  {
    title: "Mark attendance",
    icon: "checkmark-done-outline",
    screen: "attendance",
    tint: C.paleGreen,
    color: C.green,
  },
  {
    title: "Create assignment",
    icon: "document-text-outline",
    screen: "create-assignment",
    tint: C.paleBlue,
    color: C.blue,
  },
  {
    title: "Study materials",
    icon: "cloud-upload-outline",
    screen: "materials",
    tint: C.palePurple,
    color: "#8567CE",
  },
  {
    title: "Enter marks",
    icon: "create-outline",
    screen: "marks",
    tint: C.paleOrange,
    color: C.orange,
  },
  {
    title: "View students",
    icon: "people-outline",
    screen: "students",
    tint: C.paleBlue,
    color: C.blue,
  },
  {
    title: "Announcement",
    icon: "megaphone-outline",
    screen: "announcements",
    tint: C.paleGreen,
    color: C.green,
  },
  {
    title: "Apply for leave",
    icon: "airplane-outline",
    screen: "leave-request",
    tint: C.palePurple,
    color: "#8567CE",
  },
  {
    title: "View reports",
    icon: "pie-chart-outline",
    screen: "reports",
    tint: C.paleOrange,
    color: C.orange,
  },
];

function HomeContent() {
  return (
    <>
      <WelcomeHero />
      <QuickAccess />
      <View style={s.statsGrid}>
        <StatCard
          label="Total students"
          value="120"
          icon="people-outline"
          tint={C.paleBlue}
          color={C.blue}
          onPress={() => goFeature("students")}
        />
        <StatCard
          label="Assigned subjects"
          value="4"
          icon="book-outline"
          tint={C.palePurple}
          color="#8567CE"
          onPress={() => router.navigate("/faculty/classes" as never)}
        />
        <StatCard
          label="Today's classes"
          value="5"
          icon="calendar-outline"
          tint={C.paleGreen}
          color={C.green}
          onPress={() => goFeature("timetable")}
        />
        <StatCard
          label="Pending evaluations"
          value="8"
          icon="clipboard-outline"
          tint={C.paleOrange}
          color={C.orange}
          onPress={() => goFeature("assignments")}
        />
      </View>
      <SectionTitle
        title="Today's schedule"
        subtitle="Your teaching plan for today"
        action="Full timetable"
        onAction={() => goFeature("timetable")}
      />
      <ScheduleList compact />
      <SectionTitle
        title="Attendance overview"
        subtitle="Your assigned classes this month"
        action="View reports"
        onAction={() => goFeature("attendance-reports")}
      />
      <Card>
        <View style={s.attendanceTop}>
          <View>
            <Text style={s.metricLabel}>Class attendance average</Text>
            <Text style={s.attendancePercent}>
              88<Text style={s.percentSign}>%</Text>
            </Text>
          </View>
          <View style={s.attendanceCircle}>
            <Ionicons name="checkmark-done" size={25} color={C.green} />
            <Text style={s.circleLabel}>On track</Text>
          </View>
        </View>
        <View style={s.attendanceMetrics}>
          <Metric label="Conducted" value="48" />
          <Metric label="Completed" value="42" />
          <Metric label="Pending" value="6" />
        </View>
        <ProgressBar value={88} color={C.green} />
        <View style={s.inlineActions}>
          <SmallAction
            title="Mark attendance"
            icon="checkmark-circle-outline"
            onPress={() => goFeature("attendance")}
          />
          <SmallAction
            title="History"
            icon="time-outline"
            onPress={() => goFeature("attendance-history")}
          />
          <SmallAction
            title="Reports"
            icon="bar-chart-outline"
            onPress={() => goFeature("attendance-reports")}
          />
        </View>
      </Card>
      <SectionTitle
        title="My subjects"
        subtitle="Four active courses this semester"
        action="All subjects"
        onAction={() => router.navigate("/faculty/classes" as never)}
      />
      <View style={s.subjectGrid}>
        {subjects.slice(0, 2).map((item) => (
          <SubjectCard
            key={item.code}
            item={item}
            onPress={() => goFeature("subjects")}
          />
        ))}
      </View>
      <SectionTitle
        title="Pending academic tasks"
        subtitle="Keep your next deadlines in view"
        action="All tasks"
        onAction={() => router.navigate("/faculty/tasks" as never)}
      />
      <Card style={{ paddingVertical: 3 }}>
        {tasks.slice(0, 3).map((item) => (
          <TaskRow
            key={item.title}
            item={item}
            onPress={() => router.navigate("/faculty/tasks" as never)}
          />
        ))}
      </Card>
      <SectionTitle
        title="Assignment overview"
        subtitle="12 total · 8 published · 8 evaluations pending"
        action="View all"
        onAction={() => goFeature("assignments")}
      />
      <Card>
        <View style={s.assignmentSummary}>
          <SummaryMetric label="Assignments" value="12" tint={C.paleBlue} />
          <SummaryMetric label="Published" value="8" tint={C.paleGreen} />
          <SummaryMetric label="Evaluated" value="24" tint={C.palePurple} />
        </View>
        <AssignmentCard item={assignments[0]} />
        <Pressable
          onPress={() => goFeature("create-assignment")}
          style={s.outlineButton}
        >
          <Ionicons name="add" size={17} color={C.blue} />
          <Text style={s.outlineButtonText}>Create assignment</Text>
        </Pressable>
      </Card>
      <SectionTitle
        title="Student performance"
        subtitle="Class average is 82% across your subjects"
        action="Full report"
        onAction={() => goFeature("performance")}
      />
      <Card>
        <View style={s.chartLegend}>
          <View style={s.legendDot} />
          <Text style={s.rowSub}>Average score</Text>
          <Text style={s.chartAverage}>82% class average</Text>
        </View>
        {subjects.map((item) => (
          <View key={item.code} style={s.chartRow}>
            <Text style={s.chartLabel}>
              {item.name
                .replace(" Management Systems", "")
                .replace(" Programming", "")}
            </Text>
            <View style={s.chartTrack}>
              <View
                style={[
                  s.chartFill,
                  {
                    width: `${item.code === "CS301" ? 82 : item.code === "CS501" ? 88 : item.code === "CS502" ? 76 : 85}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={s.chartValue}>
              {item.code === "CS301"
                ? 82
                : item.code === "CS501"
                  ? 88
                  : item.code === "CS502"
                    ? 76
                    : 85}
              %
            </Text>
          </View>
        ))}
        <View style={s.insightNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={C.blue}
          />
          <Text style={s.insightText}>
            6 students may benefit from additional support this week.
          </Text>
        </View>
      </Card>
      <SectionTitle
        title="Upcoming examinations"
        subtitle="Plan ahead for your classes"
        action="All exams"
        onAction={() => goFeature("exams")}
      />
      <Card style={{ paddingVertical: 3 }}>
        {[
          {
            subject: "Java Programming",
            type: "Internal Assessment 2",
            date: "18 Nov",
          },
          {
            subject: "Data Structures",
            type: "Internal Assessment 2",
            date: "20 Nov",
          },
          { subject: "DBMS", type: "Practical Examination", date: "22 Nov" },
        ].map((exam) => (
          <Pressable
            key={exam.subject}
            onPress={() => goFeature("exams")}
            style={s.examRow}
          >
            <View style={s.examDate}>
              <Text style={s.examDay}>{exam.date.split(" ")[0]}</Text>
              <Text style={s.examMonth}>{exam.date.split(" ")[1]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{exam.subject}</Text>
              <Text style={s.rowSub}>{exam.type} · CSE 3</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#AAB2C1" />
          </Pressable>
        ))}
      </Card>
      <SectionTitle
        title="Recent notifications"
        subtitle="Updates from your department"
        action="View all"
        onAction={() => goFeature("notifications")}
      />
      <Card style={{ paddingVertical: 3 }}>
        {notices.slice(0, 3).map((item) => (
          <NotificationRow
            key={item.title}
            item={item}
            onPress={() => goFeature("notifications")}
          />
        ))}
      </Card>
      <Text style={s.demoNote}>
        Demo workspace · Changes are saved on this device only
      </Text>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.metric}>
      <Text style={s.metricValue}>{value}</Text>
      <Text style={s.metricLabel}>{label}</Text>
    </View>
  );
}
function SummaryMetric({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={[s.summaryMetric, { backgroundColor: tint }]}>
      <Text style={s.summaryValue}>{value}</Text>
      <Text style={s.summaryLabel}>{label}</Text>
    </View>
  );
}
function SmallAction({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: IconName;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.smallAction}>
      <Ionicons name={icon} size={15} color={C.blue} />
      <Text style={s.smallActionText}>{title}</Text>
    </Pressable>
  );
}

function ClassesContent() {
  return (
    <>
      <View style={s.semesterBanner}>
        <View style={s.bannerIcon}>
          <Ionicons name="school-outline" size={22} color={C.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.bannerTitle}>Semester 5 · 2026–27</Text>
          <Text style={s.rowSub}>Computer Science and Engineering</Text>
        </View>
        <Text style={s.bannerCount}>4 courses</Text>
      </View>
      <SectionTitle
        title="Assigned subjects"
        subtitle="Course progress and sections"
      />
      {subjects.map((item) => (
        <SubjectCard
          key={item.code}
          item={item}
          onPress={() => goFeature("subjects")}
        />
      ))}
      <SectionTitle
        title="Today's classes"
        subtitle="Tap to view the full timetable"
        action="Timetable"
        onAction={() => goFeature("timetable")}
      />
      <ScheduleList />
      <Pressable onPress={() => goFeature("students")} style={s.primaryWide}>
        <Ionicons name="people-outline" size={18} color={C.white} />
        <Text style={s.primaryWideText}>View all 120 students</Text>
        <Ionicons name="arrow-forward" size={17} color={C.white} />
      </Pressable>
    </>
  );
}

function TasksContent() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const visibleTasks = tasks.filter(
    (task) =>
      filter === "All" ||
      (filter === "Completed" ? done[task.title] : !done[task.title]),
  );
  const toggle = (title: string) =>
    setDone((state) => ({ ...state, [title]: !state[title] }));
  return (
    <>
      <LinearGradient
        colors={["#E8EDFF", "#F2F4FF", "#EEF5FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.taskHero}
      >
        <Text style={s.taskHeroEyebrow}>THIS WEEK</Text>
        <Text style={s.taskHeroTitle}>5 items need your attention</Text>
        <Text style={s.taskHeroText}>
          You have 2 high priority deadlines coming up.
        </Text>
      </LinearGradient>
      <View style={s.filterRow}>
        {(["All", "Pending", "Completed"] as const).map((value) => (
          <Pressable
            key={value}
            onPress={() => setFilter(value)}
            style={[s.filterChip, filter === value && s.filterChipActive]}
          >
            <Text
              style={[s.filterText, filter === value && s.filterTextActive]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
      {visibleTasks.map((item) => (
        <Card key={item.title} style={{ paddingVertical: 3 }}>
          <TaskRow
            item={item}
            done={!!done[item.title]}
            onPress={() => toggle(item.title)}
          />
          <Pressable
            onPress={() => toggle(item.title)}
            style={s.taskCompleteAction}
          >
            <Ionicons
              name={done[item.title] ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={done[item.title] ? C.green : C.blue}
            />
            <Text
              style={[
                s.taskCompleteText,
                done[item.title] && { color: C.green },
              ]}
            >
              {done[item.title] ? "Mark as pending" : "Mark complete"}
            </Text>
          </Pressable>
        </Card>
      ))}
      {visibleTasks.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          detail="Tasks matching this filter will appear here."
        />
      ) : null}
      <SectionTitle
        title="Assignment evaluations"
        subtitle="8 submissions still need review"
        action="Open assignments"
        onAction={() => goFeature("assignments")}
      />
      <Card>
        <View style={s.assignmentSummary}>
          <SummaryMetric label="Published" value="8" tint={C.paleBlue} />
          <SummaryMetric label="To review" value="8" tint={C.paleOrange} />
          <SummaryMetric label="Completed" value="24" tint={C.paleGreen} />
        </View>
        {assignments.slice(0, 2).map((item) => (
          <AssignmentCard key={item.title} item={item} />
        ))}
        <Pressable
          onPress={() => goFeature("assignments")}
          style={s.primaryButton}
        >
          <Text style={s.primaryButtonText}>Review submissions</Text>
          <Ionicons name="arrow-forward" size={16} color={C.white} />
        </Pressable>
      </Card>
    </>
  );
}

function UpdatesContent() {
  const [read, setRead] = useState<Record<string, boolean>>({});
  return (
    <>
      <View style={s.notificationHero}>
        <View style={s.notificationHeroIcon}>
          <Ionicons name="notifications" size={22} color={C.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.bannerTitle}>You&apos;re all caught up soon</Text>
          <Text style={s.rowSub}>2 unread notifications</Text>
        </View>
        <Pressable
          onPress={() =>
            setRead(
              Object.fromEntries(notices.map((item) => [item.title, true])),
            )
          }
        >
          <Text style={s.textActionLabel}>Read all</Text>
        </Pressable>
      </View>
      <SectionTitle title="Today" subtitle="Important updates for you" />
      <Card style={{ paddingVertical: 3 }}>
        {notices.map((item) => (
          <NotificationRow
            key={item.title}
            item={{ ...item, unread: item.unread && !read[item.title] }}
            onPress={() =>
              setRead((current) => ({ ...current, [item.title]: true }))
            }
          />
        ))}
      </Card>
      <Pressable
        onPress={() => goFeature("announcements")}
        style={s.outlineButton}
      >
        <Ionicons name="megaphone-outline" size={17} color={C.blue} />
        <Text style={s.outlineButtonText}>Send an announcement</Text>
      </Pressable>
    </>
  );
}

function ProfileContent() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  return (
    <>
      <Card style={s.profileCard}>
        <View style={s.profileAvatar}>
          <Text style={s.profileAvatarText}>VK</Text>
        </View>
        <Text style={s.profileName}>Dr. Vinod Kumar</Text>
        <Text style={s.rowSub}>Assistant Professor</Text>
        <View style={s.profilePill}>
          <Text style={s.profilePillText}>FAC2026001</Text>
        </View>
        <Text style={[s.rowSub, { textAlign: "center", marginTop: 9 }]}>
          Computer Science and Engineering · Greenfield College
        </Text>
      </Card>
      <SectionTitle title="Faculty details" />
      <Card>
        {[
          ["Department", "Computer Science and Engineering"],
          ["Employee ID", "FAC2026001"],
          ["Academic year", "2026–27"],
          ["Semester", "Semester 5"],
        ].map(([label, value]) => (
          <View key={label} style={s.profileDetail}>
            <Text style={s.metricLabel}>{label}</Text>
            <Text style={s.profileDetailValue}>{value}</Text>
          </View>
        ))}
      </Card>
      <SectionTitle title="Preferences" />
      <Card>
        {[
          [
            "Push notifications",
            pushEnabled,
            () => setPushEnabled(!pushEnabled),
          ],
          ["Email updates", emailEnabled, () => setEmailEnabled(!emailEnabled)],
        ].map(([label, enabled, toggle]) => (
          <Pressable
            key={String(label)}
            onPress={toggle as () => void}
            style={s.preferenceRow}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{label as string}</Text>
              <Text style={s.rowSub}>Receive faculty workspace updates</Text>
            </View>
            <View style={[s.switchTrack, enabled && s.switchTrackOn]}>
              <View style={[s.switchThumb, enabled && s.switchThumbOn]} />
            </View>
          </Pressable>
        ))}
      </Card>
      <Pressable
        onPress={() =>
          Alert.alert(
            "Demo profile",
            "Profile settings are available in this demo workspace.",
          )
        }
        style={s.outlineButton}
      >
        <Ionicons name="settings-outline" size={17} color={C.blue} />
        <Text style={s.outlineButtonText}>Account settings</Text>
      </Pressable>
    </>
  );
}

export function FacultyPortal({ section }: { section: FacultySection }) {
  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        {section === "home" ? null : <PageIntro section={section} />}
        {section === "home" ? (
          <HomeContent />
        ) : section === "classes" ? (
          <ClassesContent />
        ) : section === "tasks" ? (
          <TasksContent />
        ) : section === "updates" ? (
          <UpdatesContent />
        ) : (
          <ProfileContent />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const students = [
  "Aarav Nair",
  "Ananya Shah",
  "Dev Patel",
  "Ishita Rao",
  "Kabir Mehta",
  "Mira Joseph",
  "Rohan Das",
  "Sara Khan",
];
const examItems = [
  {
    subject: "Java Programming",
    type: "Internal Assessment 2",
    date: "18 November",
    section: "CSE 3B",
  },
  {
    subject: "Data Structures",
    type: "Internal Assessment 2",
    date: "20 November",
    section: "CSE 3A",
  },
  {
    subject: "Database Management Systems",
    type: "Practical Examination",
    date: "22 November",
    section: "CSE 3A",
  },
];

const featureInfo: Record<
  string,
  { title: string; subtitle: string; icon: IconName }
> = {
  timetable: {
    title: "Full timetable",
    subtitle: "Your teaching schedule for Wednesday, November 11",
    icon: "calendar-outline",
  },
  attendance: {
    title: "Mark attendance",
    subtitle: "Data Structures · CSE 3A · 09:00 AM",
    icon: "checkmark-done-outline",
  },
  "attendance-history": {
    title: "Attendance history",
    subtitle: "Recent class records across your sections",
    icon: "time-outline",
  },
  "attendance-reports": {
    title: "Attendance reports",
    subtitle: "A summary of attendance for your classes",
    icon: "pie-chart-outline",
  },
  subjects: {
    title: "My subjects",
    subtitle: "Course information and syllabus progress",
    icon: "book-outline",
  },
  tasks: {
    title: "Academic tasks",
    subtitle: "Deadlines and follow-ups in one place",
    icon: "checkbox-outline",
  },
  assignments: {
    title: "Assignments",
    subtitle: "Review submissions and track progress",
    icon: "document-text-outline",
  },
  "create-assignment": {
    title: "Create assignment",
    subtitle: "Share a new assignment with your students",
    icon: "add-circle-outline",
  },
  materials: {
    title: "Study materials",
    subtitle: "Share learning resources with your classes",
    icon: "cloud-upload-outline",
  },
  marks: {
    title: "Enter marks",
    subtitle: "Internal assessment · CSE 3A",
    icon: "create-outline",
  },
  students: {
    title: "My students",
    subtitle: "120 students across 4 assigned sections",
    icon: "people-outline",
  },
  announcements: {
    title: "Send announcement",
    subtitle: "Share an update with your assigned classes",
    icon: "megaphone-outline",
  },
  "leave-request": {
    title: "Apply for leave",
    subtitle: "Submit a leave request to your HOD",
    icon: "airplane-outline",
  },
  performance: {
    title: "Performance insights",
    subtitle: "Subject averages and student support signals",
    icon: "bar-chart-outline",
  },
  reports: {
    title: "Faculty reports",
    subtitle: "Attendance and academic performance",
    icon: "pie-chart-outline",
  },
  exams: {
    title: "Upcoming examinations",
    subtitle: "Exam dates for your assigned classes",
    icon: "school-outline",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Updates from your department and campus",
    icon: "notifications-outline",
  },
};

function FeatureHeader({
  screen,
  title,
  subtitle,
  icon,
}: {
  screen: string;
  title: string;
  subtitle: string;
  icon: IconName;
}) {
  return (
    <View style={s.featureHeader}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={s.backButton}
      >
        <Ionicons name="arrow-back" size={20} color={C.navy} />
      </Pressable>
      <LinearGradient
        colors={["#E8EDFF", "#F2F4FF", "#EEF5FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.featureHero}
      >
        <View style={s.featureHeroTop}>
          <View style={s.featureIcon}>
            <Ionicons name={icon} size={23} color={C.blue} />
          </View>
          <View style={s.featureDemo}>
            <View style={s.demoDot} />
            <Text style={s.demoPillText}>FACULTY · {screen.replace(/-/g, " ").toUpperCase()}</Text>
          </View>
        </View>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </View>
  );
}

function FeatureAction({
  title,
  icon,
  onPress,
  secondary = false,
}: {
  title: string;
  icon: IconName;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.primaryButton, secondary && s.secondaryButton]}
    >
      <Ionicons name={icon} size={17} color={secondary ? C.blue : C.white} />
      <Text style={[s.primaryButtonText, secondary && { color: C.blue }]}>
        {title}
      </Text>
    </Pressable>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <Card style={s.emptyState}>
      <View style={s.emptyIcon}>
        <Ionicons name="file-tray-outline" size={25} color={C.blue} />
      </View>
      <Text style={s.rowTitle}>{title}</Text>
      <Text style={s.rowSub}>{detail}</Text>
    </Card>
  );
}

export function FacultyFeatureScreen({ screen }: { screen: string }) {
  const info = featureInfo[screen];
  const [present, setPresent] = useState<Record<string, boolean>>({});
  const [complete, setComplete] = useState<Record<string, boolean>>({});
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [period, setPeriod] = useState("This month");
  const [draft, setDraft] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const rosterPresent = students.reduce(
    (count, name) => count + ((present[name] ?? true) ? 1 : 0),
    0,
  );
  const visibleTasks = useMemo(
    () => tasks.filter((task) => !complete[task.title]),
    [complete],
  );

  const content = () => {
    if (screen === "timetable")
      return (
        <>
          <View style={s.semesterBanner}>
            <View style={s.bannerIcon}>
              <Ionicons name="calendar-outline" size={21} color={C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.bannerTitle}>Wednesday, November 11</Text>
              <Text style={s.rowSub}>5 classes · 4 hours 30 minutes</Text>
            </View>
            <Text style={s.bannerCount}>Today</Text>
          </View>
          <ScheduleList />
          <SectionTitle title="Tomorrow" subtitle="Thursday · 12 November" />
          <EmptyState
            title="No classes scheduled"
            detail="Your next teaching day is Friday, November 13."
          />
        </>
      );
    if (screen === "attendance")
      return (
        <>
          <Card>
            <View style={s.rowBetween}>
              <View>
                <Text style={s.rowTitle}>Data Structures</Text>
                <Text style={s.rowSub}>CSE 3A · Block B, Room 204</Text>
              </View>
              <View style={[s.statusPill, { backgroundColor: C.paleGreen }]}>
                <Text style={[s.statusText, { color: C.green }]}>
                  In progress
                </Text>
              </View>
            </View>
            <Text style={s.attendanceSession}>Today · 09:00 – 10:00 AM</Text>
            <View style={s.attendanceSummary}>
              <Text style={s.attendanceSummaryText}>
                Present{" "}
                <Text style={{ color: C.green, fontWeight: "900" }}>
                  {rosterPresent}
                </Text>{" "}
                / {students.length}
              </Text>
              <Text style={s.attendanceSummaryText}>
                {students.length - rosterPresent} absent
              </Text>
            </View>
          </Card>
          <SectionTitle
            title="Student roster"
            subtitle="Tap a student to change their attendance"
            action="Select all"
            onAction={() =>
              setPresent(
                Object.fromEntries(students.map((student) => [student, true])),
              )
            }
          />
          <Card style={{ paddingVertical: 3 }}>
            {students.map((name, index) => {
              const isPresent = present[name] ?? true;
              return (
                <Pressable
                  key={name}
                  onPress={() =>
                    setPresent((current) => ({
                      ...current,
                      [name]: !(current[name] ?? true),
                    }))
                  }
                  style={s.rosterRow}
                >
                  <View
                    style={[
                      s.miniAvatar,
                      {
                        backgroundColor:
                          index % 2 === 0 ? C.paleBlue : C.paleGreen,
                      },
                    ]}
                  >
                    <Text style={s.miniAvatarText}>
                      {name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowTitle}>{name}</Text>
                    <Text style={s.rowSub}>
                      CSE3A{String(index + 1).padStart(3, "0")}
                    </Text>
                  </View>
                  <View
                    style={[
                      s.attendanceToggle,
                      isPresent && s.attendanceToggleOn,
                    ]}
                  >
                    <Ionicons
                      name={isPresent ? "checkmark" : "close"}
                      size={14}
                      color={isPresent ? C.green : C.red}
                    />
                    <Text
                      style={[
                        s.attendanceToggleText,
                        { color: isPresent ? C.green : C.red },
                      ]}
                    >
                      {isPresent ? "Present" : "Absent"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Card>
          <FeatureAction
            title="Save attendance"
            icon="save-outline"
            onPress={() =>
              Alert.alert(
                "Attendance saved",
                `${rosterPresent} of ${students.length} students marked present. This demo is saved on this device.`,
              )
            }
          />
        </>
      );
    if (screen === "attendance-history")
      return (
        <>
          <View style={s.filterRow}>
            {["This week", "This month", "Semester"].map((value) => (
              <Pressable
                key={value}
                onPress={() => setPeriod(value)}
                style={[s.filterChip, period === value && s.filterChipActive]}
              >
                <Text
                  style={[s.filterText, period === value && s.filterTextActive]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </View>
          <Card>
            <Text style={s.metricLabel}>{period} summary</Text>
            <View style={s.attendanceTop}>
              <View>
                <Text style={s.attendancePercent}>
                  42<Text style={s.percentSign}>/48</Text>
                </Text>
                <Text style={s.rowSub}>Classes completed</Text>
              </View>
              <Text style={s.largeGreen}>88%</Text>
            </View>
            <ProgressBar value={88} color={C.green} />
            <Text style={s.rowSub}>6 classes are awaiting attendance</Text>
          </Card>
          <SectionTitle
            title="Recent records"
            subtitle="Latest sessions recorded"
          />
          <Card style={{ paddingVertical: 3 }}>
            {schedule.slice(0, 5).map((item, index) => (
              <View key={item.subject} style={s.historyRow}>
                <View
                  style={[
                    s.infoIcon,
                    {
                      backgroundColor: index === 1 ? C.paleOrange : C.paleGreen,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      index === 1 ? "time-outline" : "checkmark-circle-outline"
                    }
                    size={18}
                    color={index === 1 ? C.orange : C.green}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{item.subject}</Text>
                  <Text style={s.rowSub}>
                    {item.section} ·{" "}
                    {index === 1
                      ? "Nov 10 · Pending"
                      : `Nov ${10 - index} · Recorded`}
                  </Text>
                </View>
                <Text
                  style={[
                    s.historyCount,
                    { color: index === 1 ? C.orange : C.green },
                  ]}
                >
                  {index === 1 ? "Pending" : "32/32"}
                </Text>
              </View>
            ))}
          </Card>
          <FeatureAction
            title="Open attendance reports"
            icon="bar-chart-outline"
            secondary
            onPress={() => goFeature("attendance-reports")}
          />
        </>
      );
    if (screen === "attendance-reports" || screen === "reports")
      return (
        <>
          <View style={s.statsGrid}>
            <StatCard
              label="Average attendance"
              value="88%"
              icon="pie-chart-outline"
              tint={C.paleGreen}
              color={C.green}
            />
            <StatCard
              label="Sessions conducted"
              value="48"
              icon="calendar-outline"
              tint={C.paleBlue}
              color={C.blue}
            />
          </View>
          <Card>
            <SectionTitle
              title="Attendance by subject"
              subtitle="This semester"
            />
            {subjects.map((item, index) => (
              <View key={item.code} style={s.chartRow}>
                <Text style={s.chartLabel}>{item.name.split(" ")[0]}</Text>
                <View style={s.chartTrack}>
                  <View
                    style={[
                      s.chartFill,
                      {
                        width: `${[91, 86, 88, 84][index]}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={s.chartValue}>{[91, 86, 88, 84][index]}%</Text>
              </View>
            ))}
          </Card>
          <SectionTitle
            title="Class attendance"
            subtitle="Attendance and completion summary"
          />
          <Card>
            <View style={s.reportMetric}>
              <Text style={s.rowTitle}>Total classes conducted</Text>
              <Text style={s.metricValue}>48</Text>
            </View>
            <View style={s.reportMetric}>
              <Text style={s.rowTitle}>Attendance completed</Text>
              <Text style={[s.metricValue, { color: C.green }]}>42</Text>
            </View>
            <View style={s.reportMetric}>
              <Text style={s.rowTitle}>Attendance pending</Text>
              <Text style={[s.metricValue, { color: C.orange }]}>6</Text>
            </View>
            <View style={s.reportMetric}>
              <Text style={s.rowTitle}>Students below 75%</Text>
              <Text style={[s.metricValue, { color: C.red }]}>9</Text>
            </View>
          </Card>
          <FeatureAction
            title="Attendance history"
            icon="time-outline"
            secondary
            onPress={() => goFeature("attendance-history")}
          />
        </>
      );
    if (screen === "subjects")
      return (
        <>
          {subjects.map((item) => (
            <Card key={item.code}>
              <SubjectCard item={item} />
              <View style={s.subjectActions}>
                <SmallAction
                  title="View students"
                  icon="people-outline"
                  onPress={() => goFeature("students")}
                />
                <SmallAction
                  title="Syllabus"
                  icon="book-outline"
                  onPress={() =>
                    Alert.alert(
                      item.name,
                      `${item.progress}% of the syllabus is complete.`,
                    )
                  }
                />
              </View>
            </Card>
          ))}
        </>
      );
    if (screen === "tasks")
      return (
        <>
          {visibleTasks.map((item) => (
            <Card key={item.title} style={{ paddingVertical: 3 }}>
              <TaskRow
                item={item}
                onPress={() =>
                  setComplete((current) => ({ ...current, [item.title]: true }))
                }
              />
              <Pressable
                onPress={() =>
                  setComplete((current) => ({ ...current, [item.title]: true }))
                }
                style={s.taskCompleteAction}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={C.blue}
                />
                <Text style={s.taskCompleteText}>Mark complete</Text>
              </Pressable>
            </Card>
          ))}
          {visibleTasks.length === 0 ? (
            <EmptyState
              title="You're all caught up"
              detail="Completed tasks will stay out of your pending list."
            />
          ) : null}
          <SectionTitle
            title="Assignments to review"
            subtitle="12 assignments · 8 evaluations pending"
            action="View assignments"
            onAction={() => goFeature("assignments")}
          />
          <Card>
            {assignments.map((item) => (
              <AssignmentCard key={item.title} item={item} />
            ))}
          </Card>
        </>
      );
    if (screen === "assignments")
      return (
        <>
          <Card>
            <View style={s.assignmentSummary}>
              <SummaryMetric label="Total" value="12" tint={C.paleBlue} />
              <SummaryMetric label="Published" value="8" tint={C.paleGreen} />
              <SummaryMetric
                label="Pending review"
                value="8"
                tint={C.paleOrange}
              />
              <SummaryMetric label="Evaluated" value="24" tint={C.palePurple} />
            </View>
          </Card>
          <SectionTitle
            title="Recent assignments"
            subtitle="Submission progress by assignment"
          />
          {assignments.map((item) => (
            <Card key={item.title}>
              <AssignmentCard item={item} />
              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Review submissions",
                    `${item.total - item.submitted} submissions for ${item.title} are ready for review.`,
                  )
                }
                style={s.rowAction}
              >
                <Text style={s.textActionLabel}>Review submissions</Text>
                <Ionicons name="arrow-forward" size={15} color={C.blue} />
              </Pressable>
            </Card>
          ))}
          <FeatureAction
            title="Create assignment"
            icon="add-circle-outline"
            onPress={() => {
              setAssignmentTitle("");
              setDraft("");
              goFeature("create-assignment");
            }}
          />
        </>
      );
    if (screen === "create-assignment")
      return (
        <Card>
          <Text style={s.inputLabel}>Assignment title</Text>
          <TextInput
            value={assignmentTitle}
            onChangeText={setAssignmentTitle}
            placeholder="e.g. Unit 4 problem set"
            placeholderTextColor="#A3ABBA"
            style={s.textInput}
          />
          <Text style={s.inputLabel}>Subject and class</Text>
          <Pressable
            onPress={() =>
              setPeriod(
                period === "Java Programming · CSE 3B"
                  ? "Data Structures · CSE 3A"
                  : "Java Programming · CSE 3B",
              )
            }
            style={s.recipientPill}
          >
            <Ionicons name="book-outline" size={16} color={C.blue} />
            <Text style={s.recipientText}>
              {period === "This month" ? "Java Programming · CSE 3B" : period}
            </Text>
            <Ionicons name="chevron-down" size={15} color={C.muted} />
          </Pressable>
          <Text style={s.inputLabel}>Instructions</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add assignment instructions…"
            placeholderTextColor="#A3ABBA"
            multiline
            style={[s.textInput, s.multilineInput]}
          />
          <Text style={s.inputLabel}>Due date</Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Due date",
                "The demo due date is set to November 21, 2026.",
              )
            }
            style={s.recipientPill}
          >
            <Ionicons name="calendar-outline" size={16} color={C.blue} />
            <Text style={s.recipientText}>November 21, 2026</Text>
            <Ionicons name="chevron-forward" size={15} color={C.muted} />
          </Pressable>
          <FeatureAction
            title="Publish assignment"
            icon="send-outline"
            onPress={() => {
              if (!assignmentTitle.trim()) {
                Alert.alert(
                  "Add a title",
                  "Enter an assignment title before publishing.",
                );
                return;
              }
              Alert.alert(
                "Assignment published",
                `${assignmentTitle.trim()} is now available in this demo workspace.`,
              );
              setAssignmentTitle("");
              setDraft("");
            }}
          />
        </Card>
      );
    if (screen === "materials")
      return (
        <>
          <Card style={s.uploadPanel}>
            <View style={s.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={25} color={C.blue} />
            </View>
            <Text style={s.uploadTitle}>Share a study resource</Text>
            <Text style={s.rowSub}>
              Add notes, slides, or reading material for your students.
            </Text>
            <FeatureAction
              title="Choose a file"
              icon="document-attach-outline"
              onPress={() =>
                Alert.alert(
                  "Demo upload",
                  "File uploads will be connected when the campus backend is ready.",
                )
              }
            />
          </Card>
          <SectionTitle
            title="Recently shared"
            subtitle="Materials visible to your assigned classes"
          />
          <Card style={{ paddingVertical: 3 }}>
            {[
              {
                title: "Unit 3 · Graph Algorithms.pdf",
                subject: "Data Structures · Nov 8",
              },
              {
                title: "Java Collections reference.pdf",
                subject: "Java Programming · Nov 6",
              },
              {
                title: "Normalization lecture slides.pptx",
                subject: "DBMS · Nov 4",
              },
            ].map((file) => (
              <View key={file.title} style={s.historyRow}>
                <View style={[s.infoIcon, { backgroundColor: C.palePurple }]}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#8567CE"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{file.title}</Text>
                  <Text style={s.rowSub}>{file.subject}</Text>
                </View>
                <Ionicons name="ellipsis-vertical" size={16} color={C.muted} />
              </View>
            ))}
          </Card>
        </>
      );
    if (screen === "marks")
      return (
        <>
          <Card>
            <Text style={s.rowTitle}>Internal Assessment 2</Text>
            <Text style={s.rowSub}>
              Data Structures · CSE 3A · Maximum marks: 50
            </Text>
            <View style={s.marksSummary}>
              <Text style={s.metricLabel}>Marks entered</Text>
              <Text style={s.metricValue}>
                {Object.keys(marks).length} / {students.length}
              </Text>
            </View>
          </Card>
          <SectionTitle
            title="Student marks"
            subtitle="Enter a score from 0 to 50"
          />
          <Card style={{ paddingVertical: 3 }}>
            {students.map((name, index) => (
              <View key={name} style={s.rosterRow}>
                <View style={[s.miniAvatar, { backgroundColor: C.paleBlue }]}>
                  <Text style={s.miniAvatarText}>
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{name}</Text>
                  <Text style={s.rowSub}>
                    CSE3A{String(index + 1).padStart(3, "0")}
                  </Text>
                </View>
                <TextInput
                  keyboardType="numeric"
                  maxLength={2}
                  value={marks[name] ?? String(35 + (index % 13))}
                  onChangeText={(value) =>
                    setMarks((current) => ({
                      ...current,
                      [name]: value.replace(/[^0-9]/g, "").slice(0, 2),
                    }))
                  }
                  style={s.markInput}
                />
              </View>
            ))}
          </Card>
          <FeatureAction
            title="Save assessment marks"
            icon="save-outline"
            onPress={() =>
              Alert.alert(
                "Marks saved",
                "Your assessment marks have been saved in this demo workspace.",
              )
            }
          />
        </>
      );
    if (screen === "students")
      return (
        <>
          <View style={s.filterRow}>
            {["All 120", "CSE 3A", "CSE 3B"].map((value, index) => (
              <View
                key={value}
                style={[s.filterChip, index === 0 && s.filterChipActive]}
              >
                <Text style={[s.filterText, index === 0 && s.filterTextActive]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
          <Card style={{ paddingVertical: 3 }}>
            {students.map((name, index) => (
              <Pressable
                key={name}
                onPress={() =>
                  Alert.alert(
                    name,
                    `Student · CSE 3${index % 2 === 0 ? "A" : "B"} · Attendance ${index === 4 ? "68%" : `${82 + index}%`}`,
                  )
                }
                style={s.rosterRow}
              >
                <View
                  style={[
                    s.miniAvatar,
                    {
                      backgroundColor:
                        index % 2 === 0 ? C.paleBlue : C.paleGreen,
                    },
                  ]}
                >
                  <Text style={s.miniAvatarText}>
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{name}</Text>
                  <Text style={s.rowSub}>
                    CSE 3{index % 2 === 0 ? "A" : "B"} · CS3
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>
                <View
                  style={[
                    s.statusPill,
                    { backgroundColor: index === 4 ? "#FFF0F1" : C.paleGreen },
                  ]}
                >
                  <Text
                    style={[
                      s.statusText,
                      { color: index === 4 ? C.red : C.green },
                    ]}
                  >
                    {index === 4 ? "68%" : `${82 + index}%`}
                  </Text>
                </View>
              </Pressable>
            ))}
          </Card>
          <Text style={s.demoNote}>
            Showing 8 sample students from your roster of 120.
          </Text>
        </>
      );
    if (screen === "announcements")
      return (
        <>
          <Card>
            <Text style={s.inputLabel}>Send to</Text>
            <View style={s.recipientPill}>
              <Ionicons name="people-outline" size={16} color={C.blue} />
              <Text style={s.recipientText}>
                All assigned classes · 120 students
              </Text>
              <Ionicons name="chevron-down" size={15} color={C.muted} />
            </View>
            <Text style={s.inputLabel}>Announcement</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Write an update for your students…"
              placeholderTextColor="#A3ABBA"
              multiline
              style={[s.textInput, s.multilineInput, { minHeight: 130 }]}
            />
            <FeatureAction
              title="Preview announcement"
              icon="eye-outline"
              secondary
              onPress={() =>
                Alert.alert(
                  "Preview",
                  draft.trim() || "Your announcement preview will appear here.",
                )
              }
            />
            <FeatureAction
              title="Send announcement"
              icon="send-outline"
              onPress={() => {
                if (!draft.trim()) {
                  Alert.alert(
                    "Write a message",
                    "Add a short announcement before sending.",
                  );
                  return;
                }
                Alert.alert(
                  "Announcement saved",
                  "This demo message is saved on this device and is not sent to students.",
                );
                setDraft("");
              }}
            />
          </Card>
          <SectionTitle
            title="Recent announcements"
            subtitle="Previously shared with your classes"
          />
          <Card style={{ paddingVertical: 3 }}>
            {[
              "Unit 4 notes are now available",
              "Remember to bring your lab record",
              "Internal assessment schedule updated",
            ].map((item, index) => (
              <View key={item} style={s.historyRow}>
                <View style={s.infoIcon}>
                  <Ionicons name="megaphone-outline" size={18} color={C.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>{item}</Text>
                  <Text style={s.rowSub}>
                    {
                      [
                        "Yesterday · CSE 3A",
                        "Nov 8 · CSE 3B",
                        "Nov 6 · All classes",
                      ][index]
                    }
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        </>
      );
    if (screen === "leave-request")
      return (
        <>
          <Card>
            <Text style={s.inputLabel}>Leave type</Text>
            <View style={s.leaveChoices}>
              {["Casual", "Medical", "Academic"].map((value, index) => (
                <Pressable
                  key={value}
                  onPress={() => setPeriod(value)}
                  style={[s.filterChip, period === value && s.filterChipActive]}
                >
                  <Text
                    style={[
                      s.filterText,
                      period === value && s.filterTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={s.inputLabel}>Dates</Text>
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Choose dates",
                  "Date selection will be available in the connected leave workflow.",
                )
              }
              style={s.recipientPill}
            >
              <Ionicons name="calendar-outline" size={16} color={C.blue} />
              <Text style={s.recipientText}>Select start and end date</Text>
              <Ionicons name="chevron-forward" size={15} color={C.muted} />
            </Pressable>
            <Text style={s.inputLabel}>Reason</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Add a brief reason for your request…"
              placeholderTextColor="#A3ABBA"
              multiline
              style={[s.textInput, s.multilineInput]}
            />
            <FeatureAction
              title="Submit leave request"
              icon="send-outline"
              onPress={() => {
                if (!draft.trim()) {
                  Alert.alert(
                    "Add a reason",
                    "Please include a short reason for your leave request.",
                  );
                  return;
                }
                Alert.alert(
                  "Request saved",
                  "Your leave request is saved in this demo and is ready for HOD review.",
                );
                setDraft("");
              }}
            />
          </Card>
          <SectionTitle title="Recent requests" subtitle="Leave history" />
          <Card style={{ paddingVertical: 3 }}>
            {[
              { date: "Oct 21 · 1 day", status: "Approved" },
              { date: "Sep 12–13 · 2 days", status: "Approved" },
            ].map((item) => (
              <View key={item.date} style={s.historyRow}>
                <View style={[s.infoIcon, { backgroundColor: C.paleGreen }]}>
                  <Ionicons name="airplane-outline" size={18} color={C.green} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowTitle}>Casual leave</Text>
                  <Text style={s.rowSub}>{item.date}</Text>
                </View>
                <Text style={[s.statusText, { color: C.green }]}>
                  {item.status}
                </Text>
              </View>
            ))}
          </Card>
        </>
      );
    if (screen === "performance")
      return (
        <>
          <Card>
            <View style={s.performanceHero}>
              <View>
                <Text style={s.metricLabel}>Class average</Text>
                <Text style={s.attendancePercent}>
                  82<Text style={s.percentSign}>%</Text>
                </Text>
              </View>
              <View style={s.performanceBadge}>
                <Ionicons
                  name="trending-up-outline"
                  size={15}
                  color={C.green}
                />
                <Text style={s.performanceBadgeText}>+4% this term</Text>
              </View>
            </View>
            <Text style={s.rowSub}>
              Across 4 subjects · Based on Internal Assessment 1
            </Text>
          </Card>
          <SectionTitle
            title="Subject-wise performance"
            subtitle="Average score by class"
          />
          <Card>
            {subjects.map((item, index) => (
              <View key={item.code} style={s.chartRow}>
                <Text style={s.chartLabel}>{item.name.split(" ")[0]}</Text>
                <View style={s.chartTrack}>
                  <View
                    style={[
                      s.chartFill,
                      {
                        width: `${[82, 88, 76, 85][index]}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={s.chartValue}>{[82, 88, 76, 85][index]}%</Text>
              </View>
            ))}
          </Card>
          <SectionTitle
            title="Student support"
            subtitle="Based on attendance and recent marks"
          />
          <Card>
            <View style={s.supportRow}>
              <View style={[s.infoIcon, { backgroundColor: "#FFF0F1" }]}>
                <Ionicons name="alert-circle-outline" size={18} color={C.red} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>Needs improvement</Text>
                <Text style={s.rowSub}>
                  6 students · Attendance below 75% or average under 60%
                </Text>
              </View>
              <Text style={[s.metricValue, { color: C.red }]}>6</Text>
            </View>
            <View style={s.supportRow}>
              <View style={[s.infoIcon, { backgroundColor: C.paleGreen }]}>
                <Ionicons name="ribbon-outline" size={18} color={C.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>Highest performers</Text>
                <Text style={s.rowSub}>
                  Aarav Nair · Ananya Shah · Dev Patel
                </Text>
              </View>
              <Text style={[s.metricValue, { color: C.green }]}>3</Text>
            </View>
          </Card>
          <Card>
            <Text style={s.rowTitle}>Attendance vs academic performance</Text>
            <Text style={s.rowSub}>
              Students with attendance above 90% average 84% in assessments.
            </Text>
            <View style={s.correlationStrip}>
              <Text style={s.correlationLabel}>Attendance</Text>
              <View
                style={[
                  s.correlationBar,
                  { width: "82%", backgroundColor: C.green },
                ]}
              />
              <Text style={s.chartValue}>90%+</Text>
            </View>
            <View style={s.correlationStrip}>
              <Text style={s.correlationLabel}>Assessment</Text>
              <View
                style={[
                  s.correlationBar,
                  { width: "75%", backgroundColor: C.blue },
                ]}
              />
              <Text style={s.chartValue}>84%</Text>
            </View>
          </Card>
        </>
      );
    if (screen === "exams")
      return (
        <>
          {examItems.map((exam, index) => (
            <Card key={exam.subject}>
              <View style={s.rowBetween}>
                <View style={[s.examDate, { width: 57, height: 57 }]}>
                  <Text style={s.examDay}>{18 + index * 2}</Text>
                  <Text style={s.examMonth}>NOV</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={s.rowTitle}>{exam.subject}</Text>
                  <Text style={s.rowSub}>{exam.type}</Text>
                  <Text style={s.rowSub}>{exam.section} · 10:00 AM</Text>
                </View>
                <View style={[s.statusPill, { backgroundColor: C.paleOrange }]}>
                  <Text style={[s.statusText, { color: C.orange }]}>
                    {index === 0 ? "In 7 days" : "Upcoming"}
                  </Text>
                </View>
              </View>
              <View style={s.examDetail}>
                <Ionicons name="location-outline" size={15} color={C.muted} />
                <Text style={s.rowSub}>
                  Examination block · Room {201 + index}
                </Text>
              </View>
            </Card>
          ))}
        </>
      );
    if (screen === "notifications")
      return (
        <>
          <Pressable
            onPress={() =>
              setRead(
                Object.fromEntries(notices.map((item) => [item.title, true])),
              )
            }
            style={s.readAll}
          >
            <Ionicons name="checkmark-done-outline" size={16} color={C.blue} />
            <Text style={s.textActionLabel}>Mark all as read</Text>
          </Pressable>
          <Card style={{ paddingVertical: 3 }}>
            {notices.map((item) => {
              const isUnread = item.unread && !read[item.title];
              return (
                <Pressable
                  key={item.title}
                  onPress={() =>
                    setRead((current) => ({ ...current, [item.title]: true }))
                  }
                  style={s.noticeRow}
                >
                  <View style={s.infoIcon}>
                    <Ionicons name={item.icon} size={18} color={C.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowTitle}>{item.title}</Text>
                    <Text style={s.rowSub}>{item.detail}</Text>
                  </View>
                  {isUnread ? (
                    <View style={s.unreadDot} />
                  ) : (
                    <Ionicons name="checkmark" size={16} color={C.green} />
                  )}
                </Pressable>
              );
            })}
          </Card>
        </>
      );
    return (
      <EmptyState
        title="Feature not found"
        detail="Return to the faculty home screen and choose a workspace tool."
      />
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={s.featureScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FeatureHeader
          screen={screen}
          title={info?.title ?? "Faculty workspace"}
          subtitle={info?.subtitle ?? "This faculty tool is not available."}
          icon={info?.icon ?? "apps-outline"}
        />
        {content()}
        <Text style={s.demoNote}>
          Frontend demo · Information is sample data for the 2026–27 academic
          year
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = {
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110 },
  featureScroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 18,
  },
  brandMark: { width: 48, height: 48, borderRadius: 17, alignItems: "center" as const, justifyContent: "center" as const, marginRight: 12 },
  brandLetter: { color: C.white, fontSize: 24, fontWeight: "900" as const },
  brandEyebrow: { color: C.muted, fontSize: 10, fontWeight: "900" as const, letterSpacing: 2.5 },
  brandTitle: { color: C.navy, fontSize: 16, fontWeight: "900" as const, marginTop: 2 },
  pageIntro: { marginTop: 2, marginBottom: 18 },
  pageIntroTitle: { color: C.navy, fontSize: 25, lineHeight: 31, fontWeight: "900" as const, letterSpacing: -0.6 },
  pageIntroSubtitle: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginLeft: 9,
  },
  notificationBadge: {
    position: "absolute" as const,
    top: 5,
    right: 4,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: C.red,
    borderWidth: 1,
    borderColor: C.white,
  },
  notificationBadgeText: {
    color: C.white,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: "900" as const,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: C.paleBlue,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginLeft: 9,
    borderWidth: 1,
    borderColor: "#E2E7FF",
  },
  datePill: {
    alignSelf: "flex-start" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    marginTop: 1,
    marginBottom: 2,
  },
  dateText: { color: C.blue, fontSize: 9, fontWeight: "900" as const, letterSpacing: 0.5 },
  welcomeHero: { borderRadius: 28, padding: 19, borderWidth: 1, borderColor: "#E1E7FF", marginBottom: 4 },
  welcomeHeroTop: { flexDirection: "row" as const, alignItems: "flex-start" as const },
  welcomeTitle: { color: C.navy, fontSize: 26, lineHeight: 32, fontWeight: "900" as const, letterSpacing: -0.65, marginTop: 13 },
  welcomeName: { color: "#73809B", fontSize: 15, fontWeight: "800" as const, marginTop: 3 },
  welcomeSubtitle: { color: C.muted, fontSize: 11, lineHeight: 17, marginTop: 8, maxWidth: 230 },
  welcomeAvatar: { width: 66, height: 66, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.9)", borderWidth: 1, borderColor: C.white, alignItems: "center" as const, justifyContent: "center" as const, marginTop: 12 },
  welcomeAvatarText: { color: C.blue, fontSize: 19, fontWeight: "900" as const },
  welcomeDetails: { flexDirection: "row" as const, alignItems: "center" as const, backgroundColor: "rgba(255,255,255,0.85)", borderWidth: 1, borderColor: C.white, borderRadius: 19, padding: 13, marginTop: 19 },
  welcomeDetail: { flex: 1, flexDirection: "row" as const, alignItems: "center" as const },
  welcomeDetailLabel: { color: C.muted, fontSize: 9, fontWeight: "900" as const, letterSpacing: 0.8 },
  welcomeDetailValue: { color: C.navy, fontSize: 10, fontWeight: "900" as const, marginTop: 3 },
  welcomeDivider: { width: 1, height: 34, backgroundColor: "#E5E9F3", marginHorizontal: 10 },
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "space-between" as const,
    marginTop: 11,
  },
  statCard: {
    width: "48.4%" as const,
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 10,
    minHeight: 110,
  },
  statIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  statValue: {
    color: C.navy,
    fontSize: 23,
    lineHeight: 25,
    fontWeight: "900" as const,
    marginTop: 8,
  },
  statLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "700" as const,
    marginTop: 2,
  },
  sectionHeading: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginTop: 27,
    marginBottom: 13,
  },
  sectionTitle: {
    color: C.navy,
    fontSize: 18,
    fontWeight: "900" as const,
    letterSpacing: -0.25,
  },
  sectionSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 17,
  },
  textAction: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: C.paleBlue,
  },
  textActionLabel: { color: C.blue, fontSize: 10, fontWeight: "900" as const },
  card: {
    padding: 16,
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },
  scheduleRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  scheduleTime: { width: 64 },
  scheduleTimeText: { color: C.navy, fontSize: 10, fontWeight: "900" as const },
  scheduleTimeSub: { color: C.muted, fontSize: 9, marginTop: 3 },
  scheduleShell: { borderRadius: 27, padding: 10, borderWidth: 1, borderColor: "#E1E8FF", marginBottom: 10 },
  scheduleInner: { borderRadius: 21, paddingHorizontal: 13, backgroundColor: C.white, borderWidth: 1, borderColor: "#E9EDF6" },
  timelineDot: { width: 8, height: 8, borderRadius: 5 },
  rowTitle: {
    color: C.navy,
    fontSize: 13,
    fontWeight: "800" as const,
    lineHeight: 15,
  },
  rowSub: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 11 },
  statusText: { fontSize: 9, fontWeight: "900" as const },
  attendanceTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 9,
  },
  metricLabel: { color: C.muted, fontSize: 9, fontWeight: "700" as const },
  attendancePercent: {
    color: C.navy,
    fontSize: 30,
    fontWeight: "900" as const,
    letterSpacing: -1,
    marginTop: 2,
  },
  percentSign: {
    color: C.muted,
    fontSize: 16,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  attendanceCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 4,
    borderColor: C.paleGreen,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  circleLabel: {
    color: C.green,
    fontSize: 10,
    fontWeight: "900" as const,
    marginTop: 2,
  },
  attendanceMetrics: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F0F2F6",
    marginBottom: 10,
  },
  metric: { alignItems: "center" as const, flex: 1 },
  metricValue: { color: C.navy, fontSize: 12, fontWeight: "900" as const },
  inlineActions: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 10,
    gap: 5,
  },
  smallAction: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingVertical: 6,
  },
  smallActionText: { color: C.blue, fontSize: 9, fontWeight: "800" as const },
  progressTrack: {
    width: "100%" as const,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#F0F2F7",
    overflow: "hidden" as const,
    marginTop: 8,
  },
  progressFill: { height: "100%" as const, borderRadius: 5 },
  subjectGrid: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    gap: 9,
  },
  subjectCard: {
    padding: 12,
    backgroundColor: C.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 9,
    flex: 1,
  },
  subjectTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  subjectIcon: {
    width: 33,
    height: 33,
    borderRadius: 11,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  subjectCode: { color: C.muted, fontSize: 9, fontWeight: "800" as const },
  subjectName: {
    color: C.navy,
    fontSize: 10,
    fontWeight: "900" as const,
    lineHeight: 15,
    marginTop: 9,
    minHeight: 30,
  },
  subjectMeta: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: 8,
  },
  taskRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  infoIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: C.paleBlue,
    marginRight: 10,
  },
  taskDue: { fontSize: 9, fontWeight: "800" as const, marginTop: 4 },
  assignmentSummary: { flexDirection: "row" as const, gap: 7, marginBottom: 7 },
  summaryMetric: {
    flex: 1,
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 6,
    alignItems: "center" as const,
  },
  summaryValue: { color: C.navy, fontSize: 14, fontWeight: "900" as const },
  summaryLabel: {
    color: "#748096",
    fontSize: 9,
    fontWeight: "700" as const,
    marginTop: 3,
    textAlign: "center" as const,
  },
  assignmentRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  rowBetween: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  assignmentCount: { color: C.blue, fontSize: 10, fontWeight: "900" as const },
  progressCaption: { color: C.muted, fontSize: 9, marginTop: 4 },
  outlineButton: {
    minHeight: 42,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 7,
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#DDE3F6",
    backgroundColor: C.white,
    marginTop: 4,
  },
  outlineButtonText: { color: C.blue, fontSize: 10, fontWeight: "900" as const },
  chartLegend: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 6,
    marginBottom: 8,
  },
  legendDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: C.blue },
  chartAverage: {
    color: C.green,
    fontSize: 10,
    fontWeight: "800" as const,
    marginLeft: "auto" as const,
  },
  chartRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginVertical: 8,
  },
  chartLabel: {
    width: 84,
    color: "#66728B",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  chartTrack: {
    flex: 1,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#F0F2F7",
    overflow: "hidden" as const,
  },
  chartFill: { height: 7, borderRadius: 5 },
  chartValue: {
    width: 29,
    textAlign: "right" as const,
    color: C.navy,
    fontSize: 10,
    fontWeight: "900" as const,
  },
  insightNote: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 7,
    backgroundColor: C.paleBlue,
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  insightText: { flex: 1, color: "#59698D", fontSize: 10, lineHeight: 15 },
  examRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  examDate: {
    width: 42,
    height: 44,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: C.paleBlue,
    marginRight: 10,
  },
  examDay: { color: C.blue, fontSize: 14, fontWeight: "900" as const },
  examMonth: {
    color: C.muted,
    fontSize: 9,
    fontWeight: "900" as const,
    marginTop: 1,
  },
  quickGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  quickAction: {
    width: "24%" as const,
    alignItems: "center" as const,
    paddingVertical: 13,
    paddingHorizontal: 3,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#EEF1F7",
    backgroundColor: C.white,
    margin: "0.5%" as const,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  quickLabel: {
    color: "#69758D",
    fontSize: 9,
    fontWeight: "900" as const,
    textAlign: "center" as const,
    marginTop: 8,
    lineHeight: 13,
  },
  noticeRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.blue,
    marginLeft: 9,
  },
  demoNote: {
    color: "#A0A8B8",
    fontSize: 9,
    lineHeight: 13,
    textAlign: "center" as const,
    marginTop: 17,
    marginBottom: 8,
  },
  semesterBanner: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: C.paleBlue,
    borderRadius: 17,
    padding: 12,
    marginTop: 7,
    marginBottom: 8,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 10,
  },
  bannerTitle: { color: C.navy, fontSize: 10, fontWeight: "900" as const },
  bannerCount: { color: C.blue, fontSize: 9, fontWeight: "900" as const },
  primaryWide: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: C.navy,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 9,
  },
  primaryWideText: {
    color: C.white,
    flex: 1,
    fontSize: 11,
    fontWeight: "900" as const,
    marginLeft: 9,
  },
  taskHero: {
    backgroundColor: C.paleBlue,
    borderColor: "#E1E7FF",
    borderWidth: 1,
    borderRadius: 24,
    padding: 19,
    marginTop: 8,
    marginBottom: 14,
  },
  taskHeroEyebrow: {
    color: C.blue,
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: "900" as const,
  },
  taskHeroTitle: {
    color: C.navy,
    fontSize: 20,
    fontWeight: "900" as const,
    marginTop: 7,
  },
  taskHeroText: { color: "#73809B", fontSize: 11, marginTop: 6 },
  filterRow: {
    flexDirection: "row" as const,
    gap: 7,
    marginTop: 5,
    marginBottom: 10,
  },
  filterChip: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterChipActive: { backgroundColor: C.navy, borderColor: C.navy },
  filterText: { color: "#778198", fontSize: 10, fontWeight: "800" as const },
  filterTextActive: { color: C.white },
  taskCompleteAction: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    alignSelf: "flex-end" as const,
    paddingVertical: 8,
  },
  taskCompleteText: { color: C.blue, fontSize: 10, fontWeight: "900" as const },
  primaryButton: {
    minHeight: 44,
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    gap: 8,
    borderRadius: 13,
    backgroundColor: C.blue,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 9,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "900" as const,
  },
  notificationHero: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    padding: 13,
    borderRadius: 21,
    marginTop: 8,
    marginBottom: 5,
  },
  notificationHeroIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: C.paleBlue,
    marginRight: 10,
  },
  profileCard: {
    alignItems: "center" as const,
    paddingVertical: 22,
    marginTop: 8,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 25,
    backgroundColor: C.paleBlue,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  profileAvatarText: {
    color: C.blue,
    fontSize: 24,
    fontWeight: "900" as const,
  },
  profileName: {
    color: C.navy,
    fontSize: 18,
    fontWeight: "900" as const,
    marginTop: 11,
  },
  profilePill: {
    backgroundColor: C.paleBlue,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 9,
  },
  profilePillText: {
    color: C.blue,
    fontSize: 9,
    fontWeight: "900" as const,
    letterSpacing: 0.5,
  },
  profileDetail: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#F0F2F7",
  },
  profileDetailValue: {
    color: C.navy,
    fontSize: 10,
    fontWeight: "800" as const,
    textAlign: "right" as const,
    maxWidth: "60%" as const,
  },
  preferenceRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#F0F2F7",
  },
  switchTrack: {
    width: 38,
    height: 22,
    borderRadius: 12,
    padding: 3,
    justifyContent: "center" as const,
    backgroundColor: "#D9DDE5",
  },
  switchTrackOn: { backgroundColor: C.green },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 9,
    backgroundColor: C.white,
  },
  switchThumbOn: { alignSelf: "flex-end" as const },
  featureHeader: { paddingTop: 1, paddingBottom: 7 },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 13,
  },
  featureHero: { borderRadius: 28, padding: 18, borderWidth: 1, borderColor: "#E1E7FF", marginBottom: 10 },
  featureHeroTop: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  featureTitle: {
    color: C.navy,
    fontSize: 25,
    fontWeight: "900" as const,
    letterSpacing: -0.5,
    marginTop: 15,
  },
  featureSubtitle: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },
  featureDemo: {
    alignSelf: "flex-start" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 0,
  },
  demoDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: C.orange },
  demoPillText: {
    color: C.muted,
    fontSize: 9,
    letterSpacing: 0.7,
    fontWeight: "900" as const,
  },
  secondaryButton: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: "#DDE3F6",
  },
  emptyState: { alignItems: "center" as const, paddingVertical: 25 },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: C.paleBlue,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 9,
  },
  attendanceSession: { color: C.muted, fontSize: 10, marginTop: 10 },
  attendanceSummary: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    borderTopWidth: 1,
    borderColor: "#F0F2F7",
    paddingTop: 10,
    marginTop: 10,
  },
  attendanceSummaryText: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "700" as const,
  },
  rosterRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  miniAvatar: {
    width: 31,
    height: 31,
    borderRadius: 11,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 9,
  },
  miniAvatarText: { color: "#53617C", fontSize: 9, fontWeight: "900" as const },
  attendanceToggle: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFF0F1",
  },
  attendanceToggleOn: { backgroundColor: C.paleGreen },
  attendanceToggleText: { fontSize: 9, fontWeight: "900" as const },
  historyRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  historyCount: { fontSize: 9, fontWeight: "900" as const },
  largeGreen: { color: C.green, fontSize: 22, fontWeight: "900" as const },
  reportMetric: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  subjectActions: {
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    gap: 12,
  },
  rowAction: {
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    alignItems: "center" as const,
    gap: 5,
    paddingTop: 8,
  },
  uploadPanel: {
    alignItems: "center" as const,
    paddingVertical: 21,
    marginTop: 6,
  },
  uploadIcon: {
    width: 54,
    height: 54,
    borderRadius: 19,
    backgroundColor: C.paleBlue,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 9,
  },
  uploadTitle: {
    color: C.navy,
    fontSize: 12,
    fontWeight: "900" as const,
    marginBottom: 3,
  },
  marksSummary: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    borderTopWidth: 1,
    borderColor: "#F0F2F7",
    marginTop: 11,
    paddingTop: 11,
  },
  markInput: {
    width: 48,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    textAlign: "center" as const,
    color: C.navy,
    fontSize: 10,
    fontWeight: "900" as const,
    backgroundColor: "#FAFBFD",
  },
  inputLabel: {
    color: C.navy,
    fontSize: 11,
    fontWeight: "900" as const,
    marginTop: 8,
    marginBottom: 7,
  },
  textInput: {
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 11,
    paddingVertical: 10,
    color: C.navy,
    fontSize: 11,
    backgroundColor: "#FCFCFE",
  },
  multilineInput: {
    minHeight: 85,
    textAlignVertical: "top" as const,
    lineHeight: 15,
  },
  recipientPill: {
    minHeight: 41,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FCFCFE",
  },
  recipientText: {
    flex: 1,
    color: C.navy,
    fontSize: 10,
    fontWeight: "700" as const,
  },
  leaveChoices: { flexDirection: "row" as const, gap: 7 },
  performanceHero: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  performanceBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: C.paleGreen,
    borderRadius: 12,
  },
  performanceBadgeText: {
    color: C.green,
    fontSize: 10,
    fontWeight: "900" as const,
  },
  supportRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F7",
  },
  correlationStrip: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 7,
    marginTop: 12,
  },
  correlationLabel: {
    width: 62,
    color: C.muted,
    fontSize: 9,
    fontWeight: "700" as const,
  },
  correlationBar: { height: 7, borderRadius: 5 },
  examDetail: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    borderTopWidth: 1,
    borderColor: "#F0F2F7",
    marginTop: 11,
    paddingTop: 9,
  },
  readAll: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "flex-end" as const,
    gap: 5,
    marginBottom: 8,
  },
};
