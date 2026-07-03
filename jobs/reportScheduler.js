const cron = require('node-cron');
const settingRepository = require('../repositories/setting.repository');
const mophNotifyService = require('../services/mophNotify.service');

class ReportScheduler {
  constructor() {
    this.cronJob = null;
    this.currentScheduleTime = null;
  }

  async start() {
    console.log('Initializing MOPH Notify Report Scheduler...');
    await this.reschedule();
  }

  async reschedule() {
    try {
      const settings = await settingRepository.getSettings();
      
      // Stop existing cron job if running
      if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob = null;
      }

      if (!settings.moph_notify_enabled) {
        console.log('MOPH Notify: Scheduler disabled in settings.');
        return;
      }

      const configuredTime = settings.moph_notify_time || '16:30';
      const [hour, minute] = configuredTime.split(':');
      
      // Cron format: min hour * * * (runs every day at hour:min)
      const cronExpression = `${minute} ${hour} * * *`;
      
      this.cronJob = cron.schedule(cronExpression, async () => {
        console.log(`MOPH Notify triggered by cron at ${configuredTime}`);
        const currentSettings = await settingRepository.getSettings();
        if (currentSettings.moph_notify_enabled) {
          await mophNotifyService.sendDailySummary(currentSettings);
        }
      });

      this.currentScheduleTime = configuredTime;
      console.log(`MOPH Notify: Scheduled to run every day at ${configuredTime}`);
      
    } catch (err) {
      console.error('Error in ReportScheduler.reschedule:', err);
    }
  }

  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('MOPH Notify: Scheduler stopped.');
    }
  }
}

module.exports = new ReportScheduler();
