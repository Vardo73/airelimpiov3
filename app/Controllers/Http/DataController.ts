import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FwopService from 'App/Services/FwopService';
import fs from 'fs'

export default class DataController {

    public async showJsonFWOP({view}:HttpContextContract){
        return view.render('admin/json_fwop')
    }

    public async readJsonFWOP({request, response,session}:HttpContextContract){
        try {
            const archivoJson = request.file('jsonfileFwop');
            if (!archivoJson) {
                console.log('No se ha enviado ningún archivo.')
                return response.redirect().back()
            }

            const tmpPath = archivoJson.tmpPath;
            if(!tmpPath){
                console.log('La ubicación temporal del archivo es indefinida.')
                return response.redirect().back()
            }
            const contenidoJson = fs.readFileSync(tmpPath, 'utf-8');

            let json=JSON.parse(contenidoJson)
 
            const fwopService = await new FwopService(); 

            let message = await fwopService.readJson(json)

            if(message.length==0){
                session.flash('notification', {
                    status: 'success',
                    message: 'Datos guardados correctamente'
                })
                return response.redirect().back();
            }

            session.flash('notification', {
                status: 'danger',
                message: message
            })
            return response.redirect().back()
        } catch (error) {
            console.log(error)
        }
    }
}
