"use client";

import { useState } from 'react';

export default function TestPage() {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  const handleSave = (data: any) => {
    console.log('Saved:', data);
  };

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {/* We'll import and test the RecordSessionModal here */}
    </div>
  );
}