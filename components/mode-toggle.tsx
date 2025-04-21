'use client';

import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Plus, Pencil } from 'lucide-react';

interface ModeToggleProps {
  initialHasData: boolean;
}

export function ModeToggle({ initialHasData }: ModeToggleProps) {
  const [mode, setMode] = useState<'create' | 'edit'>(initialHasData ? 'edit' : 'create');
  const [hasData, setHasData] = useState(initialHasData);

  useEffect(() => {
    // Hydrate from localStorage after mount
    const apiResponse = localStorage.getItem('apiResponse');
    const dataExists = !!apiResponse;
    setHasData(dataExists);
    setMode(dataExists ? 'edit' : 'create');
  }, []);

  const handleCreateClick = () => {
    localStorage.removeItem('apiResponse');
    setMode('create');
    setHasData(false);
    
  };

  const handleEditClick = () => {
    if (hasData) {
      setMode('edit');
      localStorage.getItem('apiResponse')
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCreateClick}
        color={mode === 'create' ? 'primary' : 'default'}
        startContent={<Plus className="h-4 w-4" />}
        variant={mode === 'create' ? 'solid' : 'bordered'}
        size="sm"
        radius="full"
      >
        Create
      </Button>
      <Button
        onClick={handleEditClick}
        isDisabled={!hasData}
        color={mode === 'edit' ? 'primary' : 'default'}
        startContent={<Pencil className="h-4 w-4" />}
        variant={mode === 'edit' ? 'solid' : 'bordered'}
        size="sm"
        radius="full"
      >
        Read
      </Button>
    </div>
  );
}