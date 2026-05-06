export function syncProgramFacultyUsecase({ facultyRepo, programRepo }) {
  return async function({ program_id, faculty_ids }) {
    if (!Array.isArray(faculty_ids)) {
      throw new DomainError('Faculties must be an array');
    }

    const existing = await programRepo.findByID(program_id);
    if (!existing) {
      throw new DomainError(`Program with ID ${program_id} not found`);
    }

    return await facultyRepo.syncProgramFaculty({ program_id, faculty_ids });
  }
}
