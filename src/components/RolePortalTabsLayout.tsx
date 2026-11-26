import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, router, usePathname } from 'expo-router';
import type { IconName, PortalRole } from '@/components/RolePortalDashboard';

type PortalTab = {
  name: string;
  label: string;
  path: string;
  icon: IconName;
  activeIcon: IconName;
};

const PORTAL_TABS: Record<PortalRole, { color: string; tint: string; tabs: PortalTab[] }> = {
  parent: {
    color: '#8B63D9',
    tint: '#F3EDFF',
    tabs: [
      { name: 'index', label: 'Home', path: '/parent', icon: 'home-outline', activeIcon: 'home' },
      { name: 'academics', label: 'Academics', path: '/parent/academics', icon: 'ribbon-outline', activeIcon: 'ribbon' },
      { name: 'school', label: 'School', path: '/parent/school', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
      { name: 'profile', label: 'Profile', path: '/parent/profile', icon: 'person-outline', activeIcon: 'person' },
    ],
  },
  faculty: {
    color: '#159A75',
    tint: '#E9F8F2',
    tabs: [
      { name: 'index', label: 'Home', path: '/faculty', icon: 'home-outline', activeIcon: 'home' },
      { name: 'classes', label: 'Classes', path: '/faculty/classes', icon: 'book-outline', activeIcon: 'book' },
      { name: 'tasks', label: 'Tasks', path: '/faculty/tasks', icon: 'checkbox-outline', activeIcon: 'checkbox' },
      { name: 'profile', label: 'Profile', path: '/faculty/profile', icon: 'person-outline', activeIcon: 'person' },
    ],
  },
  hod: {
    color: '#6478E8',
    tint: '#EEF1FF',
    tabs: [
      { name: 'index', label: 'Home', path: '/hod', icon: 'home-outline', activeIcon: 'home' },
      { name: 'department', label: 'Department', path: '/hod/department', icon: 'business-outline', activeIcon: 'business' },
      { name: 'approvals', label: 'Approvals', path: '/hod/approvals', icon: 'checkmark-done-outline', activeIcon: 'checkmark-done' },
      { name: 'updates', label: 'Updates', path: '/hod/updates', icon: 'notifications-outline', activeIcon: 'notifications' },
      { name: 'profile', label: 'Profile', path: '/hod/profile', icon: 'person-outline', activeIcon: 'person' },
    ],
  },
  principal: {
    color: '#B68A37',
    tint: '#FFF6E5',
    tabs: [
      { name: 'index', label: 'Home', path: '/principal', icon: 'home-outline', activeIcon: 'home' },
      { name: 'campus', label: 'Campus', path: '/principal/campus', icon: 'business-outline', activeIcon: 'business' },
      { name: 'approvals', label: 'Approvals', path: '/principal/approvals', icon: 'checkmark-done-outline', activeIcon: 'checkmark-done' },
      { name: 'updates', label: 'Updates', path: '/principal/updates', icon: 'notifications-outline', activeIcon: 'notifications' },
      { name: 'profile', label: 'Profile', path: '/principal/profile', icon: 'person-outline', activeIcon: 'person' },
    ],
  },
};

function PortalNavbar({ role }: { role: PortalRole }) {
  const pathname = usePathname();
  const config = PORTAL_TABS[role];
  const isFaculty = role === 'faculty';

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: isFaculty ? 16 : 15, paddingTop: 8, paddingBottom: 12 }}>
      <View style={{ backgroundColor: '#FFFFFFF2', borderRadius: 25, borderWidth: 1, borderColor: '#E8ECF4', paddingHorizontal: 4, paddingTop: 6, paddingBottom: 3, shadowColor: '#202B49', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 7 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {config.tabs.map((tab) => {
            const selected = tab.name === 'index'
              ? pathname === tab.path || pathname === `${tab.path}/`
              : pathname === tab.path || pathname.startsWith(`${tab.path}/`);

            return (
              <Pressable
                key={tab.name}
                onPress={() => { if (!selected) router.navigate(tab.path as never); }}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={tab.label}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4 }}
              >
                {selected ? (
                  <LinearGradient colors={isFaculty ? ['#F0F2FF', '#E6EAFF', '#F2EEFF'] : [config.tint, '#FFFFFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: isFaculty ? 48 : 43, height: isFaculty ? 39 : 35, borderRadius: isFaculty ? 15 : 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: isFaculty ? '#E3E7FF' : `${config.color}22` }}>
                    <Ionicons name={tab.activeIcon} size={20} color={config.color} />
                  </LinearGradient>
                ) : (
                  <View style={{ width: isFaculty ? 48 : 43, height: isFaculty ? 39 : 35, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={tab.icon} size={19} color="#8992A6" />
                  </View>
                )}
                <Text numberOfLines={1} style={{ marginTop: isFaculty ? 5 : 4, fontSize: isFaculty ? 10 : 8, fontWeight: selected ? '800' : '600', color: selected ? config.color : '#8992A6' }}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function RolePortalTabsLayout({ role }: { role: PortalRole }) {
  const config = PORTAL_TABS[role];
  return (
    <Tabs
      tabBar={() => <PortalNavbar role={role} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#F5F7FC' } }}
    >
      {config.tabs.map((tab) => <Tabs.Screen key={tab.name} name={tab.name} />)}
    </Tabs>
  );
}
