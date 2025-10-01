import * as Yup from "yup";

const categorySchema = Yup.object({
  name: Yup.string().required("This field is required"),
}).required();

export default categorySchema;
