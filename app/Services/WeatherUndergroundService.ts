import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import Station from 'App/Models/Station';
import Database from '@ioc:Adonis/Lucid/Database';
import { ErrorResponse ,StationData} from 'App/Interfaces/PurpleAirInterface';


const MODEL_PURPLE='WEATHER_UNDEGROUND'
export default class WeatherUndergroundService{



  private async fetchWeatherUnderground(station:Station){
    try {
      let url=`https://api.weather.com/v2/pws/observations/current?stationId=${station.slug}&format=json&units=e&apiKey=${Env.get('WEATHER_UNDERGROUND')}`

      const response = await fetch(url, {
        method: 'GET',
        /*headers: {
          'Content-Type': 'application/json',
          'X-API-Key': Env.get('APP_KEY_READ_PURPLE')
        },*/
      });

      const responseBody = await response.json();

      console.log(responseBody)
      
      if (!response.ok) {
        const errorData = responseBody as ErrorResponse;
        console.log(errorData)
        throw new Error(`Error de red - Código de estado: ${response.status}, Mensaje: ${errorData.message}`);
      }   
      return responseBody as StationData;

    } catch (error) {
      console.error(`Error en la consulta a ${station.name}: ${error}`);
      return { };//AGREGAR PROCESO DE RETORNO 0
    }
  }

  
  public async queryCurrentBanner(){
    try {
      const stations=await Station.query()
      .preload('model')
      .preload('sponsors')
      .whereHas('model', (query) => {
        query.where('name', "WEATHER_UNDEGROUND");
      })
      .exec();

      const infoPromises=stations.map(async station=>{
        
        const average = await this.fetchWeatherUnderground(station)
        
        
        //OBTENER DATOS A MOSTRAR

        
        return {
          station:station
        }
      })
      const info = await Promise.all(infoPromises);
      return info;
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  }

  public async queryCurrentHour(){
    await Database.transaction(async (trx) => {
      try {

        const stations=await Station.query()
        .preload('model')
        .whereHas('model', (query) => {
          query.where('name', MODEL_PURPLE);
        })
        .exec();

        await Promise.allSettled(
          stations.map(async station=>{
              
            const average = await this.fetchWeatherUnderground(station)
            
          })
        );
      } catch (error) {
        console.error('Error en la petición:', error);
        trx.rollback();
      }
    })
  }
}