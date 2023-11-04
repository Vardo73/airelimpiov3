import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Ailment from './Ailment'

export default class Clinic extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public longitude:number

  @column()
  public latitude:number

  @column()
  public neighborhood:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //relationships
  @manyToMany(()=> Ailment,{
    pivotTable:'ailment_clinics'
  })
  public ailments: ManyToMany<typeof Ailment>
}
