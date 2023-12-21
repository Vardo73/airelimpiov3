import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class EmailUsersTask extends BaseTask {
  public static get schedule() {
		// Use CronTimeV2 generator:
    return CronTimeV2.everySecond()
		// or just use return cron-style string (simple cron editor: crontab.guru)
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmp/adonis5-scheduler/locks/your-class-name`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    this.logger.info('Handled')
    // Remove this promise and insert your code:
    await new Promise((res) => setTimeout(res, 2000))
  }
}
