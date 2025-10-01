import * as Yup from "yup";

const atLeastOneRequired = function () {
  return (
    Object.values(this.parent).some((val) => val) ||
    this.createError({ message: "Fill in at least one field." })
  );
};

const systemControllerSchema = Yup.object(
  ["login", "roles", "user", "storage"].reduce((acc, field) => {
    acc[field] = Yup.string()
      .nullable()
      .test("at-least-one", "Fill in at least one field.", atLeastOneRequired);
    return acc;
  }, {})
);

export default systemControllerSchema;
