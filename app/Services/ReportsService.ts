import Datum from "App/Models/Datum";
const PM_2=1,PM_10=2;
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { OriginalData, ProcessedData } from 'App/Interfaces/ReportInterface'; 
import Database from "@ioc:Adonis/Lucid/Database";

export default class ReportsService{

    public async reportDay(monitor_id:string, date:string){
        try {
            
            const results = await Datum.query()
            .preload('type') 
            .select('type_id', 'average', 'created_at as created_date')
            .where('monitor_id', monitor_id)
            .whereIn('type_id', [PM_2, PM_10])
            .whereRaw('DATE(created_at) = ?', [date])
            .groupBy('created_date', 'type_id', 'average')
            .orderBy('created_date', 'asc');
            
            return await this.processResults(results, 'HH');
            
        } catch (e) {
            
            console.log("Error reportDay_ReportService: "+e)
        }
    }

    public async reportMonth(monitor_id:string, date:string){

        try{
            const results = await Datum.query()
            .preload('type') 
            .select('type_id')
            .select(Database.raw('AVG(average) AS average'))
            .select(Database.raw('DATE(created_at) AS created_date'))
            .where('monitor_id', monitor_id)
            .whereIn('type_id', [PM_2, PM_10])
            .whereRaw('YEAR(created_at) = YEAR(?)', [date+'-01'])
            .whereRaw('MONTH(created_at) = MONTH(?)', [date+'-01'])
            .groupByRaw('DATE(created_at), type_id')
            .orderBy('created_date', 'asc');

             
            return await this.processResults(results, 'dd');
        }
        catch(e){
            console.log("Error reportMonth_ReportService: "+e)
        }
    }

    public async reportYear(monitor_id:string, date:string){

        try{
            console.log(date)
            const results = await Datum.query()
            .preload('type') 
            .select('type_id')
            .select(Database.raw('AVG(average) AS average'))
            .select(Database.raw('MONTH(created_at) AS created_date'))
            .where('monitor_id', monitor_id)
            .whereIn('type_id', [PM_2, PM_10])
            .whereRaw('YEAR(created_at) = YEAR(?)', [date + '-01-01'])
            .groupByRaw('MONTH(created_at), type_id')
            .orderBy('created_date', 'asc');
             
            return await this.processResults(results, 'MM');
        }
        catch(e){
            console.log("Error reportMonth_ReportService: "+e)
        }
    }

    public  formatDate(inputDate: string): string {
        try{
            // Verificar si la fecha es de tipo "yyyy-mm-dd"
            if (inputDate.match(/^\d{4}-\d{2}-\d{2}$/)){
                const date = new Date(inputDate);
                return format(date, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es });
            }
            // Si no, asumir que es de tipo "yyyy-mm"
            else if  (inputDate.match(/^\d{4}-\d{2}$/)) {
                const [year, month] = inputDate.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return format(date, "MMMM 'de' yyyy", { locale: es });
            }else{
                return "Año " + inputDate
            }
        }
        catch(e){
            console.log(e)
            return e
        }
    }

    private getFormatDay(dateObj: Date, formatDate:string): string {
        try{
            const dayFormat: string = format(dateObj, formatDate);
            return dayFormat;
        }
        catch(e){
            console.log(e)
            return 'null';
        }
    }

    private async processResults(results: any[], dateFormat: string): Promise<ProcessedData[]> {
        const jsonResults: OriginalData[] = results.map((result: any) => {
            const { created_at, ...rest } = result.toJSON();
            return {
                ...rest,
                created_date: dateFormat !== 'MM' ? this.getFormatDay(result.$extras.created_date, dateFormat) : result.$extras.created_date,
                average: Number(result.average).toFixed(2)
            };
        });

    
        const processedArray: ProcessedData[] = jsonResults.reduce((acc: ProcessedData[], curr: OriginalData) => {
            const existingData = acc.find(item => item.created_date === parseInt(curr.created_date));
            if (existingData) {
                if (curr.type_id === 1) {
                    existingData.average_type_1 = curr.average;
                } else if (curr.type_id === 2) {
                    existingData.average_type_2 = curr.average;
                }
            } else {
                const newData: ProcessedData = {
                    created_date: parseInt(curr.created_date),
                    average_type_1: curr.type_id === 1 ? curr.average : 0,
                    average_type_2: curr.type_id === 2 ? curr.average : 0
                };
                acc.push(newData);
            }
            return acc;
        }, []);
    
        return processedArray;
    }
}