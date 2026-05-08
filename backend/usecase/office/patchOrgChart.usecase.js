export function patchOrgChartUsecase({ officeRepo, deleteFile }) {
  return async function(file) {
    const existing = await facultyRepo.findByID(1)
    if (!existing) {
      throw new DomainError(`Office 1 doesn't exist`);
    }

    if (file && existing.org_chart_url) {
      deleteFile(existing.org_chart_url);
    }

    return await officeRepo.patchOrgChart(1, org_chart_url);
  }
}
