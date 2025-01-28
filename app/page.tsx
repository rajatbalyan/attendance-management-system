'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceModal } from "@/components/attendance-modal";
import { useAttendance } from "@/lib/attendance-context";
import { currentUser } from "@/lib/mock-data";

export default function UserDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCurrentUserAttendance } = useAttendance();

  const todayAttendance = getCurrentUserAttendance(currentUser.email);
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-gray-500 mt-2">{formattedDate}</p>
        </div>

        {/* Mark Attendance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>
              Your location and photo will be captured to mark your attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsModalOpen(true)}
              disabled={!!todayAttendance}
              className="w-full md:w-auto"
            >
              {todayAttendance ? 'Attendance Already Marked' : 'Mark Attendance'}
            </Button>
            {todayAttendance && (
              <p className="text-sm text-gray-500 mt-2">
                You have already marked your attendance for today at {todayAttendance.time}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your attendance history for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-gray-500">
                      Marked at {todayAttendance.time} • {todayAttendance.location?.lat}, {todayAttendance.location?.lng}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    todayAttendance.status === 'Present' ? 'bg-green-100 text-green-800' :
                    todayAttendance.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {todayAttendance.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No attendance records found for today
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={currentUser.name}
        userEmail={currentUser.email}
        department={currentUser.department}
      />
    </main>
  );
}
