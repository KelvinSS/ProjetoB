import { useState } from "react";

export function useValidation() {
    const [errors, setErrors] = useState({});

    const validateField = (value, fieldName) => {
        const isValid = !!value;
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: !isValid }));
        return isValid;
    };

    const resetErrors = () => setErrors({});

    return {
        errors,
        validateField,
        resetErrors,
    };
};