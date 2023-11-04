import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePollutantValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name:schema.string({},[
        rules.minLength(2),
        rules.maxLength(25)
    ]),
    description:schema.string({},[
        rules.minLength(4),
        rules.maxLength(50)
    ])})

  
  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el contaminante.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)'
  }
}
