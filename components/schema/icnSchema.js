import * as Yup from "yup";

const icnSchema = Yup.object({
  code: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
}).required();

export default icnSchema;
