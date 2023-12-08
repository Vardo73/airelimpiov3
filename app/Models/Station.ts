import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import DataStation from './DataStation'
import Model from './Model'
import Sponsor from './Sponsor'

export default class Station extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public model_id: number

  @column()
  public name:string 
  
  @column()
  public slug:number 
  
  @column()
  public longitude:number 
  
  @column()
  public latitude:number 

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationships
  @hasMany(()=>DataStation, {
    foreignKey: 'station_id'
  })
  public data_station:HasMany<typeof DataStation>


  @belongsTo(() => Model,{
    foreignKey: 'model_id',
  })
  public model:BelongsTo<typeof Model>


  @manyToMany(()=> Sponsor,{
    pivotTable:'sponsor_stations'
  })
  public sponsors: ManyToMany<typeof Sponsor>
}
