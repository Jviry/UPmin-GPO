export function getAllTestimoniesUsecase({ testimonyRepo }) {
  return async function() {
    const testimonies = await testimonyRepo.findAll();
    return { testimonies };
  };
}