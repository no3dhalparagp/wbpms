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
    "Profile",
    ["ADMIN"],
    `/profile`,
    MdPersonAdd,
    COLORS.purple
  ),
  createMenuItem(
    "Change Password",
    ["ADMIN"],
    `/profile/change-password`,
    FaKey,
    COLORS.gray
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
  createMenuItem(
    "Add Village",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/villages/new`,
    MdHolidayVillage,
    COLORS.purple
  ),
  createMenuItem(
    "Add Ward",
    ["ADMIN"],
    `${BASE_URLS.ADMIN}/wards/new`,
    MdAssignmentTurnedIn,
    COLORS.green
  ),
  // New modules: Operations, Vendor, Procurement, Documents, Finance
  createMenuItem(
    "Operations Management",
    ["ADMIN"],
    undefined,
    MdWork,
    COLORS.blue,
    [
      createMenuItem(
        "Action Plans",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/operations/action-plans`,
        FaChevronCircleRight,
        COLORS.blue
      ),
      createMenuItem(
        "Work Status Tracking",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/operations/work-status-tracking`,
        FaChevronCircleRight,
        COLORS.teal
      ),
      createMenuItem(
        "Fund Status",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/operations/fund-status`,
        FaChevronCircleRight,
        COLORS.green
      ),
      createMenuItem(
        "Work Details",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/operations/work-details`,
        FaChevronCircleRight,
        COLORS.orange
      ),
    ]
  ),
  createMenuItem(
    "Vendor Management",
    ["ADMIN"],
    undefined,
    MdBusinessCenter,
    COLORS.purple,
    [
      createMenuItem(
        "Register New Vendor",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/vendors/register`,
        MdPersonAdd,
        COLORS.green
      ),
      createMenuItem(
        "Update Vendor Details",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/vendors/update-details`,
        FaChevronCircleRight,
        COLORS.orange
      ),
      createMenuItem(
        "Vendor Directory",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/vendors/directory`,
        FaChevronCircleRight,
        COLORS.blue
      ),
      createMenuItem(
        "Vendor Analytics",
        ["ADMIN"],
        undefined,
        MdAnalytics,
        COLORS.indigo,
        [
          createMenuItem(
            "Bid Participation Summary",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/vendors/analytics/bid-participation-summary`,
            FaChevronCircleRight,
            COLORS.indigo
          ),
          createMenuItem(
            "Earnest Money Status",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/vendors/analytics/earnest-money-status`,
            FaChevronCircleRight,
            COLORS.cyan
          ),
          createMenuItem(
            "Technical Compliance",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/vendors/analytics/technical-compliance`,
            FaChevronCircleRight,
            COLORS.pink
          ),
        ]
      ),
    ]
  ),
  createMenuItem(
    "Procurement Management",
    ["ADMIN"],
    undefined,
    MdAssignment,
    COLORS.orange,
    [
      createMenuItem(
        "Create Tender",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/create-tender`,
        FaChevronCircleRight,
        COLORS.green
      ),
      createMenuItem(
        "Active Tenders",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/active-tenders`,
        FaChevronCircleRight,
        COLORS.blue
      ),
      createMenuItem(
        "Technical Specifications",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/technical-specifications`,
        FaChevronCircleRight,
        COLORS.purple
      ),
      createMenuItem(
        "Tender Modifications",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/tender-modifications`,
        FaChevronCircleRight,
        COLORS.orange
      ),
      createMenuItem(
        "Tender Registry",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/tender-registry`,
        FaChevronCircleRight,
        COLORS.teal
      ),
      createMenuItem(
        "Bid Management",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/bid-management`,
        FaChevronCircleRight,
        COLORS.cyan
      ),
      createMenuItem(
        "Financial Details",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/financial-details`,
        FaChevronCircleRight,
        COLORS.green
      ),
      createMenuItem(
        "Contract Awards",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/contract-awards`,
        FaChevronCircleRight,
        COLORS.yellow
      ),
      createMenuItem(
        "Tender Cancellations",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/tender-cancellations`,
        FaChevronCircleRight,
        COLORS.red
      ),
      createMenuItem(
        "Document Management",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/document-management`,
        FaChevronCircleRight,
        COLORS.gray
      ),
      createMenuItem(
        "Contract Administration",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/contract-administration`,
        FaChevronCircleRight,
        COLORS.indigo
      ),
      createMenuItem(
        "Order Cancellations",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/procurement/order-cancellations`,
        FaChevronCircleRight,
        COLORS.lime
      ),
    ]
  ),
  createMenuItem(
    "Document Generation",
    ["ADMIN"],
    undefined,
    MdDescription,
    COLORS.teal,
    [
      createMenuItem(
        "Scrutiny Sheets",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/scrutiny-sheets`,
        FaChevronCircleRight,
        COLORS.blue
      ),
      createMenuItem(
        "Agreements",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/agreements`,
        FaChevronCircleRight,
        COLORS.green
      ),
      createMenuItem(
        "Work Orders",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/work-orders`,
        FaChevronCircleRight,
        COLORS.orange
      ),
      createMenuItem(
        "Supply Orders",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/supply-orders`,
        FaChevronCircleRight,
        COLORS.teal
      ),
      createMenuItem(
        "Payment Certificates",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/payment-certificates`,
        FaChevronCircleRight,
        COLORS.purple
      ),
      createMenuItem(
        "Completion Certificates",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/completion-certificates`,
        FaChevronCircleRight,
        COLORS.yellow
      ),
      createMenuItem(
        "FY Completion Reports",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/fy-completion-reports`,
        FaChevronCircleRight,
        COLORS.cyan
      ),
      createMenuItem(
        "Document Covers",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/documents/document-covers`,
        FaChevronCircleRight,
        COLORS.gray
      ),
    ]
  ),
  createMenuItem(
    "Financial Administration",
    ["ADMIN"],
    undefined,
    MdMoney,
    COLORS.green,
    [
      createMenuItem(
        "Payment Records",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/finance/payment-records`,
        FaChevronCircleRight,
        COLORS.green
      ),
      createMenuItem(
        "Regulatory Compliance",
        ["ADMIN"],
        undefined,
        MdAssessment,
        COLORS.indigo,
        [
          createMenuItem(
            "Security Deposits",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/finance/regulatory/security-deposits`,
            FaChevronCircleRight,
            COLORS.blue
          ),
          createMenuItem(
            "Labor Cess",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/finance/regulatory/labor-cess`,
            FaChevronCircleRight,
            COLORS.orange
          ),
          createMenuItem(
            "GST Compliance",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/finance/regulatory/gst-compliance`,
            FaChevronCircleRight,
            COLORS.teal
          ),
          createMenuItem(
            "Income Tax",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/finance/regulatory/income-tax`,
            FaChevronCircleRight,
            COLORS.purple
          ),
          createMenuItem(
            "Earnest Money",
            ["ADMIN"],
            `${BASE_URLS.ADMIN}/finance/regulatory/earnest-money`,
            FaChevronCircleRight,
            COLORS.cyan
          ),
        ]
      ),
    ]
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
    "Change Password",
    ["STAFF"],
    `/profile/change-password`,
    FaKey,
    COLORS.gray
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
    "Profile",
    ["SUPER_ADMIN"],
    `/profile`,
    MdPersonAdd,
    COLORS.purple
  ),
  createMenuItem(
    "Change Password",
    ["SUPER_ADMIN"],
    `/profile/change-password`,
    FaKey,
    COLORS.gray
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
