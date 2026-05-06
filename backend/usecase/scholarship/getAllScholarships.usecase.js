export function getAllScholarshipsUsecase({ scholarshipRepo }) {
  return async function() {
    const scholarships = await scholarshipRepo.getAllScholarships();
    return { scholarships };
  };
}