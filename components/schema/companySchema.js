import * as Yup from "yup";

const companySchema = Yup.object({
  code: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
}).required();

export default companySchema;
