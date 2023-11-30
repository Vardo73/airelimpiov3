import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import { ErrorResponse, SensorData } from 'App/Interfaces/PurpleAirInterface'; 
import Monitor from 'App/Models/Monitor';
import Type from 'App/Models/Type';

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
    try {

      console.log("ENTRÓ Al SERVICIO")
      const PM_2=await Type.findByOrFail('name','PM_2.5')
      const PM_10=await Type.findByOrFail('name','PM_10')

      console.log("CONSULTA DE TIPOS")

      const monitors=await Monitor.query()
      .preload('model')
      .whereHas('model', (query) => {
        query.where('name', MODEL_PURPLE);
      })
      .where('active', true)
      .exec();

      console.log("CONSULTA DE MONITORES")

      await Promise.allSettled(
        monitors.map(async monitor=>{
          
          console.log(`MONITOR ${monitor.name}`)
          
          const average = await this.fetchPurpleAir(monitor)
        
          let pm2 = average.sensor["pm2.5_atm"];
          let pm10 = average.sensor["pm10.0_atm"];

          //AGREGAR A DATA
          await this.createDatum(PM_2, monitor, pm2);
          await this.createDatum(PM_10, monitor, pm10);

          console.log(`DATA GUARDADA ${monitor.name}`)
        })
      );
      
    } catch (error) {
      console.error('Error en la petición:', error);
    }
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
        throw new Error(`Error de red - Código de estado: ${response.status}, Mensaje: ${errorData.message}`);
      }   
      console.log(`CONSULTA A ${monitor.name} EXITOSA`)
      return (await response.json()) as SensorData;

    } catch (error) {
      console.error(`Error en la consulta a ${monitor.name}: ${error}`);
      return { sensor: { 'pm2.5_atm': 0, 'pm10.0_atm': 0 } };
    }
  }


  private async createDatum(type: Type, monitor: Monitor, value: number) {
    try {
      const datum = await type.related('datum').create({
        average: value
      });
  
      await datum.related('monitor').associate(monitor);
      console.log(`Dato creado para ${monitor.name}`);
      return datum;
    } catch (error) {
      console.error(`Error al crear el dato para ${monitor.name}: ${error}`);
      throw new Error(`Error al crear el dato para ${monitor.name}`);
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
}