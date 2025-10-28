const systemName = "OneRDF";
const systemVariant = "";
const userRoles = [
  {
    name: "Dashboard",
    child: [
      { name: "Dashboard", value: "dashboard" },
      { name: "Dashboard (Only)", value: "dashlinks" },
    ],
  },
  { name: "Account Management", child: [{ name: "User", value: "user" }] },
  {
    name: "Masterlist",
    child: [
      { name: "System", value: "system" },
      { name: "Category", value: "category" },
    ],
  },

  {
    name: "One charging",
    child: [
      { name: "Company", value: "company" },
      { name: "Business Unit", value: "business_unit" },
      { name: "Department", value: "department" },
      { name: "Unit", value: "unit-department" },
      { name: "Sub-unit", value: "sub-unit" },
      { name: "Location", value: "location" },
      { name: "One Charging", value: "oneCharging" },
    ],
  },
  {
    name: "Chart of account",
    child: [
      { name: "Account Title", value: "account_title" },
      { name: "Account Group", value: "account_group" },
      { name: "Account Sub Group", value: "account_sub_group" },
      { name: "Account Type", value: "account_type" },
      { name: "Account Unit", value: "account_unit" },
      { name: "Financial Statement", value: "financial_statement" },
      { name: "Normal Balance", value: "normal_balance" },
      { name: "Allocation", value: "allocation" },
      { name: "Credit", value: "credit" },
      { name: "Charge", value: "charge" },
    ],
  },

  {
    name: "Customer Listing",
    child: [
      { name: "Customer", value: "customer" },
      { name: "Geographics", value: "geo" },
    ],
  },
  {
    name: "Syncing",
    child: [{ name: "One Charging", value: "sync-charging" }],
  },
];

export { systemName, systemVariant, userRoles };
