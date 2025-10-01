import * as Yup from "yup";

const systemSchema = Yup.object({
  url_holder: Yup.string().required("This field is required"),
  system_image: Yup.string().required("This field is required"),
  system_name: Yup.string().required("This field is required"),
  token: Yup.string().required("This field is required"),
  category: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
}).required();

export default systemSchema;
