import PurpleAirService from 'App/Services/PurpleAirService';
import SendgridService from 'App/Services/SendgridService';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class EmailUsersTask extends BaseTask {
  public static get schedule() {
		return '0 */30 * * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      const purpleAirService = await new PurpleAirService(); 
      const users=await purpleAirService.taskQuery()

      if (!users || users.length === 0) {
        return;
      }

      const emailService= new SendgridService()

      emailService.sendEmailUsers(users)
    } catch (error) {
      console.log(error,'EmailUserTask.ts')
    }
  }
}
