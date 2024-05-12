import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Monitor from 'App/Models/Monitor';
import ReportsService from 'App/Services/ReportsService';

export default class ReportsController {

    public async generate({view,response,request}:HttpContextContract){
        try{
            const reportsService = await new ReportsService(); 

            const {rbReportType,selectMonitor,dateFrom}=request.body();
            //console.log(request.body())
            const monitor=await Monitor.findOrFail(selectMonitor)
            let data:any;
            let dateformat:string

            switch(rbReportType){
                case 'day':
                    data = await reportsService.reportDay(selectMonitor,dateFrom)
                    dateformat= reportsService.formatDate(dateFrom)
                    return  view.render('reports/daily_report',{monitor,data,dateformat})
                    
                case 'month':
                    data = await reportsService.reportMonth(selectMonitor,dateFrom)
                    dateformat= reportsService.formatDate(dateFrom)
                    return  view.render('reports/monthly_report',{monitor,data,dateformat})

                case 'year':
                    data =await reportsService.reportYear(selectMonitor,dateFrom)
                    dateformat= reportsService.formatDate(dateFrom)
                    return  view.render('reports/yearly_report',{monitor,data,dateformat})

                default: 
                    return response.status(400).send({ error: 'Tipo de reporte inválido' })
            }

            return response.redirect().back()
        }
        catch(error){
            console.error(error);
            return response.status(500).send({ error: 'Ocurrió un error al generar el reporte' });
        }
    }

}