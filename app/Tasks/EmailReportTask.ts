import Datum from 'App/Models/Datum';
import Monitor from 'App/Models/Monitor';
import Database from '@ioc:Adonis/Lucid/Database';
import SendgridService from 'App/Services/SendgridService';
import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'
import { ReportEmail } from 'App/Interfaces/PurpleAirInterface';
const MODEL_PURPLE='PURPLE_AIR'

export default class EmailReportTask extends BaseTask {
  public static get schedule() {
    return '0 39 * * * *'
    return '0 0 8 * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      const monitors=await Monitor.query()
      .preload('model')
      .preload('neighborhood')
      .whereHas('model', (query) => {
          query.where('name', MODEL_PURPLE);
      })
      .where('active', true)
      .exec();
      
      let info_general:ReportEmail[]=[]

      let promess=monitors.map(async monitor =>{

        const data= await Datum.query()
        .where('monitor_id', monitor.id)
        .where('created_at', '>=', Database.raw('CURDATE() - INTERVAL 1 DAY'))
        .where('created_at', '<', Database.raw('CURDATE()'))
        .exec();

        let pm2:number[]=[]
        let pm10:number[]=[]

        data.map(d=>{
          if(d.type_id==1) pm2.push(d.average)
          if(d.type_id==2) pm10.push(d.average)
        })

        let pm2_average = (pm2.reduce((total, value) => total + value, 0) / pm2.length).toFixed(2);
        let pm10_average = (pm10.reduce((total, value) => total + value, 0) / pm10.length).toFixed(2);
        let percentage= ((pm2.length/24)*100).toFixed(2);

        let info={
          monitor:monitor.name,
          neighborhood:monitor.neighborhood.name,
          pm2_average:parseFloat(pm2_average),
          pm10_average:parseFloat(pm10_average),
          percentage:parseFloat(percentage)
        }
        info_general.push(info) 
      })

      await Promise.all(promess);

      const emailService= new SendgridService()

      emailService.sendEmailReport(info_general)

    } catch (error) {
      console.log(error,'EMAIL REPORT TASK')
    }
    
  }
}
