import {
  Box,
  Button,
  Dialog,
  Stack,
  useMediaQuery,
  TextField as MuiTextField,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
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

import accountTitleSchema from "../schema/accountTitleSchema";
import { useAccountTypeQuery } from "../../services/server/api/accountTypeAPI";
import { nopagination } from "../../services/constant/systemQuery";
import { useAccountGroupQuery } from "../../services/server/api/accountGroupAPI";
import { useAccountSubGroupQuery } from "../../services/server/api/accountSubGroupAPI";
import { useFinancialStatementQuery } from "../../services/server/api/financialStatementAPI";
import { useNormalBalanceQuery } from "../../services/server/api/normalBalanceAPI";
import { useAccountUnitQuery } from "../../services/server/api/accountUnitAPI";
import { useAllocationQuery } from "../../services/server/api/allocationAPI";
import { useChargeQuery } from "../../services/server/api/accountChargingAPI";
import {
  useAddAccountTitleMutation,
  useUpdateAccountTitleMutation,
} from "../../services/server/api/accountTitleAPI";

const AccountTitleModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const open = useSelector((state) => state.modal.accountTitle);
  const accountTitleData = useSelector((state) => state.modal.accountTitleData);
  const hasRun = useSelector((state) => state.modal.hasRun);

  const isTablet = useMediaQuery("(min-width:768px)");

  const { data: accountTypeData, isLoading: loadingAccountType } =
    useAccountTypeQuery(nopagination);
  const { data: accountGroupData, isLoading: loadingAccountGroup } =
    useAccountGroupQuery(nopagination);
  const { data: accountSubGroupData, isLoading: loadingAccounSubGroup } =
    useAccountSubGroupQuery(nopagination);
  const { data: financialStatementData, isLoading: loadingFinancialStatement } =
    useFinancialStatementQuery(nopagination);
  const { data: normalBalanceData, isLoading: loadingNormalBalance } =
    useNormalBalanceQuery(nopagination);
  const { data: allocationData, isLoading: loadingAllocation } =
    useAllocationQuery(nopagination);
  const { data: unitData, isLoading: loadingUnit } =
    useAccountUnitQuery(nopagination);
  const { data: chargeData, isLoading: loadingCharge } =
    useChargeQuery(nopagination);

  const [addAccountTitle, { isLoading: loadingAdd }] =
    useAddAccountTitleMutation();
  const [updateAccountTitle, { isLoading: loadingUpdate }] =
    useUpdateAccountTitleMutation();

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(accountTitleSchema),
    defaultValues: {
      name: "",
      code: "",
      account_type_id: null,
      account_group_id: null,
      account_sub_group_id: null,
      financial_statement_id: null,
      normal_balance_id: null,
      allocation_id: null,
      account_unit_id: null,
      charge_id: null,
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      ...submitData,
      account_group_id: submitData?.account_group_id?.id || "",
      account_sub_group_id: submitData?.account_sub_group_id?.id || "",
      account_type_id: submitData?.account_type_id?.id || "",
      account_unit_id: submitData?.account_unit_id?.id || "",
      allocation_id: submitData?.allocation_id?.id || "",
      charge_id: submitData?.charge_id?.id || "",
      financial_statement_id: submitData?.financial_statement_id?.id || "",
      normal_balance_id: submitData?.normal_balance_id?.id || "",
      id: accountTitleData?.id || undefined,
    };

    try {
      const res =
        accountTitleData !== null
          ? await updateAccountTitle(payload).unwrap()
          : await addAccountTitle(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const mapAccountTitle = () => {
    if (hasRun) return;
    const newData = {
      code: accountTitleData?.code || "",
      name: accountTitleData?.name || "",
      account_group_id: accountTitleData?.account_group || null,
      account_sub_group_id: accountTitleData?.account_sub_group || null,
      account_type_id: accountTitleData?.account_type || null,
      account_unit_id: accountTitleData?.account_unit || null,
      allocation_id: accountTitleData?.allocation || null,
      charge_id: accountTitleData?.charge || null,
      financial_statement_id: accountTitleData?.financial_statement || null,
      normal_balance_id: accountTitleData?.normal_balance || null,
    };

    Object.entries(newData)?.forEach(([key, value]) => {
      setValue(key, value);
    });
  };

  useEffect(() => {
    if (accountTitleData !== null) {
      mapAccountTitle();
    } else {
      reset();
    }
  }, [accountTitleData]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(resetModal());
      }}
    >
      <DialogContentText
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "450px",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <img
          src={categoryImage}
          alt="Password"
          draggable="false"
          className="user-modal-image"
        />
      </DialogContentText>

      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack>
            <Stack gap={2} flexDirection={"column"}>
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
                loading={loadingAccountType}
                control={control}
                name={"account_type_id"}
                options={accountTypeData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Account Type"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_type_id)}
                    helperText={errors.account_type_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingAccountGroup}
                control={control}
                name={"account_group_id"}
                options={accountGroupData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Account Group"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_group_id)}
                    helperText={errors.account_group_id?.message}
                  />
                )}
              />

              <Autocomplete
                loading={loadingAccounSubGroup}
                control={control}
                name={"account_sub_group_id"}
                options={accountSubGroupData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Account Sub Group"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_sub_group_id)}
                    helperText={errors.account_sub_group_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingFinancialStatement}
                control={control}
                name={"financial_statement_id"}
                options={financialStatementData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Financial Statement"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.financial_statement_id)}
                    helperText={errors.financial_statement_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingNormalBalance}
                control={control}
                name={"normal_balance_id"}
                options={normalBalanceData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Normal Balance"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.normal_balance_id)}
                    helperText={errors.normal_balance_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingAllocation}
                control={control}
                name={"allocation_id"}
                options={allocationData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Allocation"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.allocation_id)}
                    helperText={errors.allocation_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingUnit}
                control={control}
                name={"account_unit_id"}
                options={unitData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Unit"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.account_unit_id)}
                    helperText={errors.account_unit_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingCharge}
                control={control}
                name={"charge_id"}
                options={chargeData || []}
                getOptionLabel={(option) => `${option.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Charge"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.charge_id)}
                    helperText={errors.charge_id?.message}
                  />
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack flexDirection={"row"} bottom={0} right={0} padding={2} gap={1}>
            <Button
              disabled={loadingAdd || loadingUpdate}
              variant="contained"
              color="error"
              size="small"
              startIcon={<ClearOutlinedIcon />}
              onClick={() => {
                reset();
                dispatch(resetModal());
              }}
            >
              Close
            </Button>
            <Button
              loading={loadingAdd || loadingUpdate}
              disabled={
                watch("code") === "" ||
                watch("name") === "" ||
                watch("account_group_id") === null ||
                watch("account_sub_group_id") === null ||
                watch("account_type_id") === null ||
                watch("account_unit_id") === null ||
                watch("charge_id") === null ||
                watch("financial_statement_id") === null ||
                watch("normal_balance_id") === null
              }
              variant="contained"
              loadingPosition="start"
              startIcon={<CheckOutlinedIcon />}
              color="success"
              size="small"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountTitleModal;
