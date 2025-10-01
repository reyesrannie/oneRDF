import * as Yup from "yup";

const userRolesSchema = Yup.object({
  access_permission: Yup.array().required("This field is required"),
}).required();

export default userRolesSchema;
