'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getUserRole, toggleUserRole } from "@/lib/mock-data";
import { useState, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRole(getUserRole());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleRoleToggle = () => {
    const newRole = toggleUserRole();
    setRole(newRole);
    window.location.href = newRole === "admin" ? "/admin" : "/";
  };

  const handleResetDemo = () => {
    if (window.confirm('This will clear all attendance records. Are you sure?')) {
      localStorage.removeItem('attendanceRecords');
      window.location.reload();
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              AttendanceMS
            </Link>
            <nav className="ml-8">
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/" ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    User Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === "/admin" ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              className="border-gray-200 hover:bg-gray-50 text-red-600 hover:text-red-700"
            >
              Reset Demo Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRoleToggle}
              className="border-gray-200 hover:bg-gray-50"
            >
              Switch to {role === "admin" ? "Employee" : "Admin"} View
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 