import * as Yup from "yup";

const coaSchema = Yup.object({
  company: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  business_unit: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  department: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  unit: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  sub_unit: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  location: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  code: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
}).required();

export default coaSchema;
