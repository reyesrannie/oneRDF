import React, { lazy } from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import WysiwygOutlinedIcon from "@mui/icons-material/WysiwygOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined";
import PlaylistAddCheckCircleOutlinedIcon from "@mui/icons-material/PlaylistAddCheckCircleOutlined";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import EditLocationOutlinedIcon from "@mui/icons-material/EditLocationOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SpeakerNotesOutlinedIcon from "@mui/icons-material/SpeakerNotesOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import HowToVoteOutlinedIcon from "@mui/icons-material/HowToVoteOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";

const Dashboard = lazy(() => import("../../screens/dashboard/Dashboard"));
const UserManagement = lazy(() => import("../../screens/user/UserManagement"));
const Masterlist = lazy(() => import("../../screens/masterlist/Masterlist"));
const Systems = lazy(() => import("../../screens/masterlist/system/Systems"));
const Category = lazy(
  () => import("../../screens/masterlist/category/Category")
);
const Company = lazy(() => import("../../screens/charging/company/Company"));
const BusinessUnit = lazy(
  () => import("../../screens/charging/business-unit/BusinessUnit")
);
const Department = lazy(
  () => import("../../screens/charging/department/Department")
);
const UnitDepartment = lazy(
  () => import("../../screens/charging/unit-department/UnitDepartment")
);
const SubUnit = lazy(() => import("../../screens/charging/sub-unit/SubUnit"));
const Location = lazy(() => import("../../screens/charging/location/Location"));
const ChargingOfAccount = lazy(
  () => import("../../screens/charging/charging of account/ChargingOfAccount")
);
const NotificationSetup = lazy(
  () => import("../../screens/notification-setup/NotificationSetup")
);
const Charging = lazy(() => import("../../screens/charging/Charging"));
const Coa = lazy(() => import("../../screens/coa/Coa"));
const AccountGroup = lazy(
  () => import("../../screens/coa/account-group/AccountGroup")
);
const AccountSubGroup = lazy(
  () => import("../../screens/coa/account-sub-group/AccountSubGroup")
);
const AccountType = lazy(
  () => import("../../screens/coa/account-type/AccountType")
);
const AccountUnit = lazy(
  () => import("../../screens/coa/account-unit/AccountUnit")
);
const FinancialStatement = lazy(
  () => import("../../screens/coa/financial-statement/FinancialStatement")
);
const NormalBalance = lazy(
  () => import("../../screens/coa/normal-balance/NormalBalance")
);
const Credit = lazy(() => import("../../screens/coa/credit/Credit"));
const AccountCharging = lazy(
  () => import("../../screens/coa/account-charging/AccountCharging")
);
const AccountTitle = lazy(
  () => import("../../screens/coa/account-title/AccountTitle")
);
const Allocation = lazy(
  () => import("../../screens/coa/allocation/Allocation")
);
const Sync = lazy(() => import("../../screens/syncing/Sync"));
const SyncOneCharging = lazy(
  () => import("../../screens/syncing/charging/SyncOneCharging")
);

