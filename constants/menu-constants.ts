import type { IconType } from "react-icons";
import {
  MdDashboard,
  MdAssessment,
  MdBusinessCenter,
  MdPeople,
  MdMoney,
  MdAssignment,
  MdDescription,
  MdDateRange,
  MdAnnouncement,
  MdPersonAdd,
  MdCalendarToday,
  MdCloudUpload,
  MdSettingsApplications,
  MdAssignmentTurnedIn,
  MdHolidayVillage,
  MdWork,
  MdListAlt,
  MdAnalytics,
  MdImportantDevices,
} from "react-icons/md";
import {
  FaChevronCircleRight,
  FaChartBar,
  FaChevronDown,
  FaTruck,
  FaKey,
} from "react-icons/fa";

// Type Definition with allowedRoles
export type MenuItemProps = {
  menuItemText: string;
  menuItemLink?: string;
  Icon?: IconType;
  color?: string;
  submenu: boolean;
  subMenuItems: MenuItemProps[];
  allowedRoles: ("ADMIN" | "STAFF" | "SUPER_ADMIN")[];
  featureKey?: string;
  minSubscriptionLevel?: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE";
};

// Color Constants
const COLORS = {
  blue: "text-blue-500",
  green: "text-green-500",
  yellow: "text-yellow-500",
  red: "text-red-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  indigo: "text-indigo-500",
  teal: "text-teal-500",
  orange: "text-orange-500",
  cyan: "text-cyan-600",
  gray: "text-gray-500",
  lime: "text-lime-500",
};

// Base URL Constants
const BASE_URLS = {
  ADMIN: "/admin",
  STAFF: "/staff",
  SUPER_ADMIN: "/super-admin",
};

// Enhanced helper to create menu items with allowedRoles
const createMenuItem = (
  text: string,
  roles: ("ADMIN" | "STAFF" | "SUPER_ADMIN")[],
  link?: string,
  Icon?: IconType,
  color: string = COLORS.blue,
  subItems: MenuItemProps[] = [],
  featureKey?: string,
  minSubscriptionLevel: "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE" = "BASIC"
): MenuItemProps => ({
  menuItemText: text,
  menuItemLink: link,
  Icon,
  color,
  submenu: subItems.length > 0,
  subMenuItems: subItems,
  allowedRoles: roles,
  featureKey,
  minSubscriptionLevel,
});

