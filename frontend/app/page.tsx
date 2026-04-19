//TEST

"use client"; // Marks this as a Client Component to use React hooks
import { useEffect, useState } from "react";

// Define the type based on your Prisma schema
type College = {
  college_id: number;
  name: string;
  dean: string;
};

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Make sure this matches your Express server's port and route
    fetch("http://localhost:3001/colleges") 
      .then((res) => {
        if (!res.ok) throw new Error("Failed to connect to backend");
        return res.json();
      })
      .then((data) => {
        setColleges(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="p-12">
      <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
      
      {loading && <p>Connecting to Express backend...</p>}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
      
      {!loading && !error && (
        <ul className="space-y-4">
          {colleges.length === 0 ? (
            <p>Connection successful, but no colleges found in database.</p>
          ) : (
            colleges.map((college) => (
              <li key={college.college_id} className="p-4 bg-gray-100 rounded-md shadow">
                <p className="font-semibold text-lg">{college.name}</p>
                <p className="text-sm text-gray-600">Dean: {college.dean}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </main>
  );
}