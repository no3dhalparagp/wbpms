export type AddFinancialDetailsType = {
  id: string;
  workslno: number;
  finalEstimateAmount: number;
  tenderStatus: string;
  ApprovedActionPlanDetails: {
    activityDescription: string;
  };
  nitDetails: {
    memoNumber: number;
    memoDate: Date;
  };
  biddingAgencies: Array<{
    id: string;
    biddingAmount: number | null;
    agencydetails: {
      name: string;
    };
  }>;
};

// Alias for the original type name used in your bid form
export type workdetailfinanicalProps = AddFinancialDetailsType;
