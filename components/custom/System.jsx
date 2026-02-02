import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setSystemBackground,
  setSystemEndpoint,
  setSystemLogo,
  setSystemSlicer,
} from "../../services/server/slice/modalSlice";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import "react-tabs/style/react-tabs.css";

import "../styles/Modal.scss";
import { useForm } from "react-hook-form";

import AppTextBox from "../custom/AppTextBox";
import { useSnackbar } from "notistack";
import Autocomplete from "./AutoComplete";
import { useCategoryQuery } from "../../services/server/api/categoryAPI";
import { nopagination } from "../../services/constant/systemQuery";
import {
  useAddSystemMutation,
  useLazyGetFileQuery,
  useStoreFileMutation,
  useUpdateSystemMutation,
} from "../../services/server/api/systemAPI";
import SystemController from "./SystemController";
import {
  checkValues,
  openFileSelect,
} from "../../services/functions/checkValues";
import { objectError } from "../../services/functions/errorResponse";

const System = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const systemSlicer = useSelector((state) => state.modal.systemSlicer);
  const systemData = useSelector((state) => state.modal.systemData);
  const systemLogo = useSelector((state) => state.modal.systemLogo);
  const systemBackground = useSelector((state) => state.modal.systemBackground);

  const [logo, setLogo] = useState(null);
  const [background, setBackground] = useState(null);

  const rendered = useRef();

  const { data: dataCategory, isLoading: loadingCategory } =
    useCategoryQuery(nopagination);

  const [getImage] = useLazyGetFileQuery();

  const [storeFile, { isLoading: loadingStoreFile }] = useStoreFileMutation();
  const [addSystem, { isLoading: loaddingAddSystem }] = useAddSystemMutation();
  const [updateSystem, { isLoading: loaddingUpdateSystem }] =
    useUpdateSystemMutation();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      system_name: "",
      url_holder: "",
      backend_url: "",
      token: "",
      system_image: "",
      system_background: "",
      description: "",
      category: null,
    },
  });

  const getImageHandler = async (file, setSystem) => {
    !file
      ? null
      : await getImage({ fileName: file })
          .unwrap()
          .then((res) => res?.imageURL && dispatch(setSystem(res.imageURL)))
          .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (systemData && !rendered.current) {
      dispatch(setSystemSlicer(systemData?.slice[0]));
      const logoFile = systemData?.system_image.split("/").pop();
      const backgroundFile = systemData?.system_background?.split("/").pop();

      getImageHandler(logoFile, setSystemLogo);
      getImageHandler(backgroundFile, setSystemBackground);

      const newData = {
        ...systemData,
        system_image: logoFile,
        system_background: backgroundFile,
      };
      Object.entries(newData)?.forEach(([key, value]) => {
        setValue(key, value);
      });
      rendered.current = true;
    }
  }, [systemData]);

  const allChanged = () => {
    const values = watch();
    return checkValues(values);
  };

  const submitHandler = async (submitData) => {
    const formDataLogo = new FormData();
    formDataLogo.append("file", logo);

    const formDataBackground = new FormData();
    formDataBackground.append("file", background);

    try {
      const imageLogoRes = logo ? await storeFile(formDataLogo).unwrap() : null;
      const imageBackgroundRes = background
        ? await storeFile(formDataBackground).unwrap()
        : null;

      const payload = {
        ...submitData,
        id: systemData ? systemData?.id : null,
        system_image: imageLogoRes
          ? imageLogoRes?.data
          : systemData?.system_image,
        system_background: imageBackgroundRes
          ? imageBackgroundRes?.data
          : systemData?.system_background,
        slice: [systemSlicer],
        category_id: submitData?.category?.id,
      };

      const res = systemData
        ? await updateSystem(payload).unwrap()
        : await addSystem(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack flexDirection={"column"}>
          <Stack
            gap={2}
            flexDirection={"column"}
            sx={{
              mb: 7,
            }}
          >
            <Stack gap={2} flexDirection={"row"}>
              <AppTextBox
                control={control}
                name={"system_name"}
                label="System Name"
                error={Boolean(errors?.system_name)}
                helperText={errors?.system_name?.message}
              />
              <AppTextBox
                control={control}
                name={"token"}
                label="Token/API Key"
                type="password"
                error={Boolean(errors?.token)}
                helperText={errors?.token?.message}
              />
            </Stack>
            <Stack gap={2} flexDirection={"row"}>
              <AppTextBox
                control={control}
                name={"url_holder"}
                label="Url"
                error={Boolean(errors?.url_holder)}
                helperText={errors?.url_holder?.message}
              />
              <AppTextBox
                control={control}
                name={"backend_url"}
                label="Backend Url"
                error={Boolean(errors?.backend_url)}
                helperText={errors?.backend_url?.message}
              />
            </Stack>
            <AppTextBox
              multiline
              minRows={3}
              control={control}
              name={"description"}
              label="Description"
              error={Boolean(errors?.description)}
              helperText={errors?.description?.message}
            />
            <AppTextBox
              control={control}
              name={"system_image"}
              label="System Icon"
              error={Boolean(errors?.system_image)}
              helperText={errors?.system_image?.message}
              onKeyDown={(e) => e.preventDefault()}
              onClick={() =>
                openFileSelect(
                  setValue,
                  dispatch,
                  setLogo,
                  enqueueSnackbar,
                  setSystemLogo,
                  "system_image",
                )
              }
              icon={
                watch("system_image") && (
                  <Avatar src={systemLogo} sx={{ width: 30, height: 30 }} />
                )
              }
            />
            <AppTextBox
              control={control}
              name={"system_background"}
              label="System Background"
              error={Boolean(errors?.system_background)}
              helperText={errors?.system_background?.message}
              onKeyDown={(e) => e.preventDefault()}
              onClick={() =>
                openFileSelect(
                  setValue,
                  dispatch,
                  setBackground,
                  enqueueSnackbar,
                  setSystemBackground,
                  "system_background",
                )
              }
              icon={
                watch("system_background") && (
                  <Avatar
                    src={systemBackground}
                    sx={{ width: 30, height: 30 }}
                  />
                )
              }
            />

            <Autocomplete
              loading={loadingCategory}
              control={control}
              name="category"
              options={dataCategory || []}
              getOptionLabel={(option) => option?.name}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Category"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                />
              )}
              disableClearable
            />
            {systemSlicer !== null && (
              <Button
                disabled={systemSlicer === null}
                variant="outlined"
                onClick={() => dispatch(setSystemEndpoint(true))}
              >
                Endpoints
              </Button>
            )}
          </Stack>
          <Stack
            position={"absolute"}
            flexDirection={"row"}
            bottom={0}
            right={0}
            padding={2}
            gap={1}
          >
            <Button
              variant="contained"
              color="error"
              startIcon={<ClearOutlinedIcon />}
              onClick={() => dispatch(resetModal())}
            >
              Close
            </Button>
            {systemSlicer !== null && (
              <Button
                loading={
                  loadingStoreFile || loaddingAddSystem || loaddingUpdateSystem
                }
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                type="submit"
              >
                {systemData ? "Update" : "Submit"}
              </Button>
            )}
            {systemSlicer === null && (
              <Button
                disabled={Boolean(!allChanged())}
                variant="contained"
                loadingPosition="start"
                startIcon={<CheckOutlinedIcon />}
                color="success"
                onClick={() => dispatch(setSystemEndpoint(true))}
              >
                Next
              </Button>
            )}
          </Stack>
        </Stack>
      </form>

      <SystemController />
    </Box>
  );
};

export default System;
