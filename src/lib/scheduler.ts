/**
 * News Import Scheduler
 * Runs automatically at 13:00 Jerusalem time (Israel Standard Time) every day
 */

const JERUSALEM_TIMEZONE = 'Asia/Jerusalem';
const IMPORT_HOUR = 13; // 13:00 Jerusalem time
const IMPORT_MINUTE = 0;

let isSchedulerRunning = false;
let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Get current time in Jerusalem
 */
function getJerusalemTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: JERUSALEM_TIMEZONE }));
}

/**
 * Calculate milliseconds until next 13:00 Jerusalem time
 */
function getMsUntilNextImport(): number {
  const now = getJerusalemTime();
  const next = new Date(now);

  next.setHours(IMPORT_HOUR, IMPORT_MINUTE, 0, 0);

  // If it's already past 13:00 today, schedule for tomorrow
  if (now >= next) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
}

/**
 * Trigger the news import
 */
async function triggerImport(): Promise<void> {
  const jerusalemTime = getJerusalemTime();
  console.log(`[Scheduler] Triggering news import at ${jerusalemTime.toLocaleString()} Jerusalem time`);

  try {
    // Call the import API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : 'http://localhost:3000';

    const secret = process.env.CRON_SECRET;
    const url = secret
      ? `${baseUrl}/api/cron/import-news?secret=${secret}`
      : `${baseUrl}/api/cron/import-news`;

    console.log(`[Scheduler] Calling ${baseUrl}/api/cron/import-news`);

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      console.log(`[Scheduler] Import successful:`, data);
    } else {
      console.error(`[Scheduler] Import failed:`, data);
    }
  } catch (error) {
    console.error(`[Scheduler] Error triggering import:`, error);
  }
}

/**
 * Schedule the next import
 */
function scheduleNextImport(): void {
  const msUntilNext = getMsUntilNextImport();
  const hoursUntilNext = (msUntilNext / 1000 / 60 / 60).toFixed(2);

  console.log(`[Scheduler] Next import in ${hoursUntilNext} hours`);

  setTimeout(async () => {
    await triggerImport();
    // Schedule the next day's import
    scheduleNextImport();
  }, msUntilNext);
}

/**
 * Start the scheduler
 */
export function startScheduler(): void {
  if (isSchedulerRunning) {
    console.log('[Scheduler] Already running');
    return;
  }

  isSchedulerRunning = true;
  const jerusalemTime = getJerusalemTime();
  console.log(`[Scheduler] Started at ${jerusalemTime.toLocaleString()} Jerusalem time`);
  console.log(`[Scheduler] Will import news daily at ${IMPORT_HOUR}:00 Jerusalem time`);

  scheduleNextImport();
}

/**
 * Stop the scheduler
 */
export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  isSchedulerRunning = false;
  console.log('[Scheduler] Stopped');
}
