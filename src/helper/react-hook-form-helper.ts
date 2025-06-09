export const setFormValues = ({ data, setValue, accept }: { data: { [key: string]: unknown }, setValue: (field: string, value: unknown) => void, accept: Array<string> }) => {
  if (!data || !setValue) return;
  Object.keys(data).forEach((key) => {
    if (accept?.length > 0) {
      if (accept?.includes(key)) {
        if (Array.isArray(data[key]) && data[key]?.[0]?.id) {
          setValue(
            key,
            data[key]?.map((item) => item?.id || item) // if data is [1,2,3] in item or [{id:1,name:name},{id:2,name:name},{id:3,name:name}]
          );
        } else {
          setValue(key, data[key]);
        }
      }
    } else {
      setValue(key, data[key]);
    }
  });
};

export const setFormErrors = ({ data, setError, accept }: { data: { [key: string]: string }, setError: (field: string, error: { type: string, message: string }) => void, accept: Array<string> }) => {
  if (!data || !setError) return;
  Object.keys(data).forEach((key) => {
    if (accept.includes(key)) {
      setError(key, { type: "manual", message: data[key] });
    }
  });
};

interface FormControlError {
  [key: string]: { message?: string };
}

export const getErrorInFormControls = (
  error: string | boolean | object | null,
  name: string
): string | null => {
  return typeof error === "object" && (error as FormControlError)?.[name]?.message
    ? ((error as FormControlError)?.[name]?.message ?? null)
    : typeof error === "string"
      ? error
      : null;
};