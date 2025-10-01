export const icnHeader = [
  {
    name: "Id",
    value: "id",
    wSort: true,
  },
  {
    name: "Code",
    value: "code",
    wSort: true,
  },
  {
    name: "Name",
    value: "name",
    wSort: true,
  },
];

export const cnHeader = [
  {
    name: "Id",
    value: "id",
    wSort: true,
  },
  {
    name: "Name",
    value: "name",
    wSort: true,
  },
];

export const errorHeader = [
  {
    name: "Code",
    value: "code",
  },
  {
    name: "Name",
    value: "name",
  },
];

export const oneChargingHeader = [
  {
    name: "Code",
    value: "code",
  },
  {
    name: "Name",
    value: "name",
  },
  {
    name: "Company",
    value: "company_name",
  },
  {
    name: "Business Unit",
    value: "business_unit_name",
  },
  {
    name: "Department",
    value: "department_name",
  },
  {
    name: "Unit",
    value: "unit_name",
  },
  {
    name: "Sub unit",
    value: "sub_unit_name",
  },
  {
    name: "Location",
    value: "location_name",
  },
];

export const errorHeaderOC = [
  {
    name: "Code",
    value: "code",
  },
  {
    name: "Name",
    value: "name",
  },
  {
    name: "Company",
    value: "company",
  },
  {
    name: "Business Unit",
    value: "business_unit",
  },
  {
    name: "Department",
    value: "department",
  },
  {
    name: "Unit",
    value: "department_unit",
  },
  {
    name: "Sub unit",
    value: "sub_unit",
  },
  {
    name: "Location",
    value: "location",
  },
];

export const accountTitleHeader = [
  { type: "box", alignHeader: "center" },
  {
    name: "Code",
    value: "code",
    wSort: true,
  },
  {
    name: "Name",
    value: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Account Type",
    value: "account_type",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Account Group",
    value: "account_group",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Account SubGroup",
    value: "account_sub_group",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Financial Statement",
    value: "financial_statement",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Normal Balance",
    value: "normal_balance",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Allocation",
    value: "allocation",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Unit",
    value: "account_unit",
    child: "name",
    wSort: true,
  },
  {
    type: "parent",
    name: "Charge",
    value: "charge",
    child: "name",
    wSort: true,
  },
];
