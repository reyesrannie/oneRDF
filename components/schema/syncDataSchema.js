import * as Yup from "yup";

const syncDataSchema = Yup.object({
  system: Yup.array()
    .required("This field is required")
    .typeError("This field is required"),
}).required();

export default syncDataSchema;
