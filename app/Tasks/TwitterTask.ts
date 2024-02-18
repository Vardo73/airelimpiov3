import PurpleAirService from 'App/Services/PurpleAirService';
import TwitterService from 'App/Services/TwitterService';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'

export default class TwitterTask extends BaseTask {
  public static get schedule() {
    return ' 0 */15 * * * *'
  }
  
  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      const purpleAirService = await new PurpleAirService(); 
      const neighborhoodArr=await purpleAirService.taskQueryTwitter()

      if (!neighborhoodArr || neighborhoodArr.length === 0) {
        return;
      }

      let msg=`Se ha registrado un ascenso de la contaminaci\u00F3n del aire.\n`+
      `Para m\u00E1s informaci\u00F3n consulta airelimpiobcs.org.mx\n`+
      `#airelimpioBCS #monitoresCERCA #BCScalidaddeaire`

		  const twitterService= new TwitterService();

      await twitterService.post(msg)
    } catch (error) {
      console.log(error)
    }
  }
}
