'use client';

import { useState, useRef } from 'react';
import { updateProgramApplication } from '@/services/apiServices';

type ProgramApplication = {
  qualifications?: string;
  application_instructions?: string;
  application_requirements?: string;
  application_url?: string;
  recommendation_url?: string;
  fees_url?: string;
};

type Props = {
  programId: number;
  application?: ProgramApplication;
};

type FileFieldKey = 'application_url' | 'recommendation_url' | 'fees_url';

const FILE_FIELDS: { key: FileFieldKey; label: string }[] = [
  { key: 'application_url', label: 'Application Form (PDF)' },
  { key: 'recommendation_url', label: 'Recommendation Form (PDF)' },
  { key: 'fees_url', label: 'Fees Schedule (PDF)' },
];

function PdfUploadField({
  label,
  fieldKey,
  existingUrl,
  file,
  onChange,
}: {
  label: string;
  fieldKey: FileFieldKey;
  existingUrl?: string;
  file: File | null;
  onChange: (key: FileFieldKey, file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = file
    ? file.name
    : existingUrl
      ? existingUrl.split('/').pop()
      : null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`flex h-12 cursor-pointer items-center justify-between border px-4 transition hover:border-[var(--up-maroon)] ${displayName
          ? 'border-[var(--up-gold)] bg-amber-50'
          : 'border-dashed border-[var(--line)] bg-[var(--page-bg)]'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-6 w-6 items-center justify-center text-[0.55rem] font-bold ${displayName ? 'bg-[var(--up-maroon)] text-white' : 'bg-gray-200 text-gray-500'}`}>
            PDF
          </div>
          <span className="text-sm text-[var(--text-secondary)] truncate max-w-[280px]">
            {displayName ?? 'Click to upload PDF file'}
          </span>
        </div>
        {displayName && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onChange(fieldKey, null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="ml-2 text-xs text-red-400 hover:text-red-700"
          >
            ×
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          onChange(fieldKey, selected);
        }}
      />
      {existingUrl && !file && (
        <a
          href={existingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[0.65rem] text-[var(--up-maroon)] underline hover:opacity-70"
        >
          View current file ↗
        </a>
      )}
    </div>
  );
}

export function ApplicationSection({ programId, application }: Props) {
  const [qualifications, setQualifications] = useState(application?.qualifications ?? '');
  const [instructions, setInstructions] = useState(application?.application_instructions ?? '');
  const [requirements, setRequirements] = useState(application?.application_requirements ?? '');
  const [files, setFiles] = useState<Record<FileFieldKey, File | null>>({
    application_url: null,
    recommendation_url: null,
    fees_url: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (key: FileFieldKey, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };
  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setIsSaving(true);
    try {
      await updateProgramApplication(programId, {
        qualifications,
        application_instructions: instructions,
        application_requirements: requirements,
        application_url: files.application_url,
        recommendation_url: files.recommendation_url,
        fees_url: files.fees_url,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[var(--up-gold)]"></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
          Edit Application Information
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Text fields */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Qualifications
          </label>
          <textarea
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            className="min-h-[120px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter qualifications..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Application Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="min-h-[120px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter application instructions..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Requirements
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="min-h-[120px] w-full resize-none border border-[var(--line)] bg-[var(--page-bg)] p-4 text-sm focus:border-[var(--up-gold)] focus:outline-none"
            placeholder="Enter requirements..."
          />
        </div>

        {/* PDF Upload fields */}
        <div className="border-t border-[var(--line)] pt-6">
          <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Downloadable Files
          </p>
          <div className="flex flex-col gap-4">
            {FILE_FIELDS.map(({ key, label }) => (
              <PdfUploadField
                key={key}
                label={label}
                fieldKey={key}
                existingUrl={application?.[key]}
                file={files[key]}
                onChange={handleFileChange}
              />
            ))}
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <p className="text-xs font-semibold text-red-600">{error}</p>
        )}
        {success && (
          <p className="text-xs font-semibold text-green-600">Application information saved successfully.</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4 border-t border-[var(--line)] pt-6">
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
