'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AddColumnTileProps {
  onAdd: (label: string) => void;
}

const PlusIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CheckIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon: React.FC<{ size?: number }> = ({ size = 13 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const AddColumnTile: React.FC<AddColumnTileProps> = ({ onAdd }) => {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setActive(false);
      return;
    }
    if (trimmed.length > 48) {
      toast.error('Column name must be 48 chars or fewer');
      return;
    }
    onAdd(trimmed);
    setValue('');
    setActive(false);
  };

  const cancel = () => {
    setValue('');
    setActive(false);
  };

  return (
    <motion.div
      layout="position"
      className="w-[85vw] snap-center shrink-0 md:w-[280px] md:snap-none md:shrink-0 flex flex-col h-full group/add-tile"
    >
      {/* Header row — mirrors TaskColumn header */}
      <div className="mb-3 px-1 -mt-1 py-1 flex items-center gap-2.5">
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
            active ? 'bg-primary' : 'bg-muted-foreground/40'
          }`}
        />
        {active ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancel();
            }}
            maxLength={48}
            placeholder="Column name"
            className="flex-1 min-w-0 font-display text-sm font-semibold text-foreground tracking-[-0.01em] bg-transparent border-b border-primary/50 outline-none px-0.5 placeholder:text-muted-foreground/40"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="flex-1 min-w-0 text-left truncate font-display text-sm font-semibold text-muted-foreground/50 tracking-[-0.01em] hover:text-foreground transition-colors"
            aria-label="Add column"
          >
            New Column
          </button>
        )}
        <button
          type="button"
          onClick={() => (active ? commit() : setActive(true))}
          aria-label={active ? 'Save column' : 'Add column'}
          className={`flex items-center justify-center w-6 h-6 rounded-md transition-colors flex-shrink-0 ${
            active
              ? 'text-primary hover:bg-primary/10'
              : 'text-muted-foreground/60 hover:text-primary hover:bg-primary/10'
          }`}
        >
          <PlusIcon />
        </button>
      </div>

      {/* Body — active create panel OR idle "+" tile */}
      {active ? (
        <motion.div
          key="active-body"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 flex flex-col rounded-xl border-2 border-dashed border-primary/30 bg-primary/[0.03] p-3 gap-3 min-h-0"
        >
          {/* Create + cancel buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={commit}
              disabled={!value.trim()}
              className="inline-flex items-center justify-center gap-1.5 flex-1 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckIcon size={12} />
              Create
            </button>
            <button
              type="button"
              onClick={cancel}
              aria-label="Cancel"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors flex-shrink-0"
            >
              <XIcon size={12} />
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-[10px] text-muted-foreground/60 select-none text-center">
            <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/40 text-[9px] font-mono">
              Enter
            </kbd>{' '}
            to save ·{' '}
            <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/40 text-[9px] font-mono">
              Esc
            </kbd>{' '}
            to cancel
          </p>

          {/* Ghost card preview */}
          <div className="flex-1 flex items-start justify-center pt-2 min-h-0">
            <div className="w-full rounded-xl border border-border/40 bg-card/40 p-3 opacity-50">
              <div className="h-3 rounded bg-muted/60 mb-2 w-2/3" />
              <div className="flex gap-1.5">
                <span className="h-3.5 w-10 rounded-md bg-muted/60" />
                <span className="h-3.5 w-10 rounded-md bg-muted/60" />
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <button
          key="idle-body"
          type="button"
          onClick={() => setActive(true)}
          className="flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 group-hover/add-tile:border-primary/40 bg-muted/20 hover:bg-muted/40 transition-colors p-1.5 cursor-pointer"
          aria-label="Add column"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/60 group-hover/add-tile:bg-primary/15 transition-colors mb-2"
          >
            <span className="text-muted-foreground/60 group-hover/add-tile:text-primary transition-colors">
              <PlusIcon size={20} />
            </span>
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground/60 group-hover/add-tile:text-foreground transition-colors">
            Add column
          </span>
        </button>
      )}
    </motion.div>
  );
};
