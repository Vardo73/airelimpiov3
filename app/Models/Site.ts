import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import SkyDatum from './SkyDatum'

export default class Site extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string 
  
  @column()
  public slug:string 
  
  @column()
  public longitude:number 
  
  @column()
  public latitude:number 

  @column()
  public municipality:string 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationships
  @hasMany(()=>SkyDatum, {
    foreignKey: 'site_id'
  })
  public data_sky:HasMany<typeof SkyDatum>
}
