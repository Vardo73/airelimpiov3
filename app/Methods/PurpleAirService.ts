import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import { Response } from '@adonisjs/core/build/standalone';
export default class PurpleAirService{

    public async queryCurrentDay(url:string){

        interface ErrorResponse {
            message: string;
            errorCode: number;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': Env.get('APP_KEY_READ_PURPLE')
                }
            });
        
            // Verificar si la respuesta es exitosa (código de estado 2xx)
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

    public async queryCurrent(slug:string){

        interface ErrorResponse {
            message: string;
            errorCode: number;
        }

        interface Response {
            data: {
              sensor: {
                "pm2.5": string;
                "pm10.0": string;
              };
            };
          }

          try {
            let url = `https://api.purpleair.com/v1/sensors/${slug}`;
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
          
            const average = (await response.json()) as Response;
          
            let pm2 = '';
            let pm10 = '';
          
            if (average.data.sensor?.hasOwnProperty('pm2.5')) {
              pm2 = average.data.sensor["pm2.5"];
            }
          
            if (average.data.sensor?.hasOwnProperty('pm10.0')) {
              pm10 = average.data.sensor["pm10.0"];
            }
          
          } catch (error) {
            console.error('Error en la petición:', error);
          }
    }
}