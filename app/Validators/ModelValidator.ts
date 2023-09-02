import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ModelValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    name:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    description:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    pollutans:schema.array().members(schema.string())
  })

  
  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el modelo.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)',
    number:'Datos {{field}} no son de tipo '
  }
}
