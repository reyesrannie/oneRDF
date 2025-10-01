import {
  Box,
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  TextField as MuiTextField,
} from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setCategory,
} from "../../services/server/slice/modalSlice";
import categoryImage from "../../assets/svg/category.svg";
import "react-tabs/style/react-tabs.css";
import "../styles/Modal.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "../custom/AppTextBox";

import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";

import Autocomplete from "../custom/AutoComplete";
import { useLazyBusinessUnitQuery } from "../../services/server/api/businessUnitAPI";
import { useLazyDepartmentQuery } from "../../services/server/api/departmentAPI";
import { useLazyCompanyQuery } from "../../services/server/api/companyAPI";
import { useLazyDepartmentUnitQuery } from "../../services/server/api/departmentUnitAPI";
import { useLazySubUnitQuery } from "../../services/server/api/SubUnitAPI";
import { useLazyLocationQuery } from "../../services/server/api/locationAPI";

import {
  useAddCoaMutation,
  useUpdateCoaMutation,
} from "../../services/server/api/coaAPI";
import coaSchema from "../schema/coaSchema";

const CoaModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.coa);
  const coaData = useSelector((state) => state.modal.coaData);
  const isTablet = useMediaQuery("(min-width:768px)");
  const debounceTimeout = useRef(null);
  const hasExecuted = useRef();

  const [
    getCompany,
    {
      data: companyData,
      isLoading: loadingCompany,
      isSuccess: successCompany,
      status: statusCompany,
      reset: resetCompany,
    },
  ] = useLazyCompanyQuery();

  const [
    getBusinessUnit,
    {
      data: businessUnitData,
      isLoading: loadingBusinessUnit,
      isSuccess: successBusinessUnit,
      status: statusBusinessUnit,
      reset: resetBusinessUnit,
    },
  ] = useLazyBusinessUnitQuery();

  const [
    getDepartment,
    {
      data: departmentData,
      isLoading: loadingDepartment,
      isSuccess: successDepartment,
      status: statusDepartment,
      reset: resetDepartment,
    },
  ] = useLazyDepartmentQuery();

  const [
    getUnit,
    {
      data: departmentUnitData,
      isLoading: loadingDepartmentUnit,
      isSuccess: successDepartmentUnit,
      status: statusUnit,
      reset: reseUnit,
    },
  ] = useLazyDepartmentUnitQuery();

  const [
    getSubUnit,
    {
      data: subUnitData,
      isLoading: loadingSubUnit,
      isSuccess: successSubUnit,
      status: statusSubUnit,
      reset: reseSubUnit,
    },
  ] = useLazySubUnitQuery();

  const [
    getLocation,
    {
      data: locationData,
      isLoading: loadingLocation,
      isSuccess: successLocation,
      status: statusLocation,
      reset: resetLocation,
    },
  ] = useLazyLocationQuery();

  const [addCoa, { isLoading: loadingCoaAdd }] = useAddCoaMutation();
  const [updateCoa, { isLoading: loadingCoaUpdate }] = useUpdateCoaMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(coaSchema),
    defaultValues: {
      company: null,
      business_unit: null,
      department: null,
      unit: null,
      sub_unit: null,
      location: null,
      name: "",
      code: "",
    },
  });

  const submitHandler = async (submitData) => {
    const updatePayload = {
      id: coaData?.id,
      code: submitData?.code,
      name: submitData?.name,
      company_id: submitData?.company?.id,
      business_unit_id: submitData?.business_unit?.id,
      department_id: submitData?.department?.id,
      department_unit_id: submitData?.unit?.id,
      sub_unit_id: submitData?.sub_unit?.id,
      location_id: submitData?.location?.id,
    };
    const createPayload = {
      name: submitData?.name,
      code: submitData?.code,
      company_id: submitData?.company?.id,
      business_unit_id: submitData?.business_unit?.id,
      department_id: submitData?.department?.id,
      department_unit_id: submitData?.unit?.id,
      sub_unit_id: submitData?.sub_unit?.id,
      location_id: submitData?.location?.id,
    };
    try {
      coaData !== null
        ? await updateCoa(updatePayload).unwrap()
        : await addCoa(createPayload).unwrap();
      enqueueSnackbar(
        coaData !== null
          ? "Successfully updated the data"
          : "Successfully created data",
        { variant: "success" }
      );
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (coaData && !hasExecuted.current) {
      console.log(coaData);
      getCompany({ search: coaData?.company_code, status: "active" });
      getBusinessUnit({
        status: "active",
        search: coaData?.business_unit_code,
      });
      getDepartment({
        status: "active",
        search: coaData?.department_code,
      });
      getUnit({ status: "active", search: coaData?.unit_code });
      getSubUnit({ status: "active", search: coaData?.sub_unit_code });
      getLocation({ status: "active", search: coaData?.location_code });
      hasExecuted.current = true;
    }

    if (
      coaData &&
      open &&
      successCompany &&
      successBusinessUnit &&
      successDepartment &&
      successDepartmentUnit &&
      successSubUnit &&
      successLocation
    ) {
      const newValue = {
        code: coaData?.code,
        name: coaData?.name,
        company: companyData?.data?.find(
          (item) => item?.code === coaData?.company_code
        ),
        business_unit: businessUnitData?.data?.find(
          (item) => item?.code === coaData?.business_unit_code
        ),
        department: departmentData?.data?.find(
          (item) => item?.code === coaData?.department_code
        ),
        unit: departmentUnitData?.data?.find(
          (item) => item?.code === coaData?.unit_code
        ),
        sub_unit: subUnitData?.data?.find(
          (item) => item?.code === coaData?.sub_unit_code
        ),
        location: locationData?.data?.find(
          (item) => item?.code === coaData?.location_code
        ),
      };

      Object.entries(newValue)?.forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [
    coaData,
    setValue,
    getCompany,
    getBusinessUnit,
    getDepartment,
    getUnit,
    getSubUnit,
    getLocation,
    open,
    successCompany,
    successBusinessUnit,
    successDepartment,
    successDepartmentUnit,
    successSubUnit,
    successLocation,
  ]);

  const getValue = useCallback((e, func) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      func({ status: "active", per_page: 10, search: e.target.value });
    }, 500);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setCategory(false));
        hasExecuted.current = false;
        coaData && dispatch(resetModal());
        coaData && reset();
      }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <Box minWidth={isTablet ? 400 : 300} padding={2}>
          <Stack gap={2} mb={3}>
            <Stack display="flex" alignItems="center" gap={1}>
              <img
                src={categoryImage}
                alt="Password"
                draggable="false"
                className="user-modal-image"
              />
            </Stack>
            <Stack
              gap={2}
              flexDirection={"column"}
              sx={{
                mb: 5,
              }}
            >
              <AppTextBox
                control={control}
                name={"code"}
                label="Code"
                error={Boolean(errors?.code)}
                helperText={errors?.code?.message}
              />
              <AppTextBox
                control={control}
                name={"name"}
                label="Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
              <Autocomplete
                loading={loadingCompany}
                control={control}
                name={"company"}
                options={companyData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                noOptionsText={
                  statusCompany !== "uninitialized"
                    ? "No Options"
                    : "Select a company"
                }
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onClose={() => {
                  if (watch("company") === null) {
                    resetCompany();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Company"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.company)}
                    helperText={errors.company?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        resetCompany();
                      } else {
                        getValue(e, getCompany);
                      }
                    }}
                  />
                )}
              />
              <Autocomplete
                loading={loadingBusinessUnit}
                control={control}
                name={"business_unit"}
                options={businessUnitData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                noOptionsText={
                  statusBusinessUnit !== "uninitialized"
                    ? "No Options"
                    : "Select a business unit"
                }
                onClose={() => {
                  if (watch("business_unit") === null) {
                    resetBusinessUnit();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Business Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.business_unit)}
                    helperText={errors.business_unit?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        resetBusinessUnit();
                      } else {
                        getValue(e, getBusinessUnit);
                      }
                    }}
                  />
                )}
              />
              <Autocomplete
                loading={loadingDepartment}
                control={control}
                name={"department"}
                options={departmentData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                noOptionsText={
                  statusDepartment !== "uninitialized"
                    ? "No Options"
                    : "Select a department"
                }
                onClose={() => {
                  if (watch("department") === null) {
                    resetDepartment();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Department"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.department)}
                    helperText={errors.department?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        resetDepartment();
                      } else {
                        getValue(e, getDepartment);
                      }
                    }}
                  />
                )}
              />
              <Autocomplete
                loading={loadingDepartmentUnit}
                control={control}
                name={"unit"}
                options={departmentUnitData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                noOptionsText={
                  statusUnit !== "uninitialized"
                    ? "No Options"
                    : "Select a unit"
                }
                onClose={() => {
                  if (watch("unit") === null) {
                    reseUnit();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.unit)}
                    helperText={errors.unit?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        reseUnit();
                      } else {
                        getValue(e, getUnit);
                      }
                    }}
                  />
                )}
              />
              <Autocomplete
                loading={loadingSubUnit}
                control={control}
                name={"sub_unit"}
                options={subUnitData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                noOptionsText={
                  statusSubUnit !== "uninitialized"
                    ? "No Options"
                    : "Select a sub unit"
                }
                onClose={() => {
                  if (watch("sub_unit") === null) {
                    reseSubUnit();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Sub Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.sub_unit)}
                    helperText={errors.sub_unit?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        reseSubUnit();
                      } else {
                        getValue(e, getSubUnit);
                      }
                    }}
                  />
                )}
              />
              <Autocomplete
                loading={loadingLocation}
                control={control}
                name={"location"}
                options={locationData?.data || []}
                getOptionLabel={(option) => `${option.code} - ${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                noOptionsText={
                  statusLocation !== "uninitialized"
                    ? "No Options"
                    : "Select a location"
                }
                onClose={() => {
                  if (watch("location") === null) {
                    resetLocation();
                  }
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Location"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.location)}
                    helperText={errors.location?.message}
                    onKeyUp={(e) => {
                      if (e?.target?.value === "") {
                        resetLocation();
                      } else {
                        getValue(e, getLocation);
                      }
                    }}
                  />
                )}
              />
            </Stack>
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
              onClick={() => {
                reset();
                dispatch(resetModal());
              }}
            >
              Close
            </Button>
            <Button
              loading={loadingCoaAdd || loadingCoaUpdate}
              disabled={
                watch("name") === "" ||
                watch("code") === "" ||
                watch("company") === null ||
                watch("business_unit") === null ||
                watch("department") === null ||
                watch("unit") === null ||
                watch("sub_unit") === null ||
                watch("location") === null
              }
              variant="contained"
              loadingPosition="start"
              startIcon={<CheckOutlinedIcon />}
              color="success"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </form>
    </Dialog>
  );
};

export default CoaModal;
