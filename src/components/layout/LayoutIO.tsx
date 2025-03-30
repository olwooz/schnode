'use client';

import { useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { AlertCircle, Download, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { componentsAtom } from '@/atoms/component';
import {
  downloadLayout,
  readLayoutFile,
  deserializeLayout,
} from '@/utils/layout-io';
import { CanvasComponent } from '@/types/dnd';

export function LayoutIO() {
  const [components, setComponents] = useAtom(componentsAtom);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [importedComponents, setImportedComponents] = useState<
    CanvasComponent[] | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    if (components.length === 0) {
      alert('There are no components to export.');
      return;
    }
    downloadLayout(components);
  }

  function handleImportClick() {
    setErrorMessage('');
    setIsImportDialogOpen(true);
  }

  function closeImportDialog() {
    setIsImportDialogOpen(false);
    setErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    setErrorMessage('');

    try {
      const file = e.target.files[0];
      const content = await readLayoutFile(file);
      deserializeLayout(content);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to parse layout file'
      );
    }
  }

  async function handleImport() {
    if (
      !fileInputRef.current?.files ||
      fileInputRef.current.files.length === 0
    ) {
      setErrorMessage('Please select a file to import');
      return;
    }

    try {
      const file = fileInputRef.current.files[0];
      const content = await readLayoutFile(file);
      const parsedComponents = deserializeLayout(content);

      if (components.length > 0) {
        setImportedComponents(parsedComponents);
        setIsConfirmDialogOpen(true);
        return;
      }

      setComponents(parsedComponents);
      closeImportDialog();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to import layout'
      );
    }
  }

  function handleConfirmImport() {
    if (importedComponents) {
      setComponents(importedComponents);
      setImportedComponents(null);
      setIsConfirmDialogOpen(false);
      closeImportDialog();
    }
  }

  function handleCancelImport() {
    setImportedComponents(null);
    setIsConfirmDialogOpen(false);
  }

  return (
    <>
      <TooltipProvider>
        <div className='flex space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='default' size='icon' onClick={handleExport}>
                <Upload className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export layout as JSON file</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='default' size='icon' onClick={handleImportClick}>
                <Download className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Import layout from JSON file</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load Layout</DialogTitle>
            <DialogDescription>
              Upload a JSON file to load a previously exported layout. This will
              replace your current layout.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='file'>Select Layout File</Label>
              <Input
                ref={fileInputRef}
                id='file'
                type='file'
                accept='.json'
                onChange={handleFileChange}
              />
            </div>

            {errorMessage && (
              <div className='flex items-center gap-2 text-sm text-destructive'>
                <AlertCircle className='h-4 w-4' />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={closeImportDialog}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace Current Layout?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will replace your current layout with the imported
              one. This cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelImport}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
