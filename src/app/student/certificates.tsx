import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

type Certificate = {
  id: string;
  name: string;
  description: string;
  use: string;
  icon: ServiceIcon;
  color: string;
  tint: string;
  turnaround: string;
};

type CertificateRequest = {
  id: string;
  name: string;
  purpose: string;
  delivery: 'Digital' | 'Printed';
  date: string;
};

const CERTIFICATES: Certificate[] = [
  { id: 'bonafide', name: 'Bonafide certificate', description: 'Confirms your current student status.', use: 'Scholarship, internship or travel', icon: 'school-outline', color: '#6478E8', tint: '#EEF2FF', turnaround: '2–3 working days' },
  { id: 'conduct', name: 'Conduct certificate', description: 'A college conduct and character record.', use: 'Admission or employment', icon: 'ribbon-outline', color: '#259B78', tint: '#EAF8F1', turnaround: '3–5 working days' },
  { id: 'transcript', name: 'Academic transcript', description: 'A term-wise summary of your academic record.', use: 'Further studies or applications', icon: 'document-text-outline', color: '#D99035', tint: '#FFF4E9', turnaround: '3–5 working days' },
  { id: 'fee-receipt', name: 'Fee statement', description: 'A summary of fees recorded for your account.', use: 'Reimbursement or records', icon: 'wallet-outline', color: '#C04FA0', tint: '#FCEBFA', turnaround: '1–2 working days' },
];

const PURPOSES = ['Scholarship', 'Internship', 'Admission', 'Personal'];
const TABS = ['Browse', 'Request', 'My requests'] as const;

