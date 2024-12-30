import Datum from "App/Models/Datum";
import Monitor from "App/Models/Monitor";
import Type from "App/Models/Type";
import { FWOPData } from 'App/Interfaces/FwopInterface'; 
import { DateTime } from "luxon";

const FWOP='FWOP'
export default class FwopService{

    public async readJson(json:object):Promise<string>{
        try {

            const PM_2=await Type.findByOrFail('name','PM_2.5')
            const PM_10=await Type.findByOrFail('name','PM_10')

            const monitors=await Monitor.query()
            .preload('model')
            .whereHas('model', (query) => {
            query.where('name', FWOP);
            })
            .exec();

            let ids_monitors:number[]=[]

            if(monitors.length==0)return 'No se encuentran monitores registrados';

            monitors.map( monitor =>{
                ids_monitors.push(monitor.slug)
            })

            const array:FWOPData[] = Object.values(json);

            let i=0;
            while(i<array.length){
                if(!ids_monitors.includes(array[i]["ID"])) {
                    return `Monitor F.W.O.P con ID ${array[i]["ID"]}, no se encuentra registrado.`;
                }
                i++;
            }

            i=0;
            while(i<array.length){
                const date: DateTime = DateTime.fromJSDate(new Date(array[i]["Date"]));
                const monitor=await Monitor.findByOrFail('slug',array[i]["ID"])
                await Datum.createMany([
                    {
                        average:array[i]["PM25"] ,
                        monitor_id: monitor.id,
                        type_id: PM_2.id,
                        createdAt:date
                    },
                    {
                        average: array[i]["PM10"],
                        monitor_id: monitor.id,
                        type_id: PM_10.id,
                        createdAt:date
                    },
                ])
                i++;
            }

            return ''
        } catch (error) {
            console.log(error)
            return 'Hubo un error en la ejecución del método.'
        }
    }


}