import { useReducer } from "react";

type InputState = {
  value: string;
  isTouched: boolean;
};

// const initialInputState: InputState = {
//   value: "",
//   isTouched: false,
// };
type InputAction = {
  type: string;
  value?: string;
  payload: InputState;
};

const inputStateReducer: any = (state: InputState, action: InputAction) => {
  if (action.type === "INPUT") {
    return {
      value: action.value,
      isTouched: state.isTouched,
    };
  }
  if (action.type === "BLUR") {
    return {
      value: state.value,
      isTouched: true,
    };
  }
  if (action.type === "RESET") {
    return {
      // value: state.value,
      value: "",
      isTouched: false,
    };
  }
  return inputStateReducer;
};

const useInput = (validateValue: any, initialValue?: any) => {
  const initialInputState: InputState = {
    value: initialValue,
    isTouched: false,
  };

  const [inputState, dispatch]: [any, any] = useReducer(
    inputStateReducer,
    initialInputState
  );

  // const [enteredValue, setEnteredValue] = useState('');
  // const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (event: any) => {
    dispatch({
      type: "INPUT",
      value: event.target.value,
    });
  };

  const inputBlurHandler = (event: any) => {
    dispatch({
      type: "BLUR",
    });
  };

  const reset = () => {
    dispatch({
      type: "RESET",
    });
  };
  const saveEnteredValue = (event: any) => {
    dispatch({
      type: "INPUT",
      value: event,
    });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
    saveEnteredValue,
  };
};
export default useInput;
