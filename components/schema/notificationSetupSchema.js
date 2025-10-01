import * as Yup from "yup";

const notificationSetupSchema = Yup.object({
  title: Yup.string().required("This field is required"),
  subtitle: Yup.string().required("This field is required"),
  content: Yup.string().required("This field is required"),
  footer: Yup.string().required("This field is required"),
  memo_file: Yup.mixed()
    .required("This field is required")
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
}).required();

export default notificationSetupSchema;
