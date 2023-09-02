import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Datum from './Datum'
import Sponsor from './Sponsor'
import Neighborhood from './Neighborhood'
import Model from './Model'

export default class Station extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public model_id: 'required|exists:models,id'

  @column()
  public neighborhood_id: 'required|exists:neighborhoods,id'

  @column()
  public name:string 
  
  @column()
  public slug:number 
  
  @column()
  public apikey:string 
  
  @column()
  public longitude:number 
  
  @column()
  public latitude:number 
  
  @column()
  public active:boolean 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime



  //relationships
  @hasMany(()=>Datum, {
    foreignKey: 'station_id'
  })
  public datum:HasMany<typeof Datum>

  @belongsTo(() => Neighborhood)
  public neighborhood:BelongsTo<typeof Neighborhood>

  @belongsTo(() => Model)
  public model:BelongsTo<typeof Model>

  @manyToMany(()=>User,{
    pivotTable:'user_stations'
  })
  public users:ManyToMany<typeof User>

  @manyToMany(()=> Sponsor,{
    pivotTable:'sponsor_stations'
  })
  public sponsors: ManyToMany<typeof Sponsor>

}
