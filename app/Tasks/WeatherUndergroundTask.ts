
import WeatherUndergroundService from 'App/Services/WeatherUndergroundService';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class PurpleAirTask extends BaseTask {
  public static get schedule() {
    return '0 10 * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const weatherUndergroundService = await new WeatherUndergroundService(); 
    await weatherUndergroundService.queryCurrentHour()
  }
}