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
  type ServiceIcon,
} from '../../components/StudentServiceScreen';

type HostelTab = 'Facilities' | 'New request' | 'My requests';
type HostelRequest = {
  id: string;
  category: string;
  room: string;
  details: string;
  date: string;
};

const FACILITIES: { name: string; detail: string; icon: ServiceIcon; color: string; tint: string }[] = [
  { name: 'Laundry room', detail: 'Wash and drying facilities', icon: 'shirt-outline', color: '#6478E8', tint: '#EEF2FF' },
  { name: 'Study lounge', detail: 'Shared quiet study space', icon: 'book-outline', color: '#259B78', tint: '#EAF8F1' },
  { name: 'Wi-Fi support', detail: 'Help with residence network access', icon: 'wifi-outline', color: '#D99035', tint: '#FFF4E9' },
  { name: 'Room maintenance', detail: 'Repairs and facility requests', icon: 'construct-outline', color: '#C04FA0', tint: '#FCEBFA' },
];

const REQUEST_TYPES = ['Plumbing', 'Electrical', 'Cleaning', 'Wi-Fi', 'Other'];
const TABS: HostelTab[] = ['Facilities', 'New request', 'My requests'];

export default function HostelServicesScreen() {
  const [activeTab, setActiveTab] = useState<HostelTab>('Facilities');
  const [requestType, setRequestType] = useState('Plumbing');
  const [room, setRoom] = useState('');
  const [details, setDetails] = useState('');
  const [requests, setRequests] = useState<HostelRequest[]>([]);
  const [error, setError] = useState('');

  const submitRequest = () => {
    if (!room.trim() || !details.trim()) {
      setError('Add your room or block and describe what needs attention.');
      return;
    }
    const id = `HR-${String(Date.now()).slice(-6)}`;
    setRequests((current) => [
      {
        id,
        category: requestType,
        room: room.trim(),
        details: details.trim(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      },
      ...current,
    ]);
    setRoom('');
    setDetails('');
    setError('');
    setActiveTab('My requests');
  };

  return (
    <StudentServiceScreen
      title="Hostel Services"
      headline="A little closer to home."
      description="Find residence facilities, keep up with notices and send a maintenance request when you need help."
      icon="bed-outline"
      accent="#C04FA0"
      tint="#FCEBFA"
    >
      <View className="mt-4 flex-row rounded-2xl border border-[#E9EDF5] bg-white p-1.5">
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 items-center rounded-xl px-1 py-2.5 ${active ? 'bg-[#202B49]' : ''}`}
            >
              <Text className={`text-[9px] font-bold ${active ? 'text-white' : 'text-[#8992A8]'}`}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'Facilities' && (
        <View>
          <View className="mt-4 flex-row">
            <View className="mr-3 flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <Ionicons name="shield-checkmark-outline" size={20} color="#259B78" />
              <Text className="mt-2 text-[15px] font-extrabold text-[#202B49]">24/7</Text>
              <Text className="mt-1 text-[9px] text-[#8992A8]">Residence support</Text>
            </View>
            <View className="flex-1 rounded-2xl border border-[#E9EDF5] bg-white p-4">
              <Ionicons name="construct-outline" size={20} color="#6478E8" />
              <Text className="mt-2 text-[15px] font-extrabold text-[#202B49]">{requests.length}</Text>
              <Text className="mt-1 text-[9px] text-[#8992A8]">Your requests</Text>
            </View>
          </View>

          <ServiceSectionHeading
            title="Residence facilities"
            subtitle="Quick access to everyday hostel services"
          />
          {FACILITIES.map((facility) => (
            <View key={facility.name} className="mb-3 flex-row items-center rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: facility.tint }}>
                <Ionicons name={facility.icon} size={21} color={facility.color} />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-extrabold text-[#202B49]">{facility.name}</Text>
                <Text className="mt-1 text-[10px] text-[#8992A8]">{facility.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color="#A0A9BC" />
            </View>
          ))}

          <View className="mt-2 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E9]">
                <Ionicons name="megaphone-outline" size={19} color="#D99035" />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-extrabold text-[#202B49]">Residence reminder</Text>
                <Text className="mt-1 text-[10px] leading-4 text-[#8992A8]">
                  Keep your student ID ready when entering the residence after evening hours.
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setActiveTab('New request')}
            className="mt-4 flex-row items-center justify-center rounded-2xl bg-[#202B49] px-4 py-4"
          >
            <Ionicons name="add-circle-outline" size={17} color="#FFFFFF" />
            <Text className="ml-2 text-[12px] font-extrabold text-white">Request maintenance</Text>
          </Pressable>
        </View>
      )}

      {activeTab === 'New request' && (
        <View>
          <ServiceSectionHeading
            title="Maintenance request"
            subtitle="Tell the residence team what needs attention"
          />
          <View className="rounded-[22px] border border-[#E9EDF5] bg-white p-4">
            <Text className="mb-2 text-[10px] font-extrabold text-[#52617F]">REQUEST TYPE</Text>
            <View className="mb-2 flex-row flex-wrap">
              {REQUEST_TYPES.map((type) => (
                <ServiceChoiceChip
                  key={type}
                  label={type}
                  active={requestType === type}
                  onPress={() => setRequestType(type)}
                />
              ))}
            </View>
            <ServiceTextField
              label="ROOM OR BLOCK"
              value={room}
              onChangeText={setRoom}
              placeholder="e.g. Block B, Room 204"
            />
            <ServiceTextField
              label="WHAT NEEDS ATTENTION?"
              value={details}
              onChangeText={setDetails}
              placeholder="Describe the issue and when it started"
              multiline
            />
            {!!error && (
              <Text className="mb-3 text-[10px] font-semibold text-[#D9535D]">{error}</Text>
            )}
            <ServicePrimaryButton title="Submit request" onPress={submitRequest} icon="send-outline" />
          </View>
        </View>
      )}

      {activeTab === 'My requests' && (
        <View>
          <ServiceSectionHeading
            title="My hostel requests"
            subtitle="Track maintenance requests created in this session"
            trailing={<ServiceTag label={`${requests.length} requests`} color="#C04FA0" background="#FCEBFA" />}
          />
          {requests.length ? requests.map((request) => (
            <View key={request.id} className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[12px] font-extrabold text-[#202B49]">{request.category} request</Text>
                  <Text className="mt-1 text-[10px] text-[#8992A8]">{request.room} · {request.date}</Text>
                </View>
                <ServiceTag label="Received" color="#D99035" background="#FFF4E9" />
              </View>
              <Text className="mt-3 text-[11px] leading-[18px] text-[#52617F]">{request.details}</Text>
              <Text className="mt-3 text-[9px] font-bold text-[#8992A8]">REFERENCE · {request.id}</Text>
            </View>
          )) : (
            <ServiceEmptyState
              title="No requests yet"
              description="Your maintenance requests will appear here after you submit one."
              icon="construct-outline"
            />
          )}
          <Pressable onPress={() => setActiveTab('New request')} className="mt-3 flex-row items-center justify-center rounded-2xl bg-[#202B49] px-4 py-4">
            <Text className="text-[12px] font-extrabold text-white">Create a request</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      )}

      <View className="mt-4 flex-row items-start px-1">
        <Ionicons name="information-circle-outline" size={14} color="#A0A9BC" />
        <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
          Facility information is a sample. For urgent residence concerns, contact the official hostel office or student support.
        </Text>
      </View>
      <View className="mt-3 flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white p-4">
        <Ionicons name="headset-outline" size={18} color={SERVICE_COLORS.blue} />
        <Text className="ml-2 flex-1 text-[10px] font-semibold text-[#52617F]">Need help with something else?</Text>
        <Pressable onPress={() => router.push('/student/student-support')}>
          <Text className="text-[10px] font-extrabold text-[#6478E8]">Open support</Text>
        </Pressable>
      </View>
    </StudentServiceScreen>
  );
}
