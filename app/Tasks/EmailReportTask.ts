import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class EmailReportTask extends BaseTask {
  public static get schedule() {
    return CronTimeV2.everySecond()
  }
  public static get useLock() {
    return false
  }

  public async handle() {
  }
}
