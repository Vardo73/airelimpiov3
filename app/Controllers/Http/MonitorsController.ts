import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MonitorsController {

    public async showPurple({view}:HttpContextContract){
        return view.render('admin/monitor',{})
    }
}
