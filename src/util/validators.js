const VALIDATOR_TYPE_REQUIRE = "REQUIRE";
const VALIDATOR_TYPE_LENGTH = "LENGTH";
const VALIDATOR_TYPE_MINLENGTH = "MINLENGTH";
const VALIDATOR_TYPE_MAXLENGTH = "MAXLENGTH";
const VALIDATOR_TYPE_MIN = "MIN";
const VALIDATOR_TYPE_MAX = "MAX";
const VALIDATOR_TYPE_EMAIL = "EMAIL";
const VALIDATOR_TYPE_PASSWORD = "PASSWORD";
const VALIDATOR_TYPE_EQUAL = "EQUAL";

export const VALIDATOR_REQUIRE = () => ({
  type: VALIDATOR_TYPE_REQUIRE,
});
export const VALIDATOR_LENGTH = (value) => ({
  type: VALIDATOR_TYPE_LENGTH,
  value,
});
export const VALIDATOR_MINLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MINLENGTH,
  value,
});
export const VALIDATOR_MAXLENGTH = (value) => ({
  type: VALIDATOR_TYPE_MAXLENGTH,
  value,
});
export const VALIDATOR_MIN = (value) => ({
  type: VALIDATOR_TYPE_MIN,
  value,
});
export const VALIDATOR_MAX = (value) => ({
  type: VALIDATOR_TYPE_MAX,
  value,
});
export const VALIDATOR_EMAIL = () => ({
  type: VALIDATOR_TYPE_EMAIL,
});
export const VALIDATOR_PASSWORD = () => ({
  type: VALIDATOR_TYPE_PASSWORD,
});
export const VALIDATOR_EQUAL = (value) => ({
  type: VALIDATOR_TYPE_EQUAL,
  value,
});

export const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator.type === VALIDATOR_TYPE_REQUIRE) {
      isValid = isValid && value.trim().length > 0;
    }

    if (validator.type === VALIDATOR_TYPE_LENGTH) {
      isValid = isValid && value.trim().length === validator.value;
    }

    if (validator.type === VALIDATOR_TYPE_MINLENGTH) {
      isValid = isValid && value.trim().length >= validator.value;
    }

    if (validator.type === VALIDATOR_TYPE_MAXLENGTH) {
      isValid = isValid && value.trim().length <= validator.value;
    }

    if (validator.type === VALIDATOR_TYPE_MIN) {
      isValid = isValid && +value >= validator.value;
    }

    if (validator.type === VALIDATOR_TYPE_MAX) {
      isValid = isValid && +value <= validator.value;
    }

    if (validator.type === VALIDATOR_TYPE_EMAIL) {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value.trim());
    }

    if (validator.type === VALIDATOR_TYPE_PASSWORD) {
      isValid =
        isValid &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/.test(
          value.trim()
        );
    }

    if (validator.type === VALIDATOR_TYPE_EQUAL) {
      isValid = isValid && value === validator.value;
    }
  }

  return isValid;
};
