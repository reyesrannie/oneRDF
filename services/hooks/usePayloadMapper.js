import { useChargeQuery } from "../server/api/accountChargingAPI";
import { useAccountGroupQuery } from "../server/api/accountGroupAPI";
import { useAccountSubGroupQuery } from "../server/api/accountSubGroupAPI";
import { useAccountTypeQuery } from "../server/api/accountTypeAPI";
import { useAccountUnitQuery } from "../server/api/accountUnitAPI";
import { useAllocationQuery } from "../server/api/allocationAPI";
import { useFinancialStatementQuery } from "../server/api/financialStatementAPI";
import { useNormalBalanceQuery } from "../server/api/normalBalanceAPI";

const usePayloadMapper = () => {
  const { data: accountType } = useAccountTypeQuery({
    status: "active",
    pagination: "none",
  });

  const { data: accountGroup } = useAccountGroupQuery({
    status: "active",
    pagination: "none",
  });

  const { data: accountSubGroup } = useAccountSubGroupQuery({
    status: "active",
    pagination: "none",
  });

  const { data: financialStatement } = useFinancialStatementQuery({
    status: "active",
    pagination: "none",
  });
  const { data: normalBalance } = useNormalBalanceQuery({
    status: "active",
    pagination: "none",
  });
  const { data: allocation } = useAllocationQuery({
    status: "active",
    pagination: "none",
  });
  const { data: accountUnit } = useAccountUnitQuery({
    status: "active",
    pagination: "none",
  });
  const { data: charge } = useChargeQuery({
    status: "active",
    pagination: "none",
  });

  const mapImportAccountTitle = (data) => {
    const items = data?.map((titles) => ({
      ...titles,
      account_type_id: accountType?.find(
        (type) => type?.name === titles?.account_type_id
      )?.id,
      account_group_id: accountGroup?.find(
        (type) => type?.name === titles?.account_group_id
      )?.id,
      account_sub_group_id: accountSubGroup?.find(
        (type) => type?.name === titles?.account_sub_group_id
      )?.id,
      financial_statement_id: financialStatement?.find(
        (type) => type?.name === titles?.financial_statement_id
      )?.id,
      normal_balance_id: normalBalance?.find(
        (type) => type?.name === titles?.normal_balance_id
      )?.id,
      account_unit_id: accountUnit?.find(
        (type) => type?.name === titles?.account_unit_id
      )?.id,
      allocation_id:
        allocation?.find((type) => type?.name === titles?.allocation_id)?.id ||
        "",
      charge_id: charge?.find((type) => type?.name === titles?.charge_id)?.id,
    }));

    console.log(accountSubGroup);

    return items;
  };

  return { mapImportAccountTitle };
};

export default usePayloadMapper;
