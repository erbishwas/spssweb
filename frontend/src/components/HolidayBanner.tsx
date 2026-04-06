import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Holiday {
  id: number;
  name: string;
  description: string;
  start_date_nepali: string;
  end_date_nepali: string;
}

const HolidayBanner: React.FC = () => {
  const [holiday, setHoliday] = useState<Holiday | null>(null);

  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DYNAMIC_URL}/api/holiday/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.holidays && data.holidays.length > 0) {
          setHoliday(data.holidays[0]);
        }
      });
  }, []);

  if (!holiday) return null;

  const showDate =
    holiday.start_date_nepali === holiday.end_date_nepali
      ? holiday.start_date_nepali
      : `${holiday.start_date_nepali} - ${holiday.end_date_nepali}`;

  const backgroundColor = prefersDarkMode
    ? 'linear-gradient(to right, #0f172a, #1e293b)' // dark festive
    : 'linear-gradient(to right, #facc15, #f97316)'; // bright festive

  return (
    <div
      style={{
        background: backgroundColor,
        color: prefersDarkMode ? '#fefce8' : '#1f2937',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        padding: '10px 0',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          animation: 'slide-left 15s linear infinite',
          paddingLeft: '100%',
        }}
      >
        🎉 <strong>Public Holiday:</strong> {holiday.name} ({showDate}): {holiday.description}
      </div>

      {/* Add keyframes inside style tag */}
      <style>{`
        @keyframes slide-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default HolidayBanner;
