import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'
import Neighborhood from './Neighborhood'
import Ailment from './Ailment'

export default class Pollutant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @column()
  public description:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


  //relationship
  @manyToMany(()=> Model,{
    pivotTable:'model_pollutants'
  })
  public models: ManyToMany<typeof Model>

  @manyToMany(()=> Neighborhood,{
    pivotTable:'pollutant_neighborhoods'
  })
  public neighborhoods: ManyToMany<typeof Neighborhood>

  @manyToMany(()=> Ailment,{
    pivotTable:'aliment_pollutants'
  })
  public ailments: ManyToMany<typeof Ailment>
}
