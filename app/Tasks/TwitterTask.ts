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

      let neighborhoods=this.transformArray(neighborhoodArr)

      let msg=`Se registró un ascenso de la contaminaci\u00F3n en la(s) colonia(s) ${neighborhoods}.\n` 
					+`Para m\u00E1s informaci\u00F3n consulta airelimpiobcs.org.mx \n`
					+`#airelimpioBCS #monitoresCERCA #BCScalidaddeaire #elairedeBCS`

		  const twitterService= new TwitterService();

      await twitterService.post(msg)
    } catch (error) {
      console.log(error)
    }
  }


  private transformArray(arr): string {
    return arr.length === 0
      ? ""
      : arr.length === 1
      ? arr[0]
      : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`;
  }
}
