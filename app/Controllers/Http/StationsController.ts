import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StationsController {

    public async show({view}:HttpContextContract){
        return view.render('admin/station',{})
    }
}