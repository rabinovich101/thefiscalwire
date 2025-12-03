/**
 * News Import Scheduler
 * Runs automatically 4 times a day at Jerusalem time (Israel Standard Time)
 * Times: 07:00, 12:00, 17:00, 22:00
 */

const JERUSALEM_TIMEZONE = 'Asia/Jerusalem';
const IMPORT_HOURS = [7, 12, 17, 22]; // 4 times a day

let isSchedulerRunning = false;
let schedulerInterval: NodeJS.Timeout | null = null;

/**
 * Get current time in Jerusalem
 */
function getJerusalemTime(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: JERUSALEM_TIMEZONE }));
}

/**
 * Calculate milliseconds until next import time
 */
function getMsUntilNextImport(): { ms: number; hour: number } {
  const now = getJerusalemTime();

  // Find the next scheduled hour
  for (const hour of IMPORT_HOURS) {
    const next = new Date(now);
    next.setHours(hour, 0, 0, 0);

    if (now < next) {
      return { ms: next.getTime() - now.getTime(), hour };
    }
  }

  // All times passed today, schedule for first time tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(IMPORT_HOURS[0], 0, 0, 0);

  return { ms: tomorrow.getTime() - now.getTime(), hour: IMPORT_HOURS[0] };
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
  const { ms, hour } = getMsUntilNextImport();
  const hoursUntilNext = (ms / 1000 / 60 / 60).toFixed(2);

  console.log(`[Scheduler] Next import at ${hour}:00 Jerusalem time (in ${hoursUntilNext} hours)`);

  setTimeout(async () => {
    await triggerImport();
    // Schedule the next import
    scheduleNextImport();
  }, ms);
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
  console.log(`[Scheduler] Will import news 4 times daily at: ${IMPORT_HOURS.map(h => `${h}:00`).join(', ')} Jerusalem time`);

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
