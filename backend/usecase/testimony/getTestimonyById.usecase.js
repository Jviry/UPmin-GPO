import { validateTestimonyId } from '../../domain/testimony.js';
import { DomainError } from '../../domain/errors.js';

export function getTestimonyByIdUsecase({ testimonyRepo }) {
  return async function(id) {
    validateTestimonyId(id);

    const testimony = await testimonyRepo.findByID(id);
    
    if (!testimony) {
      throw new DomainError(`Testimony with ID ${id} not found`);
    }

    return { testimony };
  };
}