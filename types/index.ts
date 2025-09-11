import {
  Gender,
  MaritialStatus,
  LivingStatus,
  WarishApplicationStatus,
  FamilyRelationship,
  Prisma,
} from "@prisma/client";

import * as z from "zod";
import "next-auth/jwt";

export type SignedURLResponse = Promise<
  | { failure?: undefined; success: { url: string; id: number } }
  | { failure: string; success?: undefined }
>;

export type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};

export type WarishDetailProps = {
  id: string;
  name: string;
  gender: Gender;
  relation: FamilyRelationship;
  livingStatus: LivingStatus;
  maritialStatus: MaritialStatus;
  hasbandName: string | null;
  children: WarishDetailProps[];
  parentId: string | null;
  warishApplicationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WarishApplicationProps = {
  id: string;
  reportingDate: Date;
  acknowlegment: string;
  applicantName: string;
  applicantMobileNumber: string;
  relationwithdeceased: string;
  nameOfDeceased: string;
  dateOfDeath: Date;
  gender: Gender;
  maritialStatus: MaritialStatus;
  fatherName: string;
  spouseName: string | null;
  villageName: string;
  postOffice: string;
  warishDetails: WarishDetailProps[];
  assingstaffId: string | null;
  fieldreportRemark: string | null;
  adminNoteRemark: string | null;
  warishRefNo: string | null;
  warishRefDate: Date | null;
  approvalYear: string | null;
  renewdate: Date | null;
  userId: string | null;
  warishApplicationStatus: WarishApplicationStatus;
  warishdocumentverified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type WarishApplicationPayloadProps = Prisma.WarishApplicationGetPayload<{
  include: {
    warishDetails: {
      include: {
        children: true;
      };
    };
  };
}>;

export type WarishDetailPayloadProps = Prisma.WarishDetailGetPayload<{
  include: {
    children: true;
  };
}>;

export type WorkDetailsProps = Prisma.WorksDetailGetPayload<{
  include: {
    ApprovedActionPlanDetails: true;
    AwardofContract: {
      include: {
        workorderdetails: {
          include: {
            Bidagency: {
              include: {
                agencydetails: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type FieldEnquiry = {
  id: string;
  certificateId: string;
  enquiryOfficer: string;
  enquiryDate: Date;
  findings: string;
  recommendations: string;
  status: EnquiryStatus;
  witnessNames: string[];
  documentsVerified: string[];
  communityVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Approval = {
  id: string;
  certificateId: string;
  approverName: string;
  designation: string;
  approvalDate: Date;
  status: ApprovalStatus;
  comments?: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Renewal = {
  id: string;
  originalCertificateId: string;
  renewalDate: Date;
  newExpiryDate: Date;
  renewalReason: string;
  status: RenewalStatus;
  additionalNotes?: string;
  processedBy?: string;
  processedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export enum CertificateStatus {
  DRAFT = "DRAFT",
  FIELD_ENQUIRY_PENDING = "FIELD_ENQUIRY_PENDING",
  FIELD_ENQUIRY_COMPLETED = "FIELD_ENQUIRY_COMPLETED",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  APPROVED = "APPROVED",
  ISSUED = "ISSUED",
  EXPIRED = "EXPIRED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export enum EnquiryStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RETURNED_FOR_CLARIFICATION = "RETURNED_FOR_CLARIFICATION",
}

export enum RenewalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}
