import { validateCreateProgram } from '../../domain/program.js';

export function createProgramUsecase({ programRepo }) {
  return async function(data) {
    validateCreateProgram(data);

    const newProgram = await programRepo.createProgram(
      data.type,
      data.name,
      data.description,
      data.history,
      data.department_id
    );

    return { program: newProgram };
  };
}