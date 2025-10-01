import * as Yup from "yup";

const accountTitleSchema = Yup.object({
  account_type_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  account_group_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  account_sub_group_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  financial_statement_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  normal_balance_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  allocation_id: Yup.object().nullable(),
  account_unit_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  charge_id: Yup.object()
    .required("This field is required")
    .typeError("This field is required"),
  code: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
}).required();

export default accountTitleSchema;
