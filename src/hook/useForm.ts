import { useState, useEffect } from "react";

const useForm = (
    callback: () => void,
    validate: any,
    formObj: { [key: string]: string }
) => {
    const [values, setValues] = useState(formObj);
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event: any) => {
        const { name, value, checked, type, files } = event;
        setValues({
            ...values,
            ...{
                [name]: name.includes("_pwd") || name.includes("customer_pan") || name.includes("a_login_id") ? value : !new Set(["checkbox", "file"]).has(type)
                    ? Array.isArray(value) ? value : (typeof value === 'object' &&
                        !Array.isArray(value) ? value : value.toString())
                    : type == "checkbox"
                        ? checked
                        : files[0],
            },
        });
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrors(validate(values));
        setIsSubmitting(true);
    };

    useEffect(() => {
        if (errors && Object.keys(errors).length === 0 && isSubmitting) {
            callback();
        }
    }, [errors]);

    useEffect(() => {
        setValues(formObj);
    }, [formObj]);

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
        setErrors,
        setValues,
        setIsSubmitting,
    };
};

export default useForm;
