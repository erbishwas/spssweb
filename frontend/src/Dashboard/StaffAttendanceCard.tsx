import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StaffAttendance } from './interfaces';

interface StaffAttendanceCardProps {
  staffData: StaffAttendance;
}

const StaffAttendanceCard: React.FC<StaffAttendanceCardProps> = ({ staffData }) => {
  const attending = staffData.active_staff;
  const notAttending = staffData.total_staff - attending;

  const data = [
    { name: 'Attending', value: attending, color: '#4ade80' },
    { name: 'Not Attending', value: notAttending, color: '#f87171' }
  ];

  const percentage = (attending / staffData.total_staff) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-700/50 p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Staff Attendance
        <span className={`ml-2 text-sm font-normal px-2 py-1 rounded-full ${
          percentage >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          percentage >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {percentage.toFixed(1)}% Attending
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Total Staff</h4>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {staffData.total_staff}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Attending</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {attending}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Not Attending</h4>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {notAttending}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendanceCard;
