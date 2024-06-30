import { DateTime } from 'luxon'
import { BaseModel, column,  belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Locality from './Locality'

export default class Community extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public locality_id: number

  @column()
  public name:string

  @column()
  public population:string

  @column()
  public municipality:string

  @column()
  public photos_link:string
  
  @column()
  public electrical_network:boolean 
  
  @column()
  public longitude:number 
  
  @column()
  public latitude:number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationships
  @belongsTo(() => Locality,{
    foreignKey: 'locality_id',
  })
  public locality:BelongsTo<typeof Locality>
}
