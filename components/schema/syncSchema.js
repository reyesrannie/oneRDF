import * as Yup from "yup";

const syncSchema = Yup.object({
  system_name: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  url_holder: Yup.string().required("This field is required"),
  token: Yup.string().required("This field is required"),
}).required();

export default syncSchema;
