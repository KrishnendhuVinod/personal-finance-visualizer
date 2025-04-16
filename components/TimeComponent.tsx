'use client';

import { useEffect, useState } from 'react';

export default function TimeComponent() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date().toLocaleTimeString());
  }, []);

  if (!now) return null; // Don't render until time is available

  return <p>Current Time: {now}</p>;
}
