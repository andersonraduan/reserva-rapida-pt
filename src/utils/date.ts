import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/pt';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.locale('pt');

export const DEFAULT_TIMEZONE = 'Europe/Lisbon';

export const formatDate = (date: string | Date, format = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, tz = DEFAULT_TIMEZONE): string => {
  return dayjs(date).tz(tz).format('DD/MM/YYYY HH:mm');
};

export const formatTime = (date: string | Date, tz = DEFAULT_TIMEZONE): string => {
  return dayjs(date).tz(tz).format('HH:mm');
};

export const isWithinHours = (date: string | Date, hours: number): boolean => {
  return dayjs(date).diff(dayjs(), 'hour') >= hours;
};

export const addMinutes = (date: string | Date, minutes: number): Date => {
  return dayjs(date).add(minutes, 'minute').toDate();
};

export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  duration: number,
  date: string,
  tz = DEFAULT_TIMEZONE
): Array<{ start: Date; end: Date }> => {
  const slots: Array<{ start: Date; end: Date }> = [];
  const baseDate = dayjs.tz(date, tz);
  
  const start = baseDate
    .hour(parseInt(startTime.split(':')[0]))
    .minute(parseInt(startTime.split(':')[1]))
    .second(0);
  
  const end = baseDate
    .hour(parseInt(endTime.split(':')[0]))
    .minute(parseInt(endTime.split(':')[1]))
    .second(0);

  let current = start;
  
  while (current.add(duration, 'minute').isSameOrBefore(end)) {
    slots.push({
      start: current.toDate(),
      end: current.add(duration, 'minute').toDate(),
    });
    current = current.add(duration, 'minute');
  }

  return slots;
};

export const addDays = (date: Date, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate();
};

export const isValidRescheduleTime = (timeString: string): boolean => {
  const slotTime = dayjs(timeString);
  const now = dayjs();
  const minTime = now.add(24, 'hour'); // 24h from now
  return slotTime.isAfter(minTime);
};