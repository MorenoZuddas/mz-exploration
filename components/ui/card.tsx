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

type StatsType = 'total_runs' | 'pb_100' | 'pb_200' | 'pb_400' | 'pb_1000' | 'pb_2000' | 'pb_5000' | 'pb_10000' | 'pb_21000' | 'longest_run' | 'total_hours' | 'total_distance';

interface StatsCardProps {
  type: StatsType;
  activities?: any[];
  filters?: {
    dateFrom?: Date;
    dateTo?: Date;
    types?: string[];
    minDistance?: number;
    maxDistance?: number;
  };
  onPBClick?: (type: StatsType, activity: any) => void;
  className?: string;
  dataName?: string;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ type, activities = [], filters = {}, className, dataName, onPBClick }, ref) => {
    const filterActivities = (acts: any[]) => {
      return acts.filter(act => {
        const actDate = new Date(act.originalDate);
        if (filters.dateFrom && actDate < filters.dateFrom) return false;
        if (filters.dateTo && actDate > filters.dateTo) return false;
        if (filters.types && filters.types.length > 0 && !filters.types.includes(act.type)) return false;
        const distMeters = parseFloat(act.distance_km) * 1000;
        if (filters.minDistance && distMeters < filters.minDistance) return false;
        if (filters.maxDistance && distMeters > filters.maxDistance) return false;
        return true;
      });
    };

    const filteredActivities = filterActivities(activities);

    const calculateValue = () => {
      switch (type) {
        case 'total_runs':
          return filteredActivities.length;
        case 'total_distance':
          return filteredActivities.reduce((sum, a) => sum + parseFloat(a.distance_km || '0'), 0).toFixed(1) + ' km';
        case 'longest_run':
          const maxDist = Math.max(...filteredActivities.map(a => parseFloat(a.distance_km || '0')));
          return maxDist.toFixed(2) + ' km';
        case 'total_hours':
          const totalMinutes = filteredActivities.reduce((sum, a) => sum + (a.duration_min || 0), 0);
          return Math.round(totalMinutes / 60);
        case 'pb_100':
        case 'pb_200':
        case 'pb_400':
        case 'pb_1000':
        case 'pb_2000':
        case 'pb_5000':
        case 'pb_10000':
        case 'pb_21000':
          // Placeholder per PB - da implementare con logica split
          return 'N/A';
        default:
          return 0;
      }
    };

    const findActivityForStat = () => {
      switch (type) {
        case 'longest_run':
          if (filteredActivities.length === 0) return null;
          return filteredActivities.reduce((max, act) =>
            parseFloat(act.distance_km || '0') > parseFloat(max.distance_km || '0') ? act : max
          );
        case 'pb_100':
        case 'pb_200':
        case 'pb_400':
        case 'pb_1000':
        case 'pb_2000':
        case 'pb_5000':
        case 'pb_10000':
        case 'pb_21000':
          // Placeholder - trovare attività con miglior split per quella distanza
          return null; // Per ora null
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
