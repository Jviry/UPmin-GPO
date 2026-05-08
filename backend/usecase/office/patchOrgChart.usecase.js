import { DomainError } from "../../domain/errors.js";

export function patchOrgChartUsecase({ officeRepo, deleteFile }) {
  return async function(file) {
    const existing = await officeRepo.findByID(1)
    if (!existing) {
      throw new DomainError(`Office 1 doesn't exist`);
    }

    if (file && existing.org_chart_url) {
      deleteFile(existing.org_chart_url);
    }

    const org_chart_url = file ? `/uploads/${file.filename}` : existing.org_chart_url;

    return await officeRepo.patchOrgChartUrl(1, org_chart_url);
  }
}
