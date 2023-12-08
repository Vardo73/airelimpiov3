import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Datum from './Datum'
import Sponsor from './Sponsor'
import Neighborhood from './Neighborhood'
import Model from './Model'

export default class Monitor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public model_id: number

  @column()
  public neighborhood_id: number

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
    foreignKey: 'monitor_id'
  })
  public datum:HasMany<typeof Datum>

  @belongsTo(() => Neighborhood,{
    foreignKey: 'neighborhood_id',
  })
  public neighborhood:BelongsTo<typeof Neighborhood>

  @belongsTo(() => Model,{
    foreignKey: 'model_id',
  })
  public model:BelongsTo<typeof Model>

  @manyToMany(()=>User,{
    pivotTable:'user_monitors'
  })
  public users:ManyToMany<typeof User>

  @manyToMany(()=> Sponsor,{
    pivotTable:'sponsor_monitors'
  })
  public sponsors: ManyToMany<typeof Sponsor>

}
