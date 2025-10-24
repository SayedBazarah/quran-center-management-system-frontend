// ----------------------------------------------------------------------

export function getErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message || error.name || 'An error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errorMessage = (error as { message?: string }).message;
    if (typeof errorMessage === 'string') {
      return errorMessage;
    }
    if (typeof errorMessage === 'object') {
      return errorMessage[0];
    }
  }

  if (error?.errors && error?.errors[0]?.message) {
    return error?.errors[0]?.message;
  }
  console.log(error?.errors?.[0].message);
  return `Unknown error: ${error}`;
}
