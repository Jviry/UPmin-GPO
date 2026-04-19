import { DomainError } from '../../domain/errors.js';

export function createGetOfficeUsecase(officeRepo) {
  return async function(id) {
    const office = await officeRepo.findByID(id);

    return { office };
  };
}