export default function CertificatesScreen() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Browse');
  const [selectedCertificateId, setSelectedCertificateId] = useState(CERTIFICATES[0].id);
  const [purpose, setPurpose] = useState('Scholarship');
  const [notes, setNotes] = useState('');
  const [delivery, setDelivery] = useState<'Digital' | 'Printed'>('Digital');
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [error, setError] = useState('');

  const selectedCertificate =
    CERTIFICATES.find((certificate) => certificate.id === selectedCertificateId) ?? CERTIFICATES[0];

  const startRequest = (certificateId: string) => {
    setSelectedCertificateId(certificateId);
    setActiveTab('Request');
    setError('');
  };

  const submitRequest = () => {
    if (!notes.trim()) {
      setError('Add any details the office needs to prepare this document.');
      return;
    }
    const id = `CR-${String(Date.now()).slice(-6)}`;
    setRequests((current) => [
      {
        id,
        name: selectedCertificate.name,
        purpose,
        delivery,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      },
      ...current,
    ]);
    setNotes('');
    setError('');
    setActiveTab('My requests');
  };

  return (
    <StudentServiceScreen
      title="Certificates"
      headline="Your documents, in order."
      description="Review common student documents, submit a request and keep track of your reference number."
      icon="document-text-outline"
      accent="#5C70C9"
      tint="#EEF0FF"
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
                {tab === 'My requests' ? `Requests (${requests.length})` : tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'Browse' && (
        <View>
          <ServiceSectionHeading
            title="Available documents"
            subtitle="Choose a document to start a request"
          />
          {CERTIFICATES.map((certificate) => (
            <View key={certificate.id} className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-start">
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: certificate.tint }}>
                  <Ionicons name={certificate.icon} size={21} color={certificate.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-extrabold text-[#202B49]">{certificate.name}</Text>
                  <Text className="mt-1 text-[10px] leading-[17px] text-[#8992A8]">{certificate.description}</Text>
                </View>
              </View>
              <View className="mt-3 flex-row items-center">
                <Ionicons name="briefcase-outline" size={13} color="#8992A8" />
                <Text className="ml-1.5 flex-1 text-[9px] text-[#8992A8]">Often used for {certificate.use.toLowerCase()}</Text>
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-[9px] font-semibold text-[#8992A8]">Typical processing: {certificate.turnaround}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => startRequest(certificate.id)}
                  className="flex-row items-center rounded-xl bg-[#202B49] px-3 py-2.5"
                >
                  <Text className="text-[9px] font-extrabold text-white">Request</Text>
                  <Ionicons name="arrow-forward" size={13} color="#FFFFFF" style={{ marginLeft: 5 }} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'Request' && (
        <View>
          <ServiceSectionHeading
            title="New document request"
            subtitle="Provide the reason and preferred delivery"
          />
          <View className="rounded-[22px] border border-[#E9EDF5] bg-white p-4">
            <Text className="mb-2 text-[10px] font-extrabold text-[#52617F]">DOCUMENT</Text>
            <View className="mb-2 flex-row flex-wrap">
              {CERTIFICATES.map((certificate) => (
                <ServiceChoiceChip
                  key={certificate.id}
                  label={certificate.name}
                  active={selectedCertificateId === certificate.id}
                  onPress={() => setSelectedCertificateId(certificate.id)}
                />
              ))}
            </View>
            <Text className="mb-2 mt-1 text-[10px] font-extrabold text-[#52617F]">PURPOSE</Text>
            <View className="mb-2 flex-row flex-wrap">
              {PURPOSES.map((item) => (
                <ServiceChoiceChip key={item} label={item} active={purpose === item} onPress={() => setPurpose(item)} />
              ))}
            </View>
            <Text className="mb-2 mt-1 text-[10px] font-extrabold text-[#52617F]">DELIVERY</Text>
            <View className="mb-3 flex-row flex-wrap">
              {(['Digital', 'Printed'] as const).map((item) => (
                <ServiceChoiceChip key={item} label={item} active={delivery === item} onPress={() => setDelivery(item)} />
              ))}
            </View>
            <ServiceTextField
              label="NOTES FOR THE OFFICE"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a semester, date range or other request details"
              multiline
            />
            {!!error && <Text className="mb-3 text-[10px] font-semibold text-[#D9535D]">{error}</Text>}
            <View className="mb-3 flex-row items-start rounded-xl bg-[#F7F8FC] p-3">
              <Ionicons name="time-outline" size={15} color={SERVICE_COLORS.blue} />
              <Text className="ml-2 flex-1 text-[9px] leading-4 text-[#77829D]">
                Typical processing time: {selectedCertificate.turnaround}. The college office will confirm the actual timeline.
              </Text>
            </View>
            <ServicePrimaryButton title="Submit request" onPress={submitRequest} icon="send-outline" />
          </View>
        </View>
      )}

      {activeTab === 'My requests' && (
        <View>
          <ServiceSectionHeading
            title="My document requests"
            subtitle="Keep each request reference for follow-up"
            trailing={<ServiceTag label={`${requests.length} requests`} />}
          />
          {requests.length ? requests.map((request) => (
            <View key={request.id} className="mb-3 rounded-[22px] border border-[#E9EDF5] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[12px] font-extrabold text-[#202B49]">{request.name}</Text>
                  <Text className="mt-1 text-[9px] text-[#8992A8]">{request.date} · {request.purpose} · {request.delivery}</Text>
                </View>
                <ServiceTag label="Received" color="#D99035" background="#FFF4E9" />
              </View>
              <Text className="mt-3 text-[9px] font-bold text-[#8992A8]">REFERENCE · {request.id}</Text>
            </View>
          )) : (
            <ServiceEmptyState
              title="No requests yet"
              description="Your document requests will appear here after you submit one."
              icon="document-text-outline"
            />
          )}
          <Pressable onPress={() => setActiveTab('Browse')} className="mt-3 flex-row items-center justify-center rounded-2xl bg-[#202B49] px-4 py-4">
            <Text className="text-[12px] font-extrabold text-white">Browse documents</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      )}

      <View className="mt-4 flex-row items-start px-1">
        <Ionicons name="information-circle-outline" size={14} color="#A0A9BC" />
        <Text className="ml-1.5 flex-1 text-[9px] leading-4 text-[#A0A9BC]">
          Document types and timelines are sample information. The request list is saved for this session; confirm official requirements with the college office.
        </Text>
      </View>
    </StudentServiceScreen>
  );
}