const SystemNavigation = () => {
  const navigation = [
    {
      segment: "",
      title: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      route: "/",
      element: <Dashboard />,
      permission: ["dashboard", "dashlinks"],
    },
    {
      segment: "user-management",
      title: "Users",
      icon: <PermContactCalendarOutlinedIcon />,
      route: "/user-management",
      element: <UserManagement />,
      permission: ["user"],
    },
    {
      segment: "masterlist",
      title: "Masterlist",
      icon: <ListAltOutlinedIcon />,
      route: "/masterlist",
      element: <Masterlist />,
      permission: ["system", "category"],

      children: [
        {
          segment: "systems",
          title: "Systems",
          icon: <WysiwygOutlinedIcon />,
          element: <Systems />,
          route: "/masterlist/systems",
          permission: ["system"],
        },
        {
          segment: "category",
          title: "Category",
          icon: <CategoryOutlinedIcon />,
          element: <Category />,
          route: "/masterlist/category",
          permission: ["category"],
        },
      ],
    },
    {
      segment: "charging",
      title: "Charging",
      icon: <PaymentIcon />,
      route: "/charging",
      element: <Charging />,
      permission: [
        "company",
        "business_unit",
        "department",
        "unit-department",
        "sub-unit",
        "location",
        "oneCharging",
      ],

      children: [
        {
          segment: "company",
          title: "Company",
          icon: <ApartmentOutlinedIcon />,
          element: <Company />,
          route: "/charging/company",
          permission: ["company"],
        },
        {
          segment: "business-unit",
          title: "Business Unit",
          icon: <AddBusinessOutlinedIcon />,
          element: <BusinessUnit />,
          route: "/charging/business-unit",
          permission: ["business_unit"],
        },
        {
          segment: "department",
          title: "Department",
          icon: <ScatterPlotOutlinedIcon />,
          element: <Department />,
          route: "/charging/department",
          permission: ["department"],
        },
        {
          segment: "unit-department",
          title: "Unit",
          icon: <PlaylistAddCheckCircleOutlinedIcon />,
          element: <UnitDepartment />,
          route: "/charging/unit-department",
          permission: ["unit-department"],
        },
        {
          segment: "sub-unit",
          title: "Sub Unit",
          icon: <PlaylistAddCheckOutlinedIcon />,
          element: <SubUnit />,
          route: "/charging/sub-unit",
          permission: ["sub-unit"],
        },
        {
          segment: "location",
          title: "Location",
          icon: <EditLocationOutlinedIcon />,
          element: <Location />,
          route: "/charging/location",
          permission: ["location"],
        },
        {
          segment: "oneCharging",
          title: "One Charging",
          icon: <PaymentIcon />,
          element: <ChargingOfAccount />,
          route: "/charging/oneCharging",
          permission: ["oneCharging"],
        },
      ],
    },
    {
      segment: "coa",
      title: "Chart of Account",
      icon: <InsertChartOutlinedIcon />,
      route: "/coa",
      element: <Coa />,
      permission: ["account_group", "account_sub_group", "account_type"],

      children: [
        {
          segment: "account-group",
          title: "Account Group",
          icon: <Groups2OutlinedIcon />,
          element: <AccountGroup />,
          route: "/coa/account-group",
          permission: ["account_group"],
        },
        {
          segment: "account-sub-group",
          title: "Account SubGroup",
          icon: <Diversity2OutlinedIcon />,
          element: <AccountSubGroup />,
          route: "/coa/account-sub-group",
          permission: ["account_sub_group"],
        },
        {
          segment: "account-type",
          title: "Account Type",
          icon: <AssignmentIndOutlinedIcon />,
          element: <AccountType />,
          route: "/coa/account-type",
          permission: ["account_type"],
        },
        {
          segment: "account-unit",
          title: "Account Unit",
          icon: <ApartmentOutlinedIcon />,
          element: <AccountUnit />,
          route: "/coa/account-unit",
          permission: ["account_unit"],
        },
        {
          segment: "financial-statement",
          title: "Financial Statement",
          icon: <LocalAtmOutlinedIcon />,
          element: <FinancialStatement />,
          route: "/coa/financial-statement",
          permission: ["financial_statement"],
        },
        {
          segment: "normal-balance",
          title: "Normal Balance",
          icon: <BalanceOutlinedIcon />,
          element: <NormalBalance />,
          route: "/coa/normal-balance",
          permission: ["normal_balance"],
        },
        {
          segment: "allocation",
          title: "Allocation",
          icon: <HowToVoteOutlinedIcon />,
          element: <Allocation />,
          route: "/coa/allocation",
          permission: ["allocation"],
        },
        {
          segment: "credit",
          title: "Credit",
          icon: <PaidOutlinedIcon />,
          element: <Credit />,
          route: "/coa/credit",
          permission: ["credit"],
        },
        {
          segment: "charge",
          title: "Charging",
          icon: <SpeakerNotesOutlinedIcon />,
          element: <AccountCharging />,
          route: "/coa/charge",
          permission: ["charge"],
        },
        {
          segment: "account-title",
          title: "Account Title",
          icon: <TitleOutlinedIcon />,
          element: <AccountTitle />,
          route: "/coa/account-title",
          permission: ["account_title"],
        },
      ],
    },
    {
      segment: "sync",
      title: "Sync",
      icon: <CloudSyncOutlinedIcon />,
      route: "/sync",
      element: <Sync />,
      permission: ["sync-charging"],
      children: [
        {
          segment: "syncCharging",
          title: "One Charging",
          icon: <PaymentIcon />,
          element: <SyncOneCharging />,
          route: "/sync/syncCharging",
          permission: ["sync-charging"],
        },
      ],
    },
    {
      segment: "notification-setup",
      title: "Notification Setup",
      icon: <NotificationsActiveOutlinedIcon />,
      route: "/notification-setup",
      element: <NotificationSetup />,
      permission: ["notification-setup"],
    },
  ];

  const getFirstAccessibleRoute = (navigation, userPermissions) => {
    for (const navItem of navigation) {
      const hasPermission = navItem.permission?.some((p) =>
        userPermissions?.includes(p)
      );
      if (hasPermission) {
        if (navItem.children?.length) {
          const child = getFirstAccessibleRoute(
            navItem.children,
            userPermissions
          );
          return child || navItem.route;
        }
        return navItem.route;
      }
    }
    return "/";
  };

  return { navigation, getFirstAccessibleRoute };
};

export default SystemNavigation;
