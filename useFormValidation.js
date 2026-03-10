import { useState, useEffect } from "react";

//Validation Form hook so that it can be used accross all forms
//There is react hook form but has a learnign curve for syntax and avoiding it for now

export default function useFormValidation(initialData, requiredFields) {
  const [formData, setFormData] = useState(initialData);
  const [isValid, setIsValid] = useState(false);

  // goes thorugh all fields and checks if the fields are fileld are not
  useEffect(() => {
    const allRequiredFilled = requiredFields.every(
      (key) => formData[key]?.trim() !== ""
    );
    setIsValid(allRequiredFilled);
  }, [formData, requiredFields]);

  const setForm = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return { formData, setForm, isValid };
}
