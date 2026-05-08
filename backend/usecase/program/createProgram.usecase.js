import { validateCreateProgram } from '../../domain/program.js';

export function createProgramUsecase({ programRepo }) {
  return async function({ type, name, description, history, file }) {
    validateCreateProgram(data);

    const photo = file ? `/uploads/${file.filename}` : null;
    return await programRepo.create({ type, name, description, history, photo });
  };
}
