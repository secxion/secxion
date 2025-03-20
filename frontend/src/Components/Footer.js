import React, { useState, useEffect } from "react";

const timezones = [
  { label: "Local Time", value: "local" },
  { label: "UTC (Universal Time)", value: "UTC" },
  { label: "GMT (Greenwich Mean Time)", value: "GMT" },

  // African Time Zones
  { label: "Nigeria (WAT)", value: "Africa/Lagos" },
  { label: "Ghana (GMT)", value: "Africa/Accra" },
  { label: "South Africa (SAST)", value: "Africa/Johannesburg" },
  { label: "Egypt (EET)", value: "Africa/Cairo" },
  { label: "Kenya (EAT)", value: "Africa/Nairobi" },

  // American Time Zones
  { label: "New York (EST)", value: "America/New_York" },
  { label: "Los Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Chicago (CST)", value: "America/Chicago" },
  { label: "Mexico City (CST)", value: "America/Mexico_City" },
  { label: "São Paulo (BRT)", value: "America/Sao_Paulo" },

  // European Time Zones
  { label: "London (GMT)", value: "Europe/London" },
  { label: "Berlin (CET)", value: "Europe/Berlin" },
  { label: "Paris (CET)", value: "Europe/Paris" },
  { label: "Moscow (MSK)", value: "Europe/Moscow" },

  // Asian Time Zones
  { label: "Dubai (GST)", value: "Asia/Dubai" },
  { label: "India (IST)", value: "Asia/Kolkata" },
  { label: "China (CST)", value: "Asia/Shanghai" },
  { label: "Japan (JST)", value: "Asia/Tokyo" },
  { label: "South Korea (KST)", value: "Asia/Seoul" },

  // Australia & Pacific
  { label: "Sydney (AEST)", value: "Australia/Sydney" },
  { label: "New Zealand (NZST)", value: "Pacific/Auckland" },

  // GMT Offsets
  { label: "GMT-12", value: "Etc/GMT-12" },
  { label: "GMT-11", value: "Etc/GMT-11" },
  { label: "GMT-10 (Hawaii)", value: "Pacific/Honolulu" },
  { label: "GMT-9", value: "Etc/GMT-9" },
  { label: "GMT-8 (PST)", value: "Etc/GMT-8" },
  { label: "GMT-7 (MST)", value: "Etc/GMT-7" },
  { label: "GMT-6 (CST)", value: "Etc/GMT-6" },
  { label: "GMT-5 (EST)", value: "Etc/GMT-5" },
  { label: "GMT-4", value: "Etc/GMT-4" },
  { label: "GMT-3", value: "Etc/GMT-3" },
  { label: "GMT-2", value: "Etc/GMT-2" },
  { label: "GMT-1", value: "Etc/GMT-1" },
  { label: "GMT+1 (WAT)", value: "Etc/GMT+1" },
  { label: "GMT+2 (SAST, EET)", value: "Etc/GMT+2" },
  { label: "GMT+3 (EAT, MSK)", value: "Etc/GMT+3" },
  { label: "GMT+4", value: "Etc/GMT+4" },
  { label: "GMT+5", value: "Etc/GMT+5" },
  { label: "GMT+6", value: "Etc/GMT+6" },
  { label: "GMT+7", value: "Etc/GMT+7" },
  { label: "GMT+8", value: "Etc/GMT+8" },
  { label: "GMT+9", value: "Etc/GMT+9" },
  { label: "GMT+10", value: "Etc/GMT+10" },
  { label: "GMT+11", value: "Etc/GMT+11" },
  { label: "GMT+12", value: "Etc/GMT+12" },
];
const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(
    localStorage.getItem("selectedTimezone") || "local"
  );
  const [userLocation, setUserLocation] = useState({
    ip: "Fetching...",
    country: "Detecting...",
    city: "Loading...",
    timezone: "",
  });

  // Fetch user's IP and Location
  useEffect(() => {
    const fetchUserIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/"); // Alternative: https://ipinfo.io/json
        const data = await response.json();
        
        setUserLocation({
          ip: data.ip,
          country: data.country_name,
          city: data.city,
          timezone: data.timezone,
        });

        // Auto-set timezone if it's empty in localStorage
        if (!localStorage.getItem("selectedTimezone") && data.timezone) {
          setSelectedTimezone(data.timezone);
          localStorage.setItem("selectedTimezone", data.timezone);
        }
      } catch (error) {
        console.error("Error fetching IP and location:", error);
      }
    };

    fetchUserIP();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle timezone change
  const handleTimezoneChange = (event) => {
    const newTimezone = event.target.value;
    setSelectedTimezone(newTimezone);
    localStorage.setItem("selectedTimezone", newTimezone);
  };

  // Format time based on selected timezone
  const formatTime = () => {
    if (selectedTimezone === "local") {
      return currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    return new Intl.DateTimeFormat("en-US", {
      timeZone: selectedTimezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(currentTime);
  };

  return (
    <footer className="bottom-0 w-full bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs md:text-sm py-4 border-t border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="font-medium tracking-wide">
          {formatTime()} — {currentTime.toDateString()}
        </p>

        {/* User Location & IP */}
        <p className="text-gray-500 text-xs">
          🌍 {userLocation.city}, {userLocation.country} | IP: {userLocation.ip}
        </p>

        {/* Timezone Selector */}
        <div className="mt-2 md:mt-0">
          <select
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 border border-gray-400 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
