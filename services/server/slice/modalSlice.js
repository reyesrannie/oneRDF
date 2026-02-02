import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: false,
  userData: null,
  system: false,
  systemData: null,
  systemEndpoint: false,
  notificationSetup: false,
  notificationSetupData: null,
  category: false,
  categoryData: null,
  systemSlicer: null,
  defaultTab: 0,
  profile: null,
  access: [],
  systems: [],
  systemImage: [],
  systemImageData: null,
  multipleView: false,
  import: false,
  importData: null,
  importError: false,
  importErrorMessage: null,
  isLoading: false,
  hasRun: false,

  //One Charging Starts here -->
  company: false,
  companyData: null,
  businessUnit: false,
  businessUnitData: null,
  department: false,
  departmentData: null,
  departmentUnit: false,
  departmentUnitData: null,
  subUnit: false,
  subUnitData: null,
  location: false,
  locationData: null,
  coa: false,
  coaData: null,
  // <-- One Charging Ends here

  //Account Title Starts here -->
  accountGroup: false,
  accountGroupData: null,
  accountSubGroup: false,
  accountSubGroupData: null,
  accountType: false,
  accounTypeData: null,
  accountUnit: false,
  accounUnitData: null,
  financialStatement: false,
  financialStatementData: null,
  normalBalance: false,
  normalBalanceData: null,
  credit: false,
  creditData: null,
  accountTitle: false,
  accountTitleData: null,
  allocation: false,
  allocationData: null,
  charge: false,
  chargeData: null,
  // <-- Account Title Ends here

  //Supplier Starts here -->
  termData: null,
  type: false,
  typeData: null,
  buffer: false,
  bufferData: null,
  reference: false,
  referenceData: null,
  supplier: false,
  supplierData: null,
  // <-- Supplier Ends here
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSystem: (state, action) => {
      state.system = action.payload;
    },
    setSystemData: (state, action) => {
      state.systemData = action.payload;
    },
    setSystemEndpoint: (state, action) => {
      state.systemEndpoint = action.payload;
    },
    setNotificationSetup: (state, action) => {
      state.notificationSetup = action.payload;
    },
    setNotificationSetupData: (state, action) => {
      state.notificationSetupData = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setCategoryData: (state, action) => {
      state.categoryData = action.payload;
    },
    setHasRun: (state, action) => {
      state.hasRun = action.payload;
    },

    //One Charging Starts here -->
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setCompanyData: (state, action) => {
      state.companyData = action.payload;
    },
    setBusinessUnit: (state, action) => {
      state.businessUnit = action.payload;
    },
    setBusinessUnitData: (state, action) => {
      state.businessUnitData = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    setDepartmentData: (state, action) => {
      state.departmentData = action.payload;
    },
    setDepartmentUnit: (state, action) => {
      state.departmentUnit = action.payload;
    },
    setDepartmentUnitData: (state, action) => {
      state.departmentUnitData = action.payload;
    },
    setSubUnit: (state, action) => {
      state.subUnit = action.payload;
    },
    setSubUnitData: (state, action) => {
      state.subUnitData = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setLocationData: (state, action) => {
      state.locationData = action.payload;
    },

    setCoa: (state, action) => {
      state.coa = action.payload;
    },
    setCoaData: (state, action) => {
      state.coaData = action.payload;
    },
    // <-- One Charging Ends here

    //Account Title Starts here -->
    setAccountGroup: (state, action) => {
      state.accountGroup = action.payload;
    },
    setAccountGroupData: (state, action) => {
      state.accountGroupData = action.payload;
    },
    setAccountSubGroup: (state, action) => {
      state.accountSubGroup = action.payload;
    },
    setAccountSubGroupData: (state, action) => {
      state.accountSubGroupData = action.payload;
    },
    setAccountType: (state, action) => {
      state.accountType = action.payload;
    },
    setAccountTypeData: (state, action) => {
      state.accounTypeData = action.payload;
    },
    setAccountUnit: (state, action) => {
      state.accountUnit = action.payload;
    },
    setAccountUnitData: (state, action) => {
      state.accounUnitData = action.payload;
    },
    setFinancialStatement: (state, action) => {
      state.financialStatement = action.payload;
    },
    setFinancialStatementData: (state, action) => {
      state.financialStatementData = action.payload;
    },
    setNormalBalance: (state, action) => {
      state.normalBalance = action.payload;
    },
    setNormalBalanceData: (state, action) => {
      state.normalBalanceData = action.payload;
    },
    setCredit: (state, action) => {
      state.credit = action.payload;
    },
    setCreditData: (state, action) => {
      state.creditData = action.payload;
    },
    setAccountTitle: (state, action) => {
      state.accountTitle = action.payload;
    },
    setAccountTitleData: (state, action) => {
      state.accountTitleData = action.payload;
    },
    setAllocation: (state, action) => {
      state.allocation = action.payload;
    },
    setAllocationData: (state, action) => {
      state.allocationData = action.payload;
    },
    setCharge: (state, action) => {
      state.charge = action.payload;
    },
    setChargeData: (state, action) => {
      state.chargeData = action.payload;
    },
    // <-- Account Title Ends here

    //Supplier Starts here -->

    setType: (state, action) => {
      state.type = action.payload;
    },
    setTypeData: (state, action) => {
      state.typeData = action.payload;
    },
    setBuffer: (state, action) => {
      state.buffer = action.payload;
    },
    setBufferData: (state, action) => {
      state.bufferData = action.payload;
    },
    setReference: (state, action) => {
      state.reference = action.payload;
    },
    setReferenceData: (state, action) => {
      state.referenceData = action.payload;
    },
    setSupplier: (state, action) => {
      state.supplier = action.payload;
    },
    setSupplierData: (state, action) => {
      state.supplierData = action.payload;
    },
    // <-- Supplier Ends here

    setSystemSlicer: (state, action) => {
      state.systemSlicer = action.payload;
    },
    setDefaultTab: (state, action) => {
      state.defaultTab = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAccess: (state, action) => {
      state.access = action.payload;
    },
    setSystems: (state, action) => {
      state.systems = action.payload;
    },
    setSystemImage: (state, action) => {
      state.systemImage.push(action.payload);
    },
    setSystemImageData: (state, action) => {
      state.systemImageData = action.payload;
    },
    setMultipleView: (state, action) => {
      state.multipleView = action.payload;
    },
    setImport: (state, action) => {
      state.import = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setImportData: (state, action) => {
      state.importData = action.payload;
    },
    setImportError: (state, action) => {
      state.importError = action.payload;
    },
    setImportErrorMessage: (state, action) => {
      state.importErrorMessage = action.payload;
    },
    resetModal: () => {
      return initialState;
    },
  },
});

export const {
  setUser,
  setUserData,
  setSystem,
  setSystemData,
  setSystemEndpoint,
  setNotificationSetup,
  setNotificationSetupData,
  setHasRun,

  // One Charging
  setCompany,
  setCompanyData,
  setBusinessUnit,
  setBusinessUnitData,
  setDepartment,
  setDepartmentData,
  setDepartmentUnit,
  setDepartmentUnitData,
  setSubUnit,
  setSubUnitData,
  setLocation,
  setLocationData,
  setCoa,
  setCoaData,
  // One Charging

  // Account Title
  setCategory,
  setCategoryData,
  setAccountGroup,
  setAccountGroupData,
  setAccountSubGroup,
  setAccountSubGroupData,
  setAccountType,
  setAccountTypeData,
  setAccountUnit,
  setAccountUnitData,
  setFinancialStatement,
  setFinancialStatementData,
  setNormalBalance,
  setNormalBalanceData,
  setCredit,
  setCreditData,
  setAccountTitle,
  setAccountTitleData,
  setAllocation,
  setAllocationData,
  setCharge,
  setChargeData,
  // Account Title

  //Supplier

  setType,
  setTypeData,
  setBuffer,
  setBufferData,
  setReference,
  setReferenceData,
  setSupplier,
  setSupplierData,
  //Supplier

  setSystemSlicer,
  setDefaultTab,
  setProfile,
  setAccess,
  setSystems,
  setSystemImage,
  setSystemImageData,
  setMultipleView,
  setImport,
  setIsLoading,
  setImportData,
  setImportError,
  setImportErrorMessage,
  resetModal,
} = modalSlice.actions;

export default modalSlice.reducer;
