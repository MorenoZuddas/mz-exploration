'use client';

import React, { useRef, useState } from 'react';
import { CalendarDays, Footprints, Ruler, Timer, MapPin, Gauge, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type FilterType =
  | 'dateStart'
  | 'dateEnd'
  | 'activityType'
  | 'distanceMin'
  | 'distanceMax'
  | 'durationMin'
  | 'durationMax'
  | 'location'
  | 'pace';

type FilterTone = 'current' | 'blue' | 'purple' | 'black';

export interface FilterConfig {
  type: FilterType;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface FilterState {
  [key: string]: string;
}

interface FilterProps {
  filters: FilterConfig[];
  onFilterChange: (state: FilterState) => void;
  onReset?: () => void;
  resetLabel?: string;
  applyLabel?: string;
  tone?: FilterTone;
  syncChannel?: string;
  disabled?: boolean;
  className?: string;
}

const filterTypeIcons: Record<FilterType, React.ComponentType<{ className?: string }>> = {
  dateStart: CalendarDays,
  dateEnd: CalendarDays,
  activityType: Footprints,
  distanceMin: Ruler,
  distanceMax: Route,
  durationMin: Timer,
  durationMax: Timer,
  location: MapPin,
  pace: Gauge,
};

const toneStyles: Record<FilterTone, { wrapper: string; field: string; text: string; icon: string; buttonTone: 'blue' | 'purple' | 'black' | 'current' }> = {
  current: {
    wrapper: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900',
    field: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-200',
    icon: 'text-slate-500 dark:text-slate-400',
    buttonTone: 'blue',
  },
  blue: {
    wrapper: 'border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30',
    field: 'border-blue-200 dark:border-blue-800/70 bg-white dark:bg-blue-950/20',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-300',
    buttonTone: 'blue',
  },
  purple: {
    wrapper: 'border-violet-200 dark:border-violet-800/60 bg-violet-50/70 dark:bg-violet-950/30',
    field: 'border-violet-200 dark:border-violet-800/70 bg-white dark:bg-violet-950/20',
    text: 'text-violet-800 dark:text-violet-200',
    icon: 'text-violet-600 dark:text-violet-300',
    buttonTone: 'purple',
  },
  black: {
    wrapper: 'border-slate-700 bg-slate-900',
    field: 'border-slate-600 bg-slate-800',
    text: 'text-slate-100',
    icon: 'text-slate-300',
    buttonTone: 'black',
  },
};

export function Filter({
  filters,
  onFilterChange,
  onReset,
  resetLabel = 'Reset',
  applyLabel = 'Applica',
  tone = 'current',
  syncChannel,
  disabled = false,
  className = '',
}: FilterProps) {
  const style = toneStyles[tone];
  const dateInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [filterState, setFilterState] = useState<FilterState>(
    filters.reduce((acc, f) => ({ ...acc, [f.type]: '' }), {})
  );

  const handleChange = (type: FilterType, value: string) => {
    const newState = { ...filterState, [type]: value };
    setFilterState(newState);
  };

  const handleApply = () => {
    onFilterChange(filterState);
    if (syncChannel) {
      window.dispatchEvent(new CustomEvent(`mz-filter:${syncChannel}`, { detail: filterState }));
    }
  };

  const handleReset = () => {
    const resetState = filters.reduce((acc, f) => ({ ...acc, [f.type]: '' }), {});
    setFilterState(resetState);
    onReset?.();
    onFilterChange(resetState);
    if (syncChannel) {
      window.dispatchEvent(new CustomEvent(`mz-filter:${syncChannel}`, { detail: resetState }));
    }
  };

  const renderFilterInput = (config: FilterConfig) => {
    const value = filterState[config.type] || '';
    const fieldLabel = (config.label || config.placeholder || '').toUpperCase();
    const Icon = filterTypeIcons[config.type] ?? CalendarDays;

    if (config.type === 'dateStart' || config.type === 'dateEnd') {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => dateInputRefs.current[config.type]?.showPicker?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              dateInputRefs.current[config.type]?.showPicker?.();
            }
          }}
          className={`rounded-lg border px-3 h-10 flex items-center justify-between gap-2 cursor-pointer ${style.field}`}
          aria-label={`Apri calendario ${fieldLabel}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={`w-4 h-4 shrink-0 ${style.icon}`} />
            <span className={`text-xs font-semibold tracking-wide truncate ${style.icon}`}>
              {value || fieldLabel}
            </span>
          </div>
          <input
            ref={(el) => {
              dateInputRefs.current[config.type] = el;
            }}
            type="date"
            value={value}
            onChange={(e) => handleChange(config.type, e.target.value)}
            disabled={disabled}
            className="sr-only"
          />
        </div>
      );
    }

    if (config.options) {
      return (
        <Select value={value} onValueChange={(v) => handleChange(config.type, v)} disabled={disabled}>
          <SelectTrigger className={`h-10 ${style.field} ${style.text}`}>
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${style.icon}`} />
              <SelectValue placeholder={fieldLabel} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {config.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    const inputType =
      config.type.includes('distance') || config.type === 'pace'
        ? 'number'
        : config.type.includes('duration')
          ? 'number'
          : 'text';

    return (
      <div className={`rounded-lg border px-3 h-10 flex items-center gap-2 ${style.field}`}>
        <Icon className={`w-4 h-4 shrink-0 ${style.icon}`} />
        <Input
          type={inputType}
          placeholder={fieldLabel}
          value={value}
          onChange={(e) => handleChange(config.type, e.target.value)}
          disabled={disabled}
          className={`border-0 bg-transparent shadow-none px-0 h-auto ${style.text}`}
        />
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-4 p-4 rounded-lg border ${style.wrapper} ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filters.map((filter) => (
          <div key={filter.type}>
            {renderFilterInput(filter)}
          </div>
        ))}
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" tone="black" onClick={handleReset} disabled={disabled}>
          {resetLabel}
        </Button>
        <Button tone={style.buttonTone} onClick={handleApply} disabled={disabled}>
          {applyLabel}
        </Button>
      </div>
    </div>
  );
}




