// Mock user data for demo
export const currentUser = {
  name: "Rajat Sharma",
  email: "rajat.sharma@company.com",
  department: "Engineering",
  role: "employee" // or "admin"
};

// Function to get user role from localStorage or default to the mock data
export function getUserRole(): "admin" | "employee" {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRole') as "admin" | "employee" || "employee";
  }
  return "employee";
}

// Function to toggle user role for demo purposes
export function toggleUserRole() {
  const currentRole = getUserRole();
  const newRole = currentRole === "admin" ? "employee" : "admin";
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', newRole);
  }
  return newRole;
} 