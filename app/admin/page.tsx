'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAttendance } from "@/lib/attendance-context";

// Utility function for formatting time
function formatTime(time: string, status: string) {
  if (status === 'Absent' || !time || time === '--:--') return '--:--';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const { records } = useAttendance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter records for stats
  const todayStats = mounted ? {
    total: records.filter(r => r.date === selectedDate).length,
    present: records.filter(r => r.date === selectedDate && r.status === 'Present').length,
    late: records.filter(r => r.date === selectedDate && r.status === 'Late').length,
    absent: records.filter(r => r.date === selectedDate && r.status === 'Absent').length
  } : {
    total: 0,
    present: 0,
    late: 0,
    absent: 0
  };

  const filteredRecords = mounted ? records.filter(record => {
    const matchesSearch = searchQuery === "" || 
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = selectedDate ? record.date === selectedDate : true;
    
    return matchesSearch && matchesDate;
  }) : [];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and monitor employee attendance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Attendance</CardTitle>
              <CardDescription>Today&apos;s attendance count</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{todayStats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Present</CardTitle>
              <CardDescription>
                {todayStats.present} On Time • {todayStats.late} Late
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {todayStats.present + todayStats.late}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Absent</CardTitle>
              <CardDescription>Employees absent today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>View and manage employee attendance</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="w-full md:w-64 bg-white border border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Input
                  type="date"
                  className="w-full md:w-48 bg-white border border-gray-200"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Photo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{record.name}</div>
                            <div className="text-gray-500">{record.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        <div>{record.date}</div>
                        <div>{mounted ? formatTime(record.time, record.status) : record.time}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {record.location ? (
                          <>
                            <div>Lat: {record.location.lat}</div>
                            <div>Long: {record.location.lng}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">Not Available</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {record.photo ? (
                          <img 
                            src={record.photo} 
                            alt={`${record.name}'s attendance`}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : record.status !== 'Absent' ? (
                          <div className="h-12 w-12 rounded bg-gray-200" />
                        ) : (
                          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-400">N/A</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'Present' ? "bg-green-100 text-green-800" :
                          record.status === 'Late' ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {filteredRecords.length} of {records.length} entries
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 