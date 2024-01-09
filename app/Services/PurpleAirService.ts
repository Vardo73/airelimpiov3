import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import { ErrorResponse, SensorData } from 'App/Interfaces/PurpleAirInterface'; 
import Monitor from 'App/Models/Monitor';
import Type from 'App/Models/Type';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/User';


const MODEL_PURPLE='PURPLE_AIR'

const getColor = (pm2, pm10) => {
  const colorRanges = [
    { range: [250.4, 425], color: '#7E0023' },
    { range: [150.5, 355], color: '#A8549D' },
    { range: [55.5, 255], color: '#7E0023' },
    { range: [35.5, 155], color: '#FC7928' },
    { range: [12.1, 55], color: '#EDB02D' },
    { range: [0, 0], color: '#38B208' },
    { range: [-Infinity, -Infinity], color: '#808080' },
  ];

  const matchingRange = colorRanges.find(({ range }) => pm2 > range[0] || pm10 > range[1]);

  return matchingRange ? matchingRange.color : '#808080';
};

export default class PurpleAirService{

  public async queryCurrentHour(){
    await Database.transaction(async (trx) => {
      try {
        const PM_2=await Type.findByOrFail('name','PM_2.5')
        const PM_10=await Type.findByOrFail('name','PM_10')

        const monitors=await Monitor.query()
        .preload('model')
        .whereHas('model', (query) => {
          query.where('name', MODEL_PURPLE);
        })
        .where('active', true)
        .exec();

        await Promise.allSettled(
          monitors.map(async monitor=>{
              
            const average = await this.fetchPurpleAir(monitor)
            
            let pm2 = average.sensor["pm2.5_atm"];
            let pm10 = average.sensor["pm10.0_atm"];

            //AGREGAR A DATA

            await monitor.related('datum')
            .createMany([
              {
                type_id:PM_2.id,
                average: pm2
              },
              {
                type_id:PM_10.id,
                average: pm10
              }
            ]);
          })
        );
      } catch (error) {
        console.error('Error en la petición:', error);
        trx.rollback();
      }
    })
  }

  private async fetchPurpleAir(monitor:Monitor){
    try {
      let url = `https://api.purpleair.com/v1/sensors/${monitor.slug}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': Env.get('APP_KEY_READ_PURPLE'),
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        console.log(errorData)
        throw new Error(`Error de red - Código de estado: ${response.status}, Mensaje: ${errorData.message}`);
      }   
      return (await response.json()) as SensorData;

    } catch (error) {
      console.error(`Error en la consulta a ${monitor.name}: ${error}`);
      return { sensor: { 'pm2.5_atm': 0, 'pm10.0_atm': 0 } };
    }
  }

  public async queryCurrentBanner(){
    try {
      const monitors=await Monitor.query()
      .preload('model')
      .preload('neighborhood')
      .preload('sponsors')
      .whereHas('model', (query) => {
        query.where('name', MODEL_PURPLE);
      })
      .where('active', true)
      .exec();

      const infoPromises=monitors.map(async monitor=>{
        
        const average = await this.fetchPurpleAir(monitor)
        
        let pm2 = average.sensor["pm2.5_atm"];
        let pm10 = average.sensor["pm10.0_atm"];
        
        return {
          monitor:monitor,
          "PM_2.5":pm2,
          PM_10:pm10,
          color:getColor(pm2, pm10)
        }
      })
      const info = await Promise.all(infoPromises);
      return info;
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }

  public async taskQuery(){
    try {
      const monitors=await Monitor.query()
      .preload('model')
      //.preload('neighborhood')
      .whereHas('model', (query) => {
        query.where('name', MODEL_PURPLE);
      })
      .where('active', true)
      .exec();

      const infoPromises=monitors.map(async monitor=>{
          
        const average = await this.fetchPurpleAir(monitor)
        
        let pm2 = average.sensor["pm2.5_atm"];
        let pm10 = average.sensor["pm10.0_atm"];
        let emailsSet = new Set<string>();

        if (pm2 > 35.5 || pm10>155){
          const users=  await User.query()
          .whereHas('monitors', (query) => {
            query.where('monitor_id',monitor.id);
          })
          .preload('monitors')
          .exec();

          if(users.length>0){
            users.forEach(user => {
              emailsSet.add(user.email);
            });
          }
        }

        const emails = Array.from(emailsSet);
        return emails
      })
      const info = await Promise.all(infoPromises);
      const uniqueEmails = Array.from(new Set(info.flat()));

      return uniqueEmails;
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }


  public async taskQueryTwitter(){
    try {
      const monitors=await Monitor.query()
      .preload('model')
      .preload('neighborhood')
      .whereHas('model', (query) => {
        query.where('name', MODEL_PURPLE);
      })
      .where('active', true)
      .exec();

      const infoPromises=monitors.map(async monitor=>{
          
        const average = await this.fetchPurpleAir(monitor)
        
        let pm2 = average.sensor["pm2.5_atm"];
        let pm10 = average.sensor["pm10.0_atm"];

        if (pm2 > 35.5 || pm10>155){
          return monitor.neighborhood.name
        }
      })

      const info = await Promise.all(infoPromises);
      return info

    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }
}