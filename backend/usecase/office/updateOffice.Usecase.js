import { validateOfficeUpdate } from '../../domain/office.js';

export function createUpdateOfficeUsecase(officeRepo) {
  return async function(updates) {
    validateOfficeUpdate(updates);

    const updatedOffice = await officeRepo.updateAttribute(1, updates);

    return { updatedOffice };
  }
}
