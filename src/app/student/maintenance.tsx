import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  ServiceChoiceChip,
  ServiceEmptyState,
  ServicePrimaryButton,
  ServiceSectionHeading,
  ServiceTag,
  ServiceTextField,
  SERVICE_COLORS,
  StudentServiceScreen,
} from '../../components/StudentServiceScreen';

type Priority = 'Routine' | 'High' | 'Urgent';
type IssueReport = {
  id: string;
  category: string;
  location: string;
  details: string;
  priority: Priority;
  date: string;
};

const CATEGORIES = ['Facilities', 'Classroom', 'Network', 'Transport', 'Safety', 'Other'];
const PRIORITIES: Priority[] = ['Routine', 'High', 'Urgent'];

export default function ReportIssueScreen() {
  const [category, setCategory] = useState('Facilities');
  const [priority, setPriority] = useState<Priority>('Routine');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [activeTab, setActiveTab] = useState<'New report' | 'My reports'>('New report');
  const [error, setError] = useState('');

  const submitReport = () => {
    if (!location.trim() || !details.trim()) {
      setError('Add a location and a short description before submitting.');
      return;
    }
    const id = `IR-${String(Date.now()).slice(-6)}`;
    setReports((current) => [
      {
        id,
        category,
        location: location.trim(),
        details: details.trim(),
        priority,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      },
      ...current,
    ]);
    setLocation('');
    setDetails('');
    setPriority('Routine');
    setError('');
    setActiveTab('My reports');
  };

  return (
    <StudentServiceScreen
      title="Report an Issue"
      headline="Help us keep campus running."
      description="Report a maintenance, classroom or service problem and keep its reference number handy."
      icon="construct-outline"
      accent="#16866B"
      tint="#E5F7F1"
    >
      <View className="mt-4 flex-row rounded-2xl border border-[#E9EDF5] bg-white p-1.5">
        {(['New report', 'My reports'] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 items-center rounded-xl py-2.5 ${active ? 'bg-[#202B49]' : ''}`}
            >
              <Text className={`text-[10px] font-bold ${active ? 'text-white' : 'text-[#8992A8]'}`}>
                {tab}{tab === 'My reports' ? ` (${reports.length})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'New report' ? (
        <View>
          <ServiceSectionHeading
            title="Issue details"
            subtitle="Share enough information for the right team to respond"
          />
          <View className="rounded-[22px] border border-[#E9EDF5] bg-white p-4">
            <Text className="mb-2 text-[10px] font-extrabold text-[#52617F]">ISSUE CATEGORY</Text>
            <View className="mb-2 flex-row flex-wrap">
              {CATEGORIES.map((item) => (
                <ServiceChoiceChip
                  key={item}
                  label={item}
                  active={category === item}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>
            <Text className="mb-2 text-[10px] font-extrabold text-[#52617F]">PRIORITY</Text>
            <View className="mb-3 flex-row flex-wrap">
              {PRIORITIES.map((item) => (
                <ServiceChoiceChip
                  key={item}
                  label={item}
                  active={priority === item}
                  onPress={() => setPriority(item)}
                />
              ))}
            </View>
            <ServiceTextField
              label="CAMPUS LOCATION"
              value={location}
              onChangeText={setLocation}
              placeholder="Building, floor, room or stop"
            />
            <ServiceTextField
              label="DESCRIPTION"
              value={details}
              onChangeText={setDetails}
              placeholder="What happened? Include when you first noticed it."
              multiline
            />
            {!!error && <Text className="mb-3 text-[10px] font-semibold text-[#D9535D]">{error}</Text>}
            <ServicePrimaryButton title="Submit issue" onPress={submitReport} icon="send-outline" />
          </View>
          <View className="mt-4 flex-row items-start rounded-2xl border border-[#FFE1CE] bg-[#FFF7F1] p-4">
            <Ionicons name="warning-outline" size={18} color="#D97728" />
            <Text className="ml-2 flex-1 text-[10px] leading-[17px] text-[#8A6A53]">
              For immediate safety or medical emergencies, contact campus security or local emergency services directly.
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <ServiceSectionHeading
            title="My reports"
            subtitle="Submitted reports and their reference details"
            trailing={
              <View className="rounded-xl bg-[#E5F7F1] px-3 py-2">
                <Text className="text-[9px] font-bold text-[#16866B]">{reports.length} REPORTS</Text>
              </View>
            }
          />
          {reports.length ? reports.map((report) => (
            <View key={report.id} className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[12px] font-extrabold text-[#202B49]">{report.category} · {report.location}</Text>
                  <Text className="mt-1 text-[9px] text-[#8992A8]">{report.date} · {report.id}</Text>
                </View>
                <ServiceTag
                  label="Received"
                  color={report.priority === 'Urgent' ? '#C9545E' : '#D99035'}
                  background={report.priority === 'Urgent' ? '#FFF0F1' : '#FFF4E9'}
                />
              </View>
              <Text className="mt-3 text-[11px] leading-[18px] text-[#52617F]">{report.details}</Text>
              <View className="mt-3 flex-row items-center">
                <Ionicons name="flag-outline" size={14} color={SERVICE_COLORS.muted} />
                <Text className="ml-1.5 text-[9px] font-bold text-[#8992A8]">{report.priority} priority</Text>
              </View>
            </View>
          )) : (
            <ServiceEmptyState
              title="No reports yet"
              description="Issues you submit will appear here with a reference number."
              icon="construct-outline"
            />
          )}
          <Pressable onPress={() => setActiveTab('New report')} className="mt-3 flex-row items-center justify-center rounded-2xl bg-[#202B49] px-4 py-4">
            <Text className="text-[12px] font-extrabold text-white">Create a report</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      )}

      <View className="mt-4 flex-row items-start px-1">
        <Ionicons name="information-circle-outline" size={14} color="#A0A9BC" />
        <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
          Reports in this preview stay on this screen for the current session. Connect the official campus issue system for live submission and status updates.
        </Text>
      </View>
      <View className="mt-3 flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white p-4">
        <Ionicons name="headset-outline" size={18} color={SERVICE_COLORS.blue} />
        <Text className="ml-2 flex-1 text-[10px] font-semibold text-[#52617F]">Need help with a request?</Text>
        <Pressable onPress={() => router.push('/student/student-support')}>
          <Text className="text-[10px] font-extrabold text-[#6478E8]">Contact support</Text>
        </Pressable>
      </View>
    </StudentServiceScreen>
  );
}
