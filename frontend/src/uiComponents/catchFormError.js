export function catchFormError(error) {
  return { message: error.response.data.error };
}
