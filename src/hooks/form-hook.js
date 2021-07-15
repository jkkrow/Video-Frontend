import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let isFormValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }

        if (inputId === action.inputId) {
          isFormValid = isFormValid && action.isValid;
        } else {
          isFormValid = isFormValid && state.inputs[inputId].isValid;
        }
      }
      return {
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: isFormValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: true,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: false,
  });

  const inputHandler = useCallback((inputId, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId,
      value,
      isValid,
    });
  }, []);

  const setFormData = useCallback((inputData) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
    });
  }, []);

  return { formState, inputHandler, setFormData };
};
