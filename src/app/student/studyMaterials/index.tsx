
import React, { useMemo, useState } from 'react';
import {
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
import { router } from 'expo-router';

const C = {
  bg: '#F7F9FF',
  white: '#FFFFFF',
  navy: '#202B49',
  blue: '#6478E8',
  muted: '#8992A6',
  border: '#E9EDF5',
  green: '#259B78',
  purple: '#9277D6',
  orange: '#D99035',
};


const subjects = [
  {
    id: 'data-structures',
    name: 'Data Structures',
    code: 'CS301',
    faculty: 'Dr. Priya Sharma',
    credits: 4,
    description: 'Arrays, linked lists, trees, graphs and algorithms.',
    topics: 8,
    resources: 18,
    notes: 8,
    presentations: 4,
    pdfs: 6,
    progress: 72,
    updated: 'Today',
    status: 'In Progress',
    icon: 'git-network-outline' as const,
    color: '#6478E8',
    bg: '#EEF1FF',
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: 'MA302',
    faculty: 'Prof. Arun Kumar',
    credits: 3,
    description: 'Probability, statistics and numerical methods.',
    topics: 6,
    resources: 14,
    notes: 6,
    presentations: 3,
    pdfs: 5,
    progress: 45,
    updated: 'Yesterday',
    status: 'In Progress',
    icon: 'calculator-outline' as const,
    color: '#259B78',
    bg: '#EAF8F1',
  },
  {
    id: 'database-systems',
    name: 'Database Systems',
    code: 'CS303',
    faculty: 'Dr. Meena Raj',
    credits: 4,
    description: 'SQL, database design, normalization and transactions.',
    topics: 7,
    resources: 16,
    notes: 7,
    presentations: 5,
    pdfs: 4,
    progress: 0,
    updated: 'Oct 29',
    status: 'Not Started',
    icon: 'server-outline' as const,
    color: '#9277D6',
    bg: '#F3EFFF',
  },
  {
    id: 'computer-networks',
    name: 'Computer Networks',
    code: 'CS304',
    faculty: 'Prof. Rahul Dev',
    credits: 3,
    description: 'Network models, protocols and communication.',
    topics: 7,
    resources: 12,
    notes: 5,
    presentations: 3,
    pdfs: 4,
    progress: 60,
    updated: 'Oct 28',
    status: 'In Progress',
    icon: 'globe-outline' as const,
    color: '#D99035',
    bg: '#FFF5E8',
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    code: 'CS305',
    faculty: 'Dr. Karthik S',
    credits: 4,
    description: 'Processes, memory management and scheduling.',
    topics: 6,
    resources: 13,
    notes: 6,
    presentations: 3,
    pdfs: 4,
    progress: 0,
    updated: 'Oct 27',
    status: 'Not Started',
    icon: 'desktop-outline' as const,
    color: '#DC626B',
    bg: '#FFF0F1',
  },
];

const recentResources = [
  {
    title: 'Tree Traversal Techniques',
    subject: 'Data Structures',
    type: 'PDF Notes',
    time: 'Today',
    icon: 'document-text-outline' as const,
    color: '#6478E8',
    bg: '#EEF1FF',
  },
  {
    title: 'Probability Distributions',
    subject: 'Mathematics',
    type: 'Presentation',
    time: 'Yesterday',
    icon: 'easel-outline' as const,
    color: '#259B78',
    bg: '#EAF8F1',
  },
  {
    title: 'Network Architecture',
    subject: 'Computer Networks',
    type: 'Study Material',
    time: 'Oct 28',
    icon: 'globe-outline' as const,
    color: '#D99035',
    bg: '#FFF5E8',
  },
];

export default function StudyMaterialsScreen() {
  const [search, setSearch] = useState('');

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return subjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.faculty.toLowerCase().includes(query);
      
      return matchesSearch;
    });
  }, [search]);

  const totalTopics = subjects.reduce((sum, item) => sum + item.topics, 0);
  const totalResources = subjects.reduce((sum, item) => sum + item.resources, 0);
  const totalNotes = subjects.reduce((sum, item) => sum + item.notes, 0);
  const totalPresentations = subjects.reduce(
    (sum, item) => sum + item.presentations,
    0
  );


  return (
    <SafeAreaView
      className="flex-1"
      edges={['top', 'bottom', 'left', 'right']}
      style={{ backgroundColor: C.bg }}
    >
      <StatusBar barStyle="dark-content"  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5">

          {/* HEADER */}
          <View className="flex-row items-center justify-between pt-3">
            <View className="flex-row items-center">
              <Pressable
                onPress={() => router.back()}
                className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white"
              >
                <Ionicons name="arrow-back" size={21} color={C.navy} />
              </Pressable>

              <View>
                <Text className="text-[10px] font-extrabold tracking-[2.5px] text-[#8992A6]">
                  CAMPUSOS · ACADEMICS
                </Text>
                <Text className="mt-1 text-xl font-extrabold text-[#202B49]">
                  Study Materials
                </Text>
              </View>
            </View>

            <View className="h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EDF5] bg-white">
              <Ionicons name="library-outline" size={22} color={C.blue} />
            </View>
          </View>

          {/* PREMIUM HERO */}
          <View className="mt-6 overflow-hidden rounded-[30px]">
            <LinearGradient
              colors={['#F0F2FF', '#E9EEFF', '#F6F1FF', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 21 }}
            >
              <View className="flex-row items-center justify-between">
                <View className="rounded-full border border-[#DDE3FF] bg-white/80 px-3 py-2">
                  <Text className="text-[9px] font-extrabold tracking-[1.5px] text-[#6478E8]">
                    YOUR DIGITAL LIBRARY
                  </Text>
                </View>

                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Ionicons name="book-outline" size={27} color={C.blue} />
                </View>
              </View>

              <Text className="mt-5 text-[26px] font-extrabold leading-9 text-[#202B49]">
                Your knowledge.{'\n'}
                Your next achievement.
              </Text>

              <Text className="mt-2 max-w-[270px] text-xs leading-5 text-[#7D89A5]">
                Explore lecture notes, presentations, PDFs and subject-wise
                learning resources in one place.
              </Text>

              <View className="mt-5 flex-row items-center">
                <View className="flex-row items-center rounded-full bg-white px-3 py-2">
                  <Ionicons name="bookmarks-outline" size={14} color={C.blue} />
                  <Text className="ml-2 text-[10px] font-bold text-[#5266CC]">
                    {subjects.length} Subjects
                  </Text>
                </View>

                <View className="ml-2 flex-row items-center rounded-full bg-white px-3 py-2">
                  <Ionicons name="documents-outline" size={14} color={C.purple} />
                  <Text className="ml-2 text-[10px] font-bold text-[#9277D6]">
                    {totalResources} Resources
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* OVERVIEW */}
          <View className="mt-6 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-[#202B49]">
                Library overview
              </Text>
              <Text className="mt-1 text-xs text-[#8992A6]">
                Your academic learning collection
              </Text>
            </View>
            <View className="rounded-full bg-[#EAF8F1] px-3 py-2">
              <Text className="text-[10px] font-extrabold text-[#259B78]">
                ACTIVE LIBRARY
              </Text>
            </View>
          </View>

          {/* STATS */}
          <View className="mt-4 flex-row">
            <View className="mr-2 flex-1 rounded-[23px] border border-[#E9EDF5] bg-white p-4">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FF]">
                <Ionicons name="layers-outline" size={19} color={C.blue} />
              </View>
              <Text className="mt-3 text-2xl font-extrabold text-[#202B49]">
                {totalTopics}
              </Text>
              <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                Total topics
              </Text>
            </View>

            <View className="mx-1 flex-1 rounded-[23px] border border-[#E9EDF5] bg-white p-4">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#EAF8F1]">
                <Ionicons name="document-text-outline" size={19} color={C.green} />
              </View>
              <Text className="mt-3 text-2xl font-extrabold text-[#202B49]">
                {totalNotes}
              </Text>
              <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                Notes
              </Text>
            </View>

            <View className="ml-2 flex-1 rounded-[23px] border border-[#E9EDF5] bg-white p-4">
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#F3EFFF]">
                <Ionicons name="easel-outline" size={19} color={C.purple} />
              </View>
              <Text className="mt-3 text-2xl font-extrabold text-[#202B49]">
                {totalPresentations}
              </Text>
              <Text className="mt-1 text-[10px] font-semibold text-[#8992A6]">
                PPTs
              </Text>
            </View>
          </View>


          {/* SEARCH */}
          <View className="mt-7">
            <Text className="text-lg font-extrabold text-[#202B49]">
              Find your subject
            </Text>
            <Text className="mt-1 text-xs text-[#8992A6]">
              Search by name, subject code or faculty.
            </Text>

            <View className="mt-4 h-[54px] flex-row items-center rounded-2xl border border-[#E9EDF5] bg-white px-4">
              <Ionicons name="search-outline" size={21} color={C.muted} />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search subjects or faculty..."
                placeholderTextColor={C.muted}
                className="ml-3 h-full flex-1 text-sm text-[#202B49]"
                returnKeyType="search"
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')} hitSlop={10}>
                  <Ionicons name="close-circle" size={20} color={C.muted} />
                </Pressable>
              )}
            </View>
          </View>

          {/* SUBJECTS */}
          <View className="mb-4 mt-7 flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-extrabold text-[#202B49]">
                Your Subjects
              </Text>
              <Text className="mt-1 text-xs text-[#8992A6]">
                Select a subject to explore all its topics
              </Text>
            </View>

            <Text className="text-xs font-bold text-[#6478E8]">
              {filteredSubjects.length} found
            </Text>
          </View>

          {filteredSubjects.map((subject) => (
            <Pressable
              key={subject.id}
              onPress={() =>
                router.push({
                  pathname: '/student/studyMaterials/[subject]',
                  params: { subject: subject.id },
                })
              }
              className="mb-4 rounded-[26px] border border-[#E9EDF5] bg-white p-4 active:opacity-80"
            >
              {/* Subject title */}
              <View className="flex-row items-center">
                <View
                  className="h-[58px] w-[58px] items-center justify-center rounded-[20px]"
                  style={{ backgroundColor: subject.bg }}
                >
                  <Ionicons
                    name={subject.icon}
                    size={28}
                    color={subject.color}
                  />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-[10px] font-extrabold tracking-[1.4px] text-[#8992A6]">
                    {subject.code} · {subject.credits} CREDITS
                  </Text>
                  <Text className="mt-1 text-base font-extrabold text-[#202B49]">
                    {subject.name}
                  </Text>
                  <Text className="mt-1 text-[10px] text-[#8992A6]">
                    {subject.faculty}
                  </Text>
                </View>

                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F7F8FC]">
                  <Ionicons name="chevron-forward" size={19} color={C.navy} />
                </View>
              </View>

              {/* Description */}
              <Text className="mt-4 text-xs leading-5 text-[#8992A6]">
                {subject.description}
              </Text>

              {/* Resource breakdown */}
              <View className="mt-4 flex-row">
                <View className="mr-2 flex-1 flex-row items-center rounded-xl bg-[#F7F8FC] px-2.5 py-3">
                  <Ionicons name="layers-outline" size={15} color={C.blue} />
                  <Text className="ml-1.5 text-[10px] font-bold text-[#596782]">
                    {subject.topics} Topics
                  </Text>
                </View>

                <View className="mx-1 flex-1 flex-row items-center rounded-xl bg-[#F7F8FC] px-2.5 py-3">
                  <Ionicons name="document-text-outline" size={15} color={C.green} />
                  <Text className="ml-1.5 text-[10px] font-bold text-[#596782]">
                    {subject.notes} Notes
                  </Text>
                </View>

                <View className="ml-2 flex-1 flex-row items-center rounded-xl bg-[#F7F8FC] px-2.5 py-3">
                  <Ionicons name="documents-outline" size={15} color={C.purple} />
                  <Text className="ml-1.5 text-[10px] font-bold text-[#596782]">
                    {subject.pdfs + subject.presentations} Files
                  </Text>
                </View>
              </View>

              {/* Footer */}
              <View className="mt-4 flex-row items-center justify-between border-t border-[#F0F2F7] pt-3">
                <View className="flex-row items-center">
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        subject.progress > 0 ? '#259B78' : '#D99035',
                    }}
                  />
                  <Text className="ml-2 text-[10px] font-semibold text-[#8992A6]">
                    {subject.updated === 'Today'
                      ? 'Updated today'
                      : `Updated ${subject.updated}`}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Text className="mr-1.5 text-[11px] font-extrabold text-[#6478E8]">
                    Explore materials
                  </Text>
                  <Ionicons name="arrow-forward" size={15} color={C.blue} />
                </View>
              </View>
            </Pressable>
          ))}

          {/* EMPTY STATE */}
          {filteredSubjects.length === 0 && (
            <View className="items-center rounded-[25px] border border-[#E9EDF5] bg-white px-6 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF1FF]">
                <Ionicons name="search-outline" size={30} color={C.blue} />
              </View>

              <Text className="mt-4 text-base font-extrabold text-[#202B49]">
                No subjects found
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#8992A6]">
                Try another search term or change your selected filter.
              </Text>

              <Pressable
                onPress={() => {
                  setSearch('');
                }}
                className="mt-5 rounded-xl bg-[#EEF1FF] px-5 py-3"
              >
                <Text className="text-xs font-extrabold text-[#6478E8]">
                  Reset filters
                </Text>
              </Pressable>
            </View>
          )}

          {/* RECENTLY UPDATED */}
          <View className="mb-4 mt-7">
            <Text className="text-lg font-extrabold text-[#202B49]">
              Recently updated
            </Text>
            <Text className="mt-1 text-xs text-[#8992A6]">
              Latest learning resources added to your library
            </Text>
          </View>

          {recentResources.map((resource, index) => (
            <View
              key={index}
              className="mb-3 flex-row items-center rounded-[21px] border border-[#E9EDF5] bg-white p-3.5"
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: resource.bg }}
              >
                <Ionicons
                  name={resource.icon}
                  size={23}
                  color={resource.color}
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs font-extrabold text-[#202B49]">
                  {resource.title}
                </Text>
                <Text className="mt-1 text-[10px] text-[#8992A6]">
                  {resource.subject}
                </Text>
                <Text className="mt-1 text-[9px] font-bold" style={{ color: resource.color }}>
                  {resource.type}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-[9px] font-semibold text-[#8992A6]">
                  {resource.time}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={17}
                  color="#259B78"
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>
          ))}

          {/* FOOTER */}
          <View className="mb-2 mt-5 items-center">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white">
              <Ionicons
                name="school-outline"
                size={21}
                color={C.blue}
              />
            </View>
            <Text className="mt-2 text-[10px] font-bold text-[#8992A6]">
              CAMPUSOS · YOUR ACADEMIC COMPANION
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
