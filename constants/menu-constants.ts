import type { IconType } from "react-icons/lib"
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
} from "react-icons/md"
import { FaChevronCircleRight, FaChartBar, FaChevronDown, FaTruck, FaKey } from "react-icons/fa"

// Type Definition with allowedRoles
export type MenuItemProps = {
  menuItemText: string
  menuItemLink?: string
  Icon?: IconType
  color?: string
  submenu: boolean
  subMenuItems: MenuItemProps[]
  allowedRoles: ("ADMIN" | "STAFF" | "SUPER_ADMIN")[]
}

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
}

// Base URL Constants
const BASE_URLS = {
  ADMIN: "/admin",
  STAFF: "/staff",
  SUPER_ADMIN: "/dashboard",
}

// Enhanced helper to create menu items with allowedRoles
const createMenuItem = (
  text: string,
  roles: ("ADMIN" | "STAFF" | "SUPER_ADMIN")[],
  link?: string,
  Icon?: IconType,
  color: string = COLORS.blue,
  subItems: MenuItemProps[] = [],
): MenuItemProps => ({
  menuItemText: text,
  menuItemLink: link,
  Icon,
  color,
  submenu: subItems.length > 0,
  subMenuItems: subItems,
  allowedRoles: roles,
})

// ADMIN Menu
export const adminMenuItems: MenuItemProps[] = [
  createMenuItem("ADMIN Dashboard", ["ADMIN", "SUPER_ADMIN"], `${BASE_URLS.ADMIN}/home`, MdDashboard, COLORS.blue),

  createMenuItem("Meeting Management", ["ADMIN"], undefined, MdDateRange, COLORS.purple, [
    createMenuItem("All Meetings", ["ADMIN"], `${BASE_URLS.ADMIN}/meeting-manage`, MdCalendarToday, COLORS.blue),
    createMenuItem(
      "Schedule Meeting",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/meeting-manage/add-meeting`,
      MdDateRange,
      COLORS.green,
    ),
    createMenuItem(
      "Meeting Reports",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/meeting-manage/reports`,
      MdAssessment,
      COLORS.orange,
    ),
  ]),

  createMenuItem("Operations Management", ["ADMIN"], undefined, MdWork, COLORS.red, [
    createMenuItem("Action Plans", ["ADMIN"], `${BASE_URLS.ADMIN}/work-manage/view`, FaChevronCircleRight, COLORS.blue),
    createMenuItem(
      "Work Status Tracking",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-tender/work-status-change`,
      FaChevronCircleRight,
      COLORS.indigo,
    ),
    createMenuItem("Fund Status", ["ADMIN"], `${BASE_URLS.ADMIN}/fundstatus`, FaChevronCircleRight, COLORS.red),
    createMenuItem(
      "Work Details",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/work-manage/scheme-wise`,
      FaChevronCircleRight,
      COLORS.red,
    ),
  ]),

  createMenuItem("Approved Action Plans", ["ADMIN"], `${BASE_URLS.ADMIN}/approvedactionplan`, MdListAlt, COLORS.green),

  // Enhanced Certificate Management Section
  createMenuItem("Certificate Management", ["ADMIN", "SUPER_ADMIN"], undefined, MdDescription, COLORS.red, [
    // Inheritance Certificate (Warish)
    createMenuItem("Inheritance Certificate", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Application Lifecycle", ["ADMIN"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem(
          "New Application",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/application`,
          FaChevronCircleRight,
          COLORS.teal,
        ),
        createMenuItem(
          "Bulk Applications",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/bulk-upload`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
        createMenuItem(
          "Document Upload",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/pending-uploaddoc`,
          FaChevronCircleRight,
          COLORS.teal,
        ),
        createMenuItem(
          "Verification",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/verify-document`,
          FaChevronCircleRight,
          COLORS.teal,
        ),
      ]),
      createMenuItem("Workflow", ["ADMIN"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem(
          "Assign to STAFF",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/assign-STAFF`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
        createMenuItem(
          "Public Assignments",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/assign-citizen`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
        createMenuItem(
          "Approval Process",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/approve`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
      ]),
      createMenuItem("Output", ["ADMIN"], undefined, FaChevronDown, COLORS.green, [
        createMenuItem(
          "Certificate Printing",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/print`,
          FaChevronCircleRight,
          COLORS.green,
        ),
        createMenuItem(
          "Renewal Processing",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/renew`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
      ]),
      createMenuItem("Monitoring", ["ADMIN"], undefined, FaChevronDown, COLORS.cyan, [
        createMenuItem(
          "Status Tracking",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/status`,
          FaChevronCircleRight,
          COLORS.purple,
        ),
        createMenuItem(
          "Performance Metrics",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/metrics`,
          FaChevronCircleRight,
          COLORS.orange,
        ),
        createMenuItem(
          "Correction Requests",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-warish/correction-requests`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
    ]),

    // Land Conversion NOC
    createMenuItem("Land Conversion NOC", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem(
        "New Application",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/application`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Document Verification",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/verify`,
        FaChevronCircleRight,
        COLORS.teal,
      ),
      createMenuItem(
        "Site Inspection",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/inspection`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Approval Workflow",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/approve`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "NOC Issuance",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/issue`,
        FaChevronCircleRight,
        COLORS.orange,
      ),
      createMenuItem(
        "Compliance Check",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-land-conversion/compliance`,
        FaChevronCircleRight,
        COLORS.red,
      ),
    ]),

    // Linkage Certificate
    createMenuItem("Linkage Certificate", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem(
        "Application Portal",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/application`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Document Validation",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/validate`,
        FaChevronCircleRight,
        COLORS.teal,
      ),
      createMenuItem(
        "Ownership Verification",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/ownership`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Certificate Issuance",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/issue`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "Renewal Process",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/renew`,
        FaChevronCircleRight,
        COLORS.orange,
      ),
      createMenuItem(
        "Dispute Resolution",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-linkage/disputes`,
        FaChevronCircleRight,
        COLORS.red,
      ),
    ]),

    // Common Certificate Functions
    createMenuItem("Certificate Operations", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem(
        "Bulk Processing",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/certificates/bulk`,
        FaChevronCircleRight,
        COLORS.cyan,
      ),
      createMenuItem(
        "Status Tracker",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/certificates/status`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Certificate Archive",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/certificates/archive`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Renewal Management",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/certificates/renewals`,
        FaChevronCircleRight,
        COLORS.orange,
      ),
      createMenuItem(
        "Certificate Revocation",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/certificates/revoke`,
        FaChevronCircleRight,
        COLORS.red,
      ),
    ]),

    // Reports & Analytics
    createMenuItem("Certificate Analytics", ["ADMIN"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem(
        "Issuance Reports",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/analytics/certificates/issuance`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Processing Times",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/analytics/certificates/processing`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Type-wise Distribution",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/analytics/certificates/types`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "Revenue Analysis",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/analytics/certificates/revenue`,
        FaChevronCircleRight,
        COLORS.orange,
      ),
    ]),
  ]),

  createMenuItem("APA Reports", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
    // Existing report generator
    createMenuItem(
      "Generate APA Report",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate-apa-report`,
      FaChevronCircleRight,
      COLORS.purple,
    ),

    // Mandatory Conditions
    createMenuItem("Mandatory Conditions", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "APA-MC-1",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-MC-1`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-MC-2",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-MC-2`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-MC-5",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-MC-5`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-MC-6",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-MC-6`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),

    // Theme 1
    createMenuItem("Theme - 1", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "APA-TE-1",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-1`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-2",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-2`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-3",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-3`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-4",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-4`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),

    // Theme 2
    createMenuItem("Theme - 2", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "APA-TE-5",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-5`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-6",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-6`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-7",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-7`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-8",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-8`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-9",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-9`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),

    // Theme 3
    createMenuItem("Theme - 3", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "APA-TE-10",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-10`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-11",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-11`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-13",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-13`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-14",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-14`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),

    // Theme 4
    createMenuItem("Theme - 4", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "APA-TE-16",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-16`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-17",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-17`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-19",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-19`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "APA-TE-20",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/apa-report/APA-TE-20`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),
  ]),

  createMenuItem("Vendor Management", ["ADMIN"], undefined, MdPeople, COLORS.red, [
    createMenuItem(
      "Vendor Registration",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-vendor/registration`,
      MdPersonAdd,
      COLORS.blue,
    ),
    createMenuItem(
      "Vendor Directory",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-vendor/view`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Bulk Vendor Upload",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-vendor/bulk-upload`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem("Vendor Analytics", ["ADMIN"], undefined, FaChartBar, COLORS.teal, [
      createMenuItem(
        "Bid Participation Summary",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/reports/vendor-participation`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Earnest Money Status",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/reports/earnest-money`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Technical Compliance",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/reports/technical-compliance`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),
  ]),

  createMenuItem("Procurement Management", ["ADMIN"], undefined, MdBusinessCenter, COLORS.purple, [
    createMenuItem("Tender Management", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("Tender Creation", ["ADMIN"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem(
          "Create New Tender",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/add`,
          FaChevronCircleRight,
          COLORS.green,
        ),
        createMenuItem(
          "Tender Templates",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/templates`,
          FaChevronCircleRight,
          COLORS.blue,
        ),
      ]),
      createMenuItem(
        "Active Tenders",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-tender/open`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),

    createMenuItem("Bid Processing", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem("Bid Evaluation", ["ADMIN"], undefined, FaChevronDown, COLORS.orange, [
        createMenuItem(
          "Technical Evaluation",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/addtechnicaldetails`,
          FaChevronCircleRight,
          COLORS.teal,
        ),
        createMenuItem(
          "Financial Evaluation",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/addfinanicaldetails`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
      createMenuItem(
        "Bidder Management",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/manage-tender/addbidderdetails`,
        FaChevronCircleRight,
        COLORS.yellow,
      ),
    ]),
    createMenuItem("Contract Management", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem("Award Process", ["ADMIN"], undefined, FaChevronDown, COLORS.red, [
        createMenuItem(
          "Work Orders",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/workorderdetails`,
          FaChevronCircleRight,
          COLORS.red,
        ),
        createMenuItem(
          "Contract Awards",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/awardofcontract`,
          FaChevronCircleRight,
          COLORS.indigo,
        ),
        createMenuItem(
          "Awards Status",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/workorder-status`,
          FaChevronCircleRight,
          COLORS.indigo,
        ),
      ]),
      createMenuItem("Modifications", ["ADMIN"], undefined, FaChevronDown, COLORS.pink, [
        createMenuItem(
          "Tender Edits",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/edit`,
          FaChevronCircleRight,
          COLORS.orange,
        ),
        createMenuItem(
          "Tender Cancellations",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/manage-tender/cancel-tender`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
    ]),
  ]),

  createMenuItem("Quotation Management", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.green, [
    createMenuItem(
      "Create Quotation",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/create`,
      FaChevronCircleRight,
      COLORS.blue,
    ),
    createMenuItem(
      "View Quotations",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/view`,
      FaChevronCircleRight,
      COLORS.green,
    ),
    createMenuItem(
      "Publish Quotations",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/publish`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem(
      "Comparative Statements",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/comparative-statement`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem(
      "Bidder Management",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/bidders`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem(
      "Published Quotations",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/published`,
      FaChevronCircleRight,
      COLORS.blue,
    ),
    createMenuItem(
      "Order Management",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/orders`,
      FaChevronCircleRight,
      COLORS.blue,
    ),
    createMenuItem(
      "Quotation Reports",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/reports`,
      FaChevronCircleRight,
      COLORS.orange,
    ),
    createMenuItem(
      "Payment Processing",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/payment`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Vendor Relations",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/vendor`,
      FaChevronCircleRight,
      COLORS.green,
    ),
    createMenuItem(
      "Quotation Status",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/status`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Quotation Analytics",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/analytics`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem(
      "Print Quotations",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-qatation/orders/print-menu`,
      FaChevronCircleRight,
      COLORS.green,
    ),
  ]),

  createMenuItem("Financial Management", ["ADMIN"], undefined, MdMoney, COLORS.indigo, [
    createMenuItem("Transactions", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem(
        "Payment Records",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/addpaymentdetails`,
        FaChevronCircleRight,
        COLORS.indigo,
      ),
      createMenuItem(
        "Receipt Management",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/payments/receipts`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
    createMenuItem("Compliance", ["ADMIN"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Tax Compliance", ["ADMIN"], undefined, FaChevronDown, COLORS.yellow, [
        createMenuItem(
          "GST Register",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/register/gst-register`,
          FaChevronCircleRight,
          COLORS.red,
        ),
        createMenuItem(
          "Income Tax",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/register/income-tax`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
      createMenuItem("Deposits", ["ADMIN"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem(
          "Security Deposits",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/register/security`,
          FaChevronCircleRight,
          COLORS.yellow,
        ),
        createMenuItem(
          "Earnest Money",
          ["ADMIN"],
          `${BASE_URLS.ADMIN}/register/earnest-money`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
    ]),
  ]),

  createMenuItem("Document Generation", ["ADMIN"], undefined, MdDescription, COLORS.indigo, [
    createMenuItem(
      "Scrutiny Sheets",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/printscrutisheet`,
      FaChevronCircleRight,
      COLORS.indigo,
    ),
    createMenuItem("Agreements", ["ADMIN"], `${BASE_URLS.ADMIN}/generate/agrement`, FaChevronCircleRight, COLORS.red),
    createMenuItem(
      "Work Orders",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/work-order`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Supply Orders",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/supply-order`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Payment Certificates",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/payment-certificate`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Completion Certificates",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/completation-certificate`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "FY Completion Reports",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/completation-certificate2`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Bulk Work Orders",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/bulk-work-order`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Document Covers",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/cover-page`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "generateAOC",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/generateAOC`,
      FaChevronCircleRight,
      COLORS.orange,
    ),
    createMenuItem(
      "Bulk Scrutinee Sheet",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/generate/bulk-scrutee-sheet`,
      FaChevronCircleRight,
      COLORS.red,
    ),
  ]),

  createMenuItem("Reports & Analytics", ["ADMIN"], undefined, MdAnalytics, COLORS.blue, [
    createMenuItem("Financial Reports", ["ADMIN"], undefined, FaChartBar, COLORS.green, [
      createMenuItem(
        "Budget Analysis",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/reports/budget`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Expenditure Summary",
        ["ADMIN"],
        `${BASE_URLS.ADMIN}/reports/expenditure`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
    createMenuItem(
      "Performance Metrics",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/reports/performance`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem("Other Reports", ["ADMIN"], `${BASE_URLS.ADMIN}/reports`, FaChevronCircleRight, COLORS.indigo),
  ]),

  createMenuItem("Notice Management", ["ADMIN"], undefined, MdAnnouncement, COLORS.indigo, [
    createMenuItem("Create Notice", ["ADMIN"], `${BASE_URLS.ADMIN}/notice/add`, FaChevronCircleRight, COLORS.cyan),
    createMenuItem("View Notices", ["ADMIN"], `${BASE_URLS.ADMIN}/notice/view`, FaChevronCircleRight, COLORS.cyan),
  ]),

  createMenuItem("System ADMINistration", ["ADMIN", "SUPER_ADMIN"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem("User Accounts", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronDown, COLORS.blue, [
        createMenuItem(
          "Create User",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/user/add`,
          FaChevronCircleRight,
          COLORS.green,
        ),
        createMenuItem(
          "Modify User",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/user/edit`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
      createMenuItem("Directories", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem(
          "User Directory",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/user`,
          FaChevronCircleRight,
          COLORS.green,
        ),
        createMenuItem(
          "STAFF Directory",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/STAFF`,
          FaChevronCircleRight,
          COLORS.red,
        ),
      ]),
      createMenuItem(
        "Personnel Directory",
        ["ADMIN", "SUPER_ADMIN"],
        `${BASE_URLS.ADMIN}/viewmenberdetails`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),
    createMenuItem("System Configuration", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem("Services", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronDown, COLORS.purple, [
        createMenuItem(
          "Email Services",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/master/utils/emails-service`,
          FaChevronCircleRight,
          COLORS.purple,
        ),
        createMenuItem(
          "Notifications",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/master/utils/notifications`,
          FaChevronCircleRight,
          COLORS.purple,
        ),
      ]),
      createMenuItem("Content", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronDown, COLORS.teal, [
        createMenuItem(
          "System Messages",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/master/addimpsmessage`,
          FaChevronCircleRight,
          COLORS.green,
        ),
        createMenuItem(
          "Forms Repository",
          ["ADMIN", "SUPER_ADMIN"],
          `${BASE_URLS.ADMIN}/master/uploadform`,
          FaChevronCircleRight,
          COLORS.green,
        ),
      ]),
      createMenuItem(
        "Work Item Catalog",
        ["ADMIN", "SUPER_ADMIN"],
        `${BASE_URLS.ADMIN}/master/addworkitems`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
    createMenuItem("Monitoring", ["ADMIN", "SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.cyan, [
      createMenuItem(
        "Audit Logs",
        ["ADMIN", "SUPER_ADMIN"],
        `${BASE_URLS.ADMIN}/monitoring/audit-logs`,
        FaChevronCircleRight,
        COLORS.gray,
      ),
      createMenuItem(
        "System Health",
        ["ADMIN", "SUPER_ADMIN"],
        `${BASE_URLS.ADMIN}/monitoring/health`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
  ]),

  createMenuItem("System Integrations", ["ADMIN", "SUPER_ADMIN"], undefined, MdImportantDevices, COLORS.indigo, [
    createMenuItem(
      "Payment Gateways",
      ["ADMIN", "SUPER_ADMIN"],
      `${BASE_URLS.ADMIN}/integrations/payments`,
      FaChevronCircleRight,
      COLORS.green,
    ),
    createMenuItem(
      "API Management",
      ["ADMIN", "SUPER_ADMIN"],
      `${BASE_URLS.ADMIN}/integrations/api`,
      FaChevronCircleRight,
      COLORS.red,
    ),
  ]),

  createMenuItem("Village Management", ["ADMIN"], undefined, MdHolidayVillage, COLORS.cyan, [
    createMenuItem(
      "Add Villages",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/add-village`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "View Villages",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/view`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "Village Population",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/population`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "Village Education",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/education`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "Village Infrastructure",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/infrastructure`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "Village Health",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/health`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
    createMenuItem(
      "Village Agriculture",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/manage-villages/agriculture`,
      FaChevronCircleRight,
      COLORS.cyan,
    ),
  ]),

  createMenuItem("Water Tanker Management", ["ADMIN"], undefined, FaTruck, COLORS.blue, [
    createMenuItem(
      "Service Fee Management",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/water-tanker/fees`,
      FaChevronCircleRight,
      COLORS.green,
    ),
    createMenuItem(
      "Tanker Scheduling",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/water-tanker/schedule`,
      FaChevronCircleRight,
      COLORS.yellow,
    ),
    createMenuItem(
      "Tanker Requests",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/water-tanker/requests`,
      FaChevronCircleRight,
      COLORS.red,
    ),
    createMenuItem(
      "Tanker Maintenance",
      ["ADMIN"],
      `${BASE_URLS.ADMIN}/water-tanker/availability`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
  ]),
]

// STAFF Menu
export const employeeMenuItems: MenuItemProps[] = [
  createMenuItem("STAFF Dashboard", ["STAFF", "SUPER_ADMIN"], `${BASE_URLS.STAFF}/home`, MdDashboard, COLORS.blue),

  createMenuItem("Certificate Processing", ["STAFF"], undefined, MdAssignment, COLORS.red, [
    createMenuItem("My Assignments", ["STAFF"], undefined, FaChevronCircleRight, COLORS.yellow, [
      createMenuItem(
        "Current Tasks",
        ["STAFF"],
        `${BASE_URLS.STAFF}/warish/view-assigned`,
        FaChevronCircleRight,
        COLORS.yellow,
      ),
      createMenuItem(
        "Process Applications",
        ["STAFF"],
        `${BASE_URLS.STAFF}/warish/process`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
    createMenuItem("Documentation", ["STAFF"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem(
        "Upload Documents",
        ["STAFF"],
        `${BASE_URLS.STAFF}/documents/upload`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "Verify Documents",
        ["STAFF"],
        `${BASE_URLS.STAFF}/warish/verify`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Apply Corrections",
        ["STAFF"],
        `${BASE_URLS.STAFF}/warish/apply-correction`,
        FaChevronCircleRight,
        COLORS.red,
      ),
    ]),
  ]),

  createMenuItem("Work Management", ["STAFF"], undefined, MdAssignmentTurnedIn, COLORS.cyan, [
    createMenuItem("Tasks", ["STAFF"], undefined, FaChevronCircleRight, COLORS.blue, [
      createMenuItem("My Tasks", ["STAFF"], `${BASE_URLS.STAFF}/tasks`, FaChevronCircleRight, COLORS.blue),
      createMenuItem("Team Tasks", ["STAFF"], `${BASE_URLS.STAFF}/tasks/team`, FaChevronCircleRight, COLORS.green),
    ]),
    createMenuItem("Reporting", ["STAFF"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Daily Reports", ["STAFF"], `${BASE_URLS.STAFF}/reports`, FaChevronCircleRight, COLORS.blue),
      createMenuItem(
        "Performance Metrics",
        ["STAFF"],
        `${BASE_URLS.STAFF}/reports/metrics`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
  ]),
  createMenuItem("Enquiry Report", ["STAFF"], `${BASE_URLS.STAFF}/enquiry-report`, FaChevronCircleRight, COLORS.blue),

  createMenuItem("Personal", ["STAFF"], undefined, MdPersonAdd, COLORS.purple, [
    createMenuItem("Leave Management", ["STAFF"], undefined, FaChevronCircleRight, COLORS.pink, [
      createMenuItem("Apply Leave", ["STAFF"], `${BASE_URLS.STAFF}/leave/apply`, FaChevronCircleRight, COLORS.blue),
      createMenuItem(
        "Leave Balance",
        ["STAFF"],
        `${BASE_URLS.STAFF}/leave/balance`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
    createMenuItem("Training", ["STAFF"], undefined, FaChevronCircleRight, COLORS.purple, [
      createMenuItem(
        "Available Courses",
        ["STAFF"],
        `${BASE_URLS.STAFF}/training/courses`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "My Certifications",
        ["STAFF"],
        `${BASE_URLS.STAFF}/training/certifications`,
        FaChevronCircleRight,
        COLORS.green,
      ),
    ]),
  ]),

  createMenuItem("Water Tanker Management", ["STAFF"], undefined, FaTruck, COLORS.blue, [
    createMenuItem(
      "Booking Requests",
      ["STAFF"],
      `${BASE_URLS.STAFF}/water-tanker/booking`,
      FaChevronCircleRight,
      COLORS.yellow,
    ),
    createMenuItem(
      "Service History",
      ["STAFF"],
      `${BASE_URLS.STAFF}/water-tanker/history`,
      FaChevronCircleRight,
      COLORS.red,
    ),
  ]),
]

// Super ADMIN Menu
export const superAdminMenuItems: MenuItemProps[] = [
  createMenuItem("Generate API Key", ["SUPER_ADMIN"], `${BASE_URLS.SUPER_ADMIN}/apiKeyGenerator`, FaKey, COLORS.purple),

  createMenuItem("System Oversight", ["SUPER_ADMIN"], undefined, MdSettingsApplications, COLORS.gray, [
    createMenuItem("User Management", ["SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.green, [
      createMenuItem(
        "User Accounts",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/user`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "Access Controls",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/access-controls`,
        FaChevronCircleRight,
        COLORS.indigo,
      ),
    ]),
    createMenuItem("Security", ["SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.red, [
      createMenuItem(
        "Audit Logs",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/audit-logs`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
      createMenuItem(
        "Security Policies",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/security/policies`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
    ]),
  ]),

  createMenuItem("Infrastructure", ["SUPER_ADMIN"], undefined, MdCloudUpload, COLORS.blue, [
    createMenuItem("Data Management", ["SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.indigo, [
      createMenuItem(
        "Backup & Restore",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/infrastructure/backup`,
        FaChevronCircleRight,
        COLORS.blue,
      ),
      createMenuItem(
        "API Management",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/apiKeyGenerator`,
        FaChevronCircleRight,
        COLORS.purple,
      ),
    ]),
    createMenuItem("Configuration", ["SUPER_ADMIN"], undefined, FaChevronCircleRight, COLORS.teal, [
      createMenuItem(
        "Environment Settings",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/infrastructure/environment`,
        FaChevronCircleRight,
        COLORS.green,
      ),
      createMenuItem(
        "System Defaults",
        ["SUPER_ADMIN"],
        `${BASE_URLS.SUPER_ADMIN}/infrastructure/defaults`,
        FaChevronCircleRight,
        COLORS.cyan,
      ),
    ]),
  ]),

  createMenuItem("Menu Access Control", ["SUPER_ADMIN"], undefined, MdCloudUpload, COLORS.yellow, [
    createMenuItem(
      "Public User Menu",
      ["SUPER_ADMIN"],
      `${BASE_URLS.SUPER_ADMIN}/menu-acces-control/publicuser`,
      FaChevronCircleRight,
      COLORS.blue,
    ),
    createMenuItem(
      "Employee Menu",
      ["SUPER_ADMIN"],
      `${BASE_URLS.SUPER_ADMIN}/menu-acces-control/employeeuser`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
    createMenuItem(
      "ADMIN Menu",
      ["SUPER_ADMIN"],
      `${BASE_URLS.SUPER_ADMIN}/menu-acces-control/ADMINuser`,
      FaChevronCircleRight,
      COLORS.purple,
    ),
  ]),
]

// Utility function to check if item is restricted for current role
export const isRestrictedForRole = (item: MenuItemProps, currentRole: "ADMIN" | "STAFF" | "SUPER_ADMIN"): boolean => {
  return !item.allowedRoles.includes(currentRole)
}

// Flatten menu for permission matrix view
export const getAllMenuItems = (): MenuItemProps[] => {
  const flattenMenu = (items: MenuItemProps[]): MenuItemProps[] => {
    return items.flatMap((item) => [item, ...flattenMenu(item.subMenuItems)])
  }

  return [...flattenMenu(adminMenuItems), ...flattenMenu(employeeMenuItems), ...flattenMenu(superAdminMenuItems)]
}
