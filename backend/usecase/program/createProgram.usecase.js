import { validateCreateProgram } from '../../domain/program.js';

export function createProgramUsecase({ programRepo }) {
  return async function(data) {
    validateCreateProgram(data);
    const { type, name, description, history, department_id } = data;

    return await programRepo.create({ type, name, description, history, department_id });
  };
}
