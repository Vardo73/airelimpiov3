import PurpleAirService from 'App/Services/PurpleAirService';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class PurpleAirTask extends BaseTask {
  public static get schedule() {
    return '0 10 * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    //const purpleAirService = await new PurpleAirService(); 
    //await purpleAirService.queryCurrentHour()
  }
}
