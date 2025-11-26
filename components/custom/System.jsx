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
  setSystemEndpoint,
  setSystemImageData,
  setSystemSlicer,
} from "../../services/server/slice/modalSlice";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import "react-tabs/style/react-tabs.css";

import "../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import systemSchema from "../schema/systemSchema";
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
import { checkValues } from "../../services/functions/checkValues";
import { objectError } from "../../services/functions/errorResponse";

const System = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const systemSlicer = useSelector((state) => state.modal.systemSlicer);
  const systemData = useSelector((state) => state.modal.systemData);
  const systemImageData = useSelector((state) => state.modal.systemImageData);
  const [image, setImage] = useState(null);
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
      token: "",
      system_image: "",
      category: null,
    },
  });

  const getImageHandler = async (file) => {
    try {
      const res = await getImage({ fileName: file }).unwrap();
      dispatch(setSystemImageData(res?.imageURL));
    } catch (error) {}
  };

  useEffect(() => {
    if (systemData && !rendered.current) {
      dispatch(setSystemSlicer(systemData?.slice[0]));
      const file = systemData?.system_image.split("/").pop();
      getImageHandler(file);
      const newData = {
        ...systemData,
        system_image: file,
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
    const formData = new FormData();
    formData.append("file", image);

    try {
      const imageRes = image ? await storeFile(formData).unwrap() : null;
      const payload = {
        ...submitData,
        id: systemData ? systemData?.id : null,
        system_image: imageRes ? imageRes?.data : systemData?.system_image,
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

  const openFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png, .svg";
    input.style.display = "none";
    input.onchange = (event) => {
      const file = event.target.files[0];

      if (file) {
        const allowedTypes = ["image/png", "image/svg+xml"];

        if (allowedTypes.includes(file.type)) {
          const sanitizedFileName = file.name.replace(/\s+/g, "_");
          const renamedFile = new File([file], sanitizedFileName, {
            type: file.type,
          });
          setValue("system_image", sanitizedFileName);
          dispatch(setSystemImageData(URL.createObjectURL(renamedFile)));
          setImage(renamedFile);
        } else {
          enqueueSnackbar("Only PNG and SVG files are allowed.", {
            variant: "error",
          });
        }
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
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
            <AppTextBox
              control={control}
              name={"system_name"}
              label="System Name"
              error={Boolean(errors?.system_name)}
              helperText={errors?.system_name?.message}
            />
            <AppTextBox
              control={control}
              name={"url_holder"}
              label="Url"
              error={Boolean(errors?.url_holder)}
              helperText={errors?.url_holder?.message}
            />
            <AppTextBox
              control={control}
              name={"token"}
              label="Token"
              type="password"
              error={Boolean(errors?.token)}
              helperText={errors?.token?.message}
            />
            <AppTextBox
              control={control}
              name={"system_image"}
              label="System Icon"
              error={Boolean(errors?.system_image)}
              helperText={errors?.system_image?.message}
              onKeyDown={(e) => e.preventDefault()}
              onClick={() => openFileSelect()}
              icon={
                watch("system_image") && (
                  <Avatar
                    src={systemImageData}
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
