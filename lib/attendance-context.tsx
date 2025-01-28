'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface AttendanceRecord {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  location: { lat: string; lng: string } | null;
  status: 'Present' | 'Late' | 'Absent';
  department: string;
  photo?: string;
}

interface AttendanceContextType {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  getCurrentUserAttendance: (email: string) => AttendanceRecord | undefined;
}

function formatTimeToHHMM(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Initial mock data with static dates
const initialRecords: AttendanceRecord[] = [
  {
    id: 1,
    name: "Rajat Sharma",
    email: "rajat.sharma@company.com",
    date: "2024-01-29",
    time: "09:03",
    location: { lat: "28.6139° N", lng: "77.2090° E" },
    status: "Present",
    department: "Engineering"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@company.com",
    date: "2024-01-29",
    time: "08:57",
    location: { lat: "28.6129° N", lng: "77.2275° E" },
    status: "Present",
    department: "Design"
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@company.com",
    date: "2024-01-29",
    time: "09:12",
    location: { lat: "28.6271° N", lng: "77.2181° E" },
    status: "Present",
    department: "Marketing"
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha.singh@company.com",
    date: "2024-01-29",
    time: "10:15",
    location: { lat: "28.6519° N", lng: "77.2315° E" },
    status: "Late",
    department: "HR"
  },
  {
    id: 5,
    name: "Rahul Verma",
    email: "rahul.verma@company.com",
    date: "2024-01-29",
    time: "08:45",
    location: { lat: "28.6129° N", lng: "77.2295° E" },
    status: "Present",
    department: "Engineering"
  },
  {
    id: 6,
    name: "Ananya Gupta",
    email: "ananya.gupta@company.com",
    date: "2024-01-29",
    time: "--:--",
    location: null,
    status: "Absent",
    department: "Finance"
  }
];

// Create context
const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Provider component
export function AttendanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);

  useEffect(() => {
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (newRecord: Omit<AttendanceRecord, 'id' | 'date' | 'time' | 'status'>) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const record: AttendanceRecord = {
      ...newRecord,
      id: Math.max(0, ...records.map(r => r.id)) + 1,
      date: now.toISOString().split('T')[0],
      time: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
      status: currentHour < 9 || (currentHour === 9 && currentMinute <= 30) ? 'Present' : 'Late'
    };

    setRecords(prev => {
      // Remove any existing record for the same user on the same date
      const filtered = prev.filter(r => 
        !(r.email === record.email && r.date === record.date)
      );
      return [record, ...filtered];
    });
  };

  const getCurrentUserAttendance = (email: string) => {
    const today = new Date().toISOString().split('T')[0];
    return records.find(r => r.email === email && r.date === today);
  };

  return (
    <AttendanceContext.Provider value={{ records, addRecord, getCurrentUserAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
}

// Custom hook to use attendance context
export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
} 