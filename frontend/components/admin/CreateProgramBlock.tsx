'use client';

import { useState, useRef } from 'react';
import { createProgram } from '@/services/apiServices';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

const PROGRAM_TYPES = ['Graduate Program', 'Diploma Program'];

export function CreateProgramBlock({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (program: any) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState(PROGRAM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasChanges = name.trim() !== '' || description.trim() !== '' || history.trim() !== '' || photoFile !== null;

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscard(true);
    } else {
      onCancel();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async () => {
    setError(null);
    if (!name.trim() || !description.trim() || !history.trim()) {
      setError('Name, description, and history are required.');
      return;
    }
    setIsSaving(true);
    try {
      const program = await createProgram({ type, name, description, history, photoFile });
      onCreated(program);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Create New Graduate Program
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-6">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
              placeholder="Name of Program"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 flex-1 border border-[var(--line)] bg-[var(--page-bg)] px-3 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            >
              {PROGRAM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 min-h-[100px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="About Graduate Program..."
          />
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            className="flex-1 min-h-[100px] resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Program History..."
          />
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="col-span-1 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[var(--line)] bg-[var(--surface-muted)] p-4 text-center transition hover:border-[var(--up-maroon)] overflow-hidden"
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-muted)]">Featured Photo</span>
              <span className="mt-1 text-xs text-[var(--up-maroon)]">Click to upload</span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      {error && <p className="mb-4 text-xs text-red-600">{error}</p>}

      {showDiscard && (
        <ConfirmDialog
          title="Discard Changes?"
          message="You have unsaved changes. Are you sure you want to discard them?"
          confirmLabel="Discard"
          cancelLabel="Keep Editing"
          confirmClassName="border border-[var(--up-maroon)] bg-[var(--up-maroon)] px-6 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] disabled:opacity-50"
          onConfirm={onCancel}
          onCancel={() => setShowDiscard(false)}
        />
      )}

      <div className="flex justify-end gap-4 border-t border-[var(--line)] pt-6">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="border border-[var(--text-muted)] px-8 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[var(--up-maroon)] border border-[var(--up-maroon)] px-10 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#5c0709] disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </section>
  );
}
