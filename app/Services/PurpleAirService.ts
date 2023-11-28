import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import { ErrorResponse, SensorData } from 'App/Interfaces/PurpleAirInterface'; 
import Monitor from 'App/Models/Monitor';

const MODEL_PURPLE='PURPLE_AIR'

export default class PurpleAirService{

  public async queryCurrentDay(url:string){
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': Env.get('APP_KEY_READ_PURPLE')
        }
      });
        
      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(`Error de red - Código de estado: ${response.status}, Mensaje: ${errorData.message}`);
      }
        
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }

  public async queryCurrentAll(){
    try {

      const monitors=await Monitor.query()
      .preload('model')
      .preload('neighborhood')
      .preload('sponsors')
      .whereHas('model', (query) => {
        query.where('name', MODEL_PURPLE);
      })
      .exec();

      const infoPromises=monitors.map(async monitor=>{
        
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
          throw new Error(`Error de red - Código de estado: ${response.status}, Mensaje: ${errorData.message}`);
        }
            
        const average = (await response.json()) as SensorData;
            
        let pm2 = 0;
        let pm10 =0;
            
        if (average.sensor?.hasOwnProperty('pm2.5_atm')) {
          pm2 = average.sensor["pm2.5_atm"];
        }
            
        if (average.sensor?.hasOwnProperty('pm10.0_atm')) {
          pm10 = average.sensor["pm10.0_atm"];
        }


        return {monitor:monitor,"PM_2.5":pm2,"PM_10":pm10}

      })

      const info = await Promise.all(infoPromises);

      console.log(info);
  
      return info;
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }

}