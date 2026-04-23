import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    dataName?: string;
    variant?: 'default' | 'horizontal' | 'vertical' | 'stats';
  }
>(({ className, dataName, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      variant === 'horizontal' && "flex flex-row",
      variant === 'vertical' && "flex flex-col",
      variant === 'stats' && "text-center p-6",
      className
    )}
    data-name={dataName}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

type StatsType =
  | 'total_runs'
  | 'pb_100'
  | 'pb_200'
  | 'pb_400'
  | 'pb_1000'
  | 'pb_2000'
  | 'pb_5000'
  | 'pb_10000'
  | 'pb_21000'
  | 'longest_run'
  | 'total_hours'
  | 'total_distance';

interface StatsActivity {
  type?: string;
  originalDate?: string;
  date?: string | null;
  distance_km?: string;
  distance_m?: number | null;
  duration_min?: number;
  duration_sec?: number | null;
}

interface StatsCardProps {
  type: StatsType;
  activities?: StatsActivity[];
  filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    types?: string[];
    minDistance?: number;
    maxDistance?: number;
  };
  onPBClick?: (type: StatsType, activity: StatsActivity) => void;
  className?: string;
  dataName?: string;
}

function safeDate(activity: StatsActivity): Date {
  const source = activity.originalDate ?? activity.date ?? null;
  const d = source ? new Date(source) : new Date(0);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

function safeDistanceMeters(activity: StatsActivity): number {
  if (typeof activity.distance_m === 'number' && Number.isFinite(activity.distance_m)) {
    return activity.distance_m;
  }

  if (typeof activity.distance_km === 'string') {
    const km = Number.parseFloat(activity.distance_km);
    if (Number.isFinite(km)) return km * 1000;
  }

  return 0;
}

function safeDurationMinutes(activity: StatsActivity): number {
  if (typeof activity.duration_min === 'number' && Number.isFinite(activity.duration_min)) {
    return activity.duration_min;
  }

  if (typeof activity.duration_sec === 'number' && Number.isFinite(activity.duration_sec)) {
    return activity.duration_sec / 60;
  }

  return 0;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ type, activities = [], filters = {}, className, dataName, onPBClick }, ref) => {
    const filterActivities = (acts: StatsActivity[]): StatsActivity[] => {
      return acts.filter((act) => {
        const actDate = safeDate(act);
        if (filters.dateFrom && actDate < filters.dateFrom) return false;
        if (filters.dateTo && actDate > filters.dateTo) return false;
        if (filters.types && filters.types.length > 0 && !filters.types.includes(act.type ?? '')) return false;

        const distMeters = safeDistanceMeters(act);
        if (typeof filters.minDistance === 'number' && distMeters < filters.minDistance) return false;
        if (typeof filters.maxDistance === 'number' && distMeters > filters.maxDistance) return false;

        return true;
      });
    };

    const filteredActivities = filterActivities(activities);

    const calculateValue = () => {
      switch (type) {
        case 'total_runs':
          return filteredActivities.length;
        case 'total_distance': {
          const totalKm = filteredActivities.reduce((sum, a) => sum + safeDistanceMeters(a) / 1000, 0);
          return `${totalKm.toFixed(1)} km`;
        }
        case 'longest_run': {
          const maxDistMeters = filteredActivities.reduce((max, a) => {
            const current = safeDistanceMeters(a);
            return current > max ? current : max;
          }, 0);
           return `${(maxDistMeters / 1000).toFixed(2)} km`;
         }
        case 'total_hours': {
          const totalMinutes = filteredActivities.reduce((sum, a) => sum + safeDurationMinutes(a), 0);
          return Math.round(totalMinutes / 60);
        }
        case 'pb_100':
        case 'pb_200':
        case 'pb_400':
        case 'pb_1000':
        case 'pb_2000':
        case 'pb_5000':
        case 'pb_10000':
        case 'pb_21000':
          return 'N/A';
        default:
          return 0;
      }
    };

    const findActivityForStat = (): StatsActivity | null => {
      switch (type) {
        case 'longest_run':
          if (filteredActivities.length === 0) return null;
          return filteredActivities.reduce((max, act) =>
            safeDistanceMeters(act) > safeDistanceMeters(max) ? act : max
          );
        case 'pb_100':
        case 'pb_200':
        case 'pb_400':
        case 'pb_1000':
        case 'pb_2000':
        case 'pb_5000':
        case 'pb_10000':
        case 'pb_21000':
          return null;
        default:
          return null;
      }
    };

    const getTitle = () => {
      switch (type) {
        case 'total_runs': return 'Corse Totali';
        case 'total_distance': return 'Distanza Percorsa';
        case 'longest_run': return 'Run Più Lunga';
        case 'total_hours': return 'Ore di Corsa';
        case 'pb_100': return 'PB 100m';
        case 'pb_200': return 'PB 200m';
        case 'pb_400': return 'PB 400m';
        case 'pb_1000': return 'PB 1000m';
        case 'pb_2000': return 'PB 2000m';
        case 'pb_5000': return 'PB 5000m';
        case 'pb_10000': return 'PB 10000m';
        case 'pb_21000': return 'PB 21000m';
        default: return '';
      }
    };

    const value = calculateValue();
    const isClickable = ['longest_run', 'pb_100', 'pb_200', 'pb_400', 'pb_1000', 'pb_2000', 'pb_5000', 'pb_10000', 'pb_21000'].includes(type);
    const activityForStat = findActivityForStat();

    const handleClick = () => {
      if (isClickable && activityForStat && onPBClick) {
        onPBClick(type, activityForStat);
      }
    };

    return (
      <Card
        ref={ref}
        variant="stats"
        className={cn(className, isClickable && "cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors")}
        dataName={dataName}
        onClick={handleClick}
      >
        <p className="text-sm text-muted-foreground mb-2">{getTitle()}</p>
        <p className="text-3xl font-bold">{value}</p>
      </Card>
    );
  }
);
StatsCard.displayName = "StatsCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatsCard }
