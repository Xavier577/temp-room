import { useState, ChangeEventHandler } from "react";

export interface FormFields {
    [name: string]: string | number | readonly string[];
}

export type DataCollectionElement =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLButtonElement
    | HTMLTextAreaElement;

const useForm = <T extends FormFields>(initialValues: T): [T, ChangeEventHandler<DataCollectionElement> ] => {
    const [formValues, setFormValues] = useState(initialValues);
    const handleChange: ChangeEventHandler<DataCollectionElement> = (event) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            [event.target.name]: event.target.value,
        }));
    };

    return [formValues, handleChange];
};

export default useForm;