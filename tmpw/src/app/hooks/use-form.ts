import { useState, ChangeEventHandler } from 'react';

export interface FormFields {
  [name: string]: string | number | readonly string[];
}

export type DataCollectionElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLButtonElement
  | HTMLTextAreaElement;

type ResetFieldValueFn = (key: string) => void;

const useForm = <T extends FormFields>(
  initialValues: T,
): [T, ChangeEventHandler<DataCollectionElement>, ResetFieldValueFn] => {
  const [formValues, setFormValues] = useState(initialValues);
  const handleChange: ChangeEventHandler<DataCollectionElement> = (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [event.target.name]: event.target.value,
    }));
  };

  const resetValue: ResetFieldValueFn = (key) => {
    if (key in formValues) {
      setFormValues((currState) => ({
        ...currState,
        [key]: '',
      }));
    }
  };

  return [formValues, handleChange, resetValue];
};

export default useForm;
