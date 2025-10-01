import * as Yup from "yup";

const accountSchema = Yup.object({
  name: Yup.string().required("This field is required"),
  username: Yup.string().required("This field is required"),
  access_permission: Yup.array()
    .min(1, "This field is required")
    .required("This field is required"),
  systems: Yup.array()
    // .min(1, "This field is required")
    .required("This field is required"),
}).required();

export default accountSchema;