export const adminMenuItems: MenuItemProps[] = [
  createMenuItem(
    "Dashboard",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}`,
    MdDashboard,
    COLORS.blue
  ),
  createMenuItem(
    "Inheritance Certificate",
    ["ADMIN"],
    undefined,
    FaChevronCircleRight,
    COLORS.yellow,
    [
      createMenuItem(
        "Application Lifecycle",
        ["ADMIN"],
        undefined,
        FaChevronDown,
        COLORS.teal,
        [
          createMenuItem(
            "New Application",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/application`,
            FaChevronCircleRight,
            COLORS.teal,
            [],
            undefined,
            "STANDARD"
          ),
          createMenuItem(
            "Bulk Applications",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/bulk-upload`,
            FaChevronCircleRight,
            COLORS.blue,
            [],
            undefined,
            "STANDARD"
          ),
          createMenuItem(
            "Document Upload",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/pending-uploaddoc`,
            FaChevronCircleRight,
            COLORS.teal,
            [],
            undefined,
            "BASIC"
          ),
          createMenuItem(
            "Verification",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/verify-document`,
            FaChevronCircleRight,
            COLORS.teal,
            [],
            undefined,
            "STANDARD"
          ),
        ]
      ),
      createMenuItem(
        "Workflow",
        ["ADMIN"],
        undefined,
        FaChevronDown,
        COLORS.blue,
        [
          createMenuItem(
            "Assign to Staff",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/assign-staff`,
            FaChevronCircleRight,
            COLORS.blue,
            [],
            undefined,
            "STANDARD"
          ),
          createMenuItem(
            "Public Assignments",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/assign-citizen`,
            FaChevronCircleRight,
            COLORS.blue,
            [],
            undefined,
            "PREMIUM"
          ),
          createMenuItem(
            "Approval Process",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/approve`,
            FaChevronCircleRight,
            COLORS.blue,
            [],
            undefined,
            "STANDARD"
          ),
        ]
      ),
      createMenuItem(
        "Output",
        ["ADMIN"],
        undefined,
        FaChevronDown,
        COLORS.green,
        [
          createMenuItem(
            "Certificate Printing",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/print`,
            FaChevronCircleRight,
            COLORS.green,
            [],
            undefined,
            "STANDARD"
          ),
          createMenuItem(
            "Generate Certificate",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/generate`,
            FaChevronCircleRight,
            COLORS.green,
            [],
            undefined,
            "STANDARD"
          ),
          createMenuItem(
            "Renewal Processing",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/renew`,
            FaChevronCircleRight,
            COLORS.blue,
            [],
            undefined,
            "PREMIUM"
          ),
        ]
      ),
      createMenuItem(
        "Monitoring",
        ["ADMIN"],
        undefined,
        FaChevronDown,
        COLORS.cyan,
        [
          createMenuItem(
            "Status Tracking",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/status`,
            FaChevronCircleRight,
            COLORS.purple,
            [],
            undefined,
            "BASIC"
          ),
          createMenuItem(
            "Performance Metrics",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/metrics`,
            FaChevronCircleRight,
            COLORS.orange,
            [],
            undefined,
            "PREMIUM"
          ),
          createMenuItem(
            "Correction Requests",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/manage-warish/correction-requests`,
            FaChevronCircleRight,
            COLORS.red,
            [],
            undefined,
            "STANDARD"
          ),
        ]
      ),
    ]
  ),
  createMenuItem(
    "Users",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/users`,
    MdPeople,
    COLORS.green
  ),
  createMenuItem(
    "Register User",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/users/register`,
    MdPersonAdd,
    COLORS.green
  ),
  createMenuItem(
    "Gram Panchayat",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/gram-panchayats`,
    MdHolidayVillage,
    COLORS.purple,
    [],
    "feature.gpMenu.enabled",
    "STANDARD"
  ),
  createMenuItem(
    "Applications",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/manage-warish/application`,
    MdListAlt,
    COLORS.orange
  ),
  createMenuItem(
    "New Application",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/manage-warish/application/new`,
    MdAssignmentTurnedIn,
    COLORS.orange
  ),
];

export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem(
    "Dashboard",
    ["STAFF"],
    `${BASE_URLS.STAFF}`,
    MdDashboard,
    COLORS.blue
  ),
  createMenuItem(
    "Certificate Processing",
    ["STAFF"],
    undefined,
    MdAssignment,
    COLORS.red,
    [
      createMenuItem(
        "My Assignments",
        ["STAFF"],
        undefined,
        FaChevronCircleRight,
        COLORS.yellow,
        [
          createMenuItem(
            "Current Tasks",
            ["STAFF"],
            `${BASE_URLS.STAFF}/warish/view-assigned`,
            FaChevronCircleRight,
            COLORS.yellow
          ),
          createMenuItem(
            "Process Applications",
            ["STAFF"],
            `${BASE_URLS.STAFF}/warish/process`,
            FaChevronCircleRight,
            COLORS.green
          ),
        ]
      ),
      createMenuItem(
        "Documentation",
        ["STAFF"],
        undefined,
        FaChevronCircleRight,
        COLORS.teal,
        [
          createMenuItem(
            "Upload Documents",
            ["STAFF"],
            `${BASE_URLS.STAFF}/documents/upload`,
            FaChevronCircleRight,
            COLORS.blue
          ),
          createMenuItem(
            "Verify Documents",
            ["STAFF"],
            `${BASE_URLS.STAFF}/warish/verify`,
            FaChevronCircleRight,
            COLORS.green
          ),
          createMenuItem(
            "Apply Corrections",
            ["STAFF"],
            `${BASE_URLS.STAFF}/warish/apply-correction`,
            FaChevronCircleRight,
            COLORS.red
          ),
        ]
      ),
    ]
  ),
  createMenuItem(
    "My Tasks",
    ["STAFF"],
    `${BASE_URLS.STAFF}/tasks`,
    MdWork,
    COLORS.green
  ),
  createMenuItem(
    "Profile",
    ["STAFF"],
    `${BASE_URLS.STAFF}/profile`,
    MdPersonAdd,
    COLORS.purple
  ),
  createMenuItem(
    "GP Info",
    ["STAFF"],
    `${BASE_URLS.STAFF}/gram-panchayat`,
    MdHolidayVillage,
    COLORS.orange,
    [],
    "feature.gpMenu.enabled",
    "STANDARD"
  ),
];

export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem(
    "Dashboard",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}`,
    MdDashboard,
    COLORS.blue
  ),
  createMenuItem(
    "Users",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}/users`,
    MdPeople,
    COLORS.green
  ),
  createMenuItem(
    "Gram Panchayats",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}/gram-panchayats`,
    MdHolidayVillage,
    COLORS.purple,
    [],
    "feature.gpMenu.enabled",
    "STANDARD"
  ),
  createMenuItem(
    "Add New GP",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}/gram-panchayats/new`,
    MdPersonAdd,
    COLORS.purple
  ),
  createMenuItem(
    "Menu Control",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}/settings`,
    MdSettingsApplications,
    COLORS.indigo
  ),
  createMenuItem(
    "Reports",
    ["SUPER_ADMIN"],
    `${BASE_URLS.SUPER_ADMIN}/reports`,
    MdAnalytics,
    COLORS.orange
  ),
];

// Utility function to check if item is restricted for current role
export const isRestrictedForRole = (
  item: MenuItemProps,
  currentRole: "ADMIN" | "STAFF" | "SUPER_ADMIN"
): boolean => {
  return !item.allowedRoles.includes(currentRole);
};

// Flatten menu for permission matrix view
export const getAllMenuItems = (): MenuItemProps[] => {
  const flattenMenu = (items: MenuItemProps[]): MenuItemProps[] => {
    return items.flatMap((item) => [item, ...flattenMenu(item.subMenuItems)]);
  };

  return [
    ...flattenMenu(adminMenuItems),
    ...flattenMenu(employeeMenuItems),
    ...flattenMenu(superAdminMenuItems),
  ];
};
