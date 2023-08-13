import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateClinicValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name:schema.string({},[
        rules.minLength(4),
        rules.maxLength(25)
    ]),
    longitude:schema.number(),
    latitude:schema.number(),
    neighborhood:schema.string({},[
      rules.minLength(4),
      rules.maxLength(50)
    ])})

  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el contaminante.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)'
  }
}
