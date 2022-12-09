import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';


import Task from "App/Models/Task";

export default class TasksController {

  public async tasks() {
    return Task.all();
  }


  public async create({ request }: HttpContextContract) {
    const taskSchema = schema.create({
      title: schema.string({ trim: true }),
    })

    const { title } = await request.validate({
      schema: taskSchema, messages: {
        required: 'The {{ field }} is required to create a task',
      }
    })

    const task = await Task.create({ title })
    return task
  }

  public async update({ request }: HttpContextContract) {
    const updateSchame = schema.create({
      id: schema.number(),
      title: schema.string({ trim: true }),
      done: schema.boolean()
    })

    const { title, done, id } = await request.validate({
      schema: updateSchame, messages: {
        required: 'The {{ field }} is required to create a task',
      }
    })

    const task = await Task.findBy('id', id);
    if (!task) throw new Error(`can't update task ${id}`);

    task.title = title;
    task.done = done;
    return await task.save()
  }

  public async delete({ request, response }: HttpContextContract) {
    const deleteSchame = schema.create({
      id: schema.number(),

    })

    const { id } = await request.validate({
      schema: deleteSchame, messages: {
        required: 'The {{ field }} is required to create a task',
      }
    })

    const task = await Task.findBy('id', id);
    if (!task) throw new Error(`can't delete task ${id}`);
    await task.delete()
    return response.ok('Task deleted successfully')

  }
}