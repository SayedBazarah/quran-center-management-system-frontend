export function appendFormData(
  formData: FormData,
  data: Record<string, any>,
  parentKey: string = ""
) {
  Object.entries(data).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key; // Use dot notation for nested keys
    if (value instanceof File) {
      formData.append(fullKey, value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Date)
    ) {
      // Recurse if the value is a non-null object and not a Date
      appendFormData(formData, value, fullKey);
    } else {
      formData.append(fullKey, String(value));
    }
  });
}
