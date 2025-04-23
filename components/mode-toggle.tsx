'use client';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Plus, Pencil } from 'lucide-react';

interface ModeToggleProps {
  initialHasData: boolean;
}

export function ModeToggle({ initialHasData }: ModeToggleProps) {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [hasData, setHasData] = useState(initialHasData);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const apiResponse = localStorage.getItem('apiResponse');
    const dataExists = !!apiResponse && apiResponse !== '""' && apiResponse !== '{}';
    setHasData(dataExists);

    // Check for forceCreateMode flag to ensure create mode after reload
    const forceCreateMode = localStorage.getItem('forceCreateMode');
    if (forceCreateMode === 'true') {
      setMode('create');
      localStorage.removeItem('forceCreateMode'); // Clear flag after use
      console.log('Set mode to create due to forceCreateMode');
    } else {
      // Always start in create mode, regardless of apiResponse
      setMode('create');
      console.log('Set mode to create on initial load/reload');
    }

    console.log('useEffect: hasData:', dataExists, 'apiResponse:', apiResponse);
  }, []);

  const handleCreateClick = () => {
    setIsCreating(true);
    localStorage.removeItem('apiResponse');
    localStorage.setItem('forceCreateMode', 'true'); // Set flag for reload
    setMode('create');
    setHasData(false);
    console.log('Create clicked: cleared apiResponse, set mode to create');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleEditClick = () => {
    if (hasData) {
      setMode('edit');
      const apiResponse = localStorage.getItem('apiResponse');
      console.log('Edit clicked: set mode to edit, apiResponse:', apiResponse);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCreateClick}
        isDisabled={isCreating}
        color={mode === 'create' ? 'primary' : 'default'}
        startContent={<Plus className="h-4 w-4" />}
        variant={mode === 'create' ? 'solid' : 'bordered'}
        size="sm"
        radius="full"
      >
        {isCreating ? 'Creating...' : 'Create'}
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