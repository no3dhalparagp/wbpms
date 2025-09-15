"use client";
import type React from "react";
import { useState, useEffect } from "react";
import CorrectionRequestReview from "./correction-request-review";
import CorrectionRequestForm from "./correction-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnhancedCorrectionSearch({
  initialRequests,
  initialApp,
}: {
  initialRequests: any[];
  initialApp: any;
}) {
  const [searchType, setSearchType] = useState<"ack" | "reference">("ack");
  const [searchValue, setSearchValue] = useState("");
  const [app, setApp] = useState(initialApp);
  const [requests, setRequests] = useState(initialRequests);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any[]>([]);

  // Initialize with props
  useEffect(() => {
    if (initialApp) {
      setApp(initialApp);
      setDetails(initialApp.details || []);
    }
    if (initialRequests) {
      setRequests(initialRequests);
    }
  }, [initialApp, initialRequests]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setRequests([]);
    setApp(null);
    setDetails([]);

    try {
      const res = await fetch(
        `/api/warish-application-by-ack?search=${encodeURIComponent(searchValue)}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch application");
      }

      const data = await res.json();

      if (!data.app) {
        throw new Error(
          `No application found for this ${searchType === "ack" ? "acknowledgement" : "reference"} number`
        );
      }

      setApp(data.app);
      setDetails(flattenDetails(data.app.warishDetails || []));
      await fetchRequests(data.app.id);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRequests(warishApplicationId: string) {
    try {
      const reqRes = await fetch(
        `/api/warish-correction-requests?warishApplicationId=${warishApplicationId}`
      );

      console.log(reqRes);
      if (!reqRes.ok) {
        throw new Error("Failed to fetch correction requests");
      }

      const reqData = await reqRes.json();
      setRequests(reqData.requests || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  }

  const handleRequestReviewed = () => {
    if (app) {
      fetchRequests(app.id);
    }
  };

  const handleRequestSubmitted = () => {
    if (app) {
      fetchRequests(app.id);
    }
  };

  // Define available fields for correction
  const applicationFields = [
    {
      value: "applicantName",
      label: "Applicant Name",
      currentValue: app?.applicantName,
    },
    {
      value: "applicantMobileNumber",
      label: "Mobile Number",
      currentValue: app?.applicantMobileNumber,
    },
    {
      value: "relationwithdeceased",
      label: "Relation with Deceased",
      currentValue: app?.relationwithdeceased,
    },
    {
      value: "nameOfDeceased",
      label: "Name of Deceased",
      currentValue: app?.nameOfDeceased,
    },
    {
      value: "fatherName",
      label: "Father Name",
      currentValue: app?.fatherName,
    },
    {
      value: "spouseName",
      label: "Spouse Name",
      currentValue: app?.spouseName,
    },
    {
      value: "villageName",
      label: "Village Name",
      currentValue: app?.villageName,
    },
    {
      value: "postOffice",
      label: "Post Office",
      currentValue: app?.postOffice,
    },
  ];

  // Detail fields for each heir
  const detailFields = (detail: any) => [
    {
      value: "name",
      label: "Heir Name",
      currentValue: detail?.name,
    },
    {
      value: "gender",
      label: "Gender",
      currentValue: detail?.gender,
    },
    {
      value: "relation",
      label: "Relation",
      currentValue: detail?.relation,
    },
    {
      value: "livingStatus",
      label: "Living Status",
      currentValue: detail?.livingStatus,
    },
    {
      value: "maritialStatus",
      label: "Marital Status",
      currentValue: detail?.maritialStatus,
    },
    {
      value: "hasbandName",
      label: "Husband Name",
      currentValue: detail?.hasbandName || "",
    },
  ];

  function flattenDetails(details: any[]) {
    return details.reduce((acc, detail) => {
      acc.push(detail);
      if (detail.children && detail.children.length > 0) {
        acc.push(...flattenDetails(detail.children));
      }
      return acc;
    }, []);
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Warish Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40">
                  <Label htmlFor="searchType" className="font-medium mb-2 block">
                    Search By
                  </Label>
                  <Select
                    value={searchType}
                    onValueChange={(value: "ack" | "reference") =>
                      setSearchType(value)
                    }
                  >
                    <SelectTrigger id="searchType">
                      <SelectValue placeholder="Search by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ack">Acknowledgement</SelectItem>
                      <SelectItem value="reference">Reference No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="searchValue" className="font-medium mb-2 block">
                    {searchType === "ack" ? "Acknowledgement Number" : "Reference Number"}
                  </Label>
                  <Input
                    id="searchValue"
                    type="text"
                    placeholder={
                      searchType === "ack"
                        ? "Enter acknowledgement number"
                        : "Enter reference number"
                    }
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>
          {error && (
            <div className="text-red-500 mt-4 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {app && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle>Application Details</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    ACK: {app.acknowlegment || "N/A"}
                  </Badge>
                  {app.referenceNumber && (
                    <Badge variant="secondary">
                      Ref: {app.referenceNumber}
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    Status: {app.status || "Pending"}
                  </Badge>
                  <Badge variant="secondary">
                    Submitted: {formatDate(app.createdAt) || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-gray-500">Applicant</Label>
                <p className="font-medium">{app.applicantName}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Mobile</Label>
                <p>{app.applicantMobileNumber}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Deceased</Label>
                <p>{app.nameOfDeceased}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Relation</Label>
                <p>{app.relationwithdeceased}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Address</Label>
                <p>
                  {app.villageName}, {app.postOffice}
                </p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">
                  Submission Date
                </Label>
                <p>{formatDate(app.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {app && (
        <Card>
          <CardHeader>
            <CardTitle>Correction Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="application" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="details">Warish Details</TabsTrigger>
              </TabsList>

              <TabsContent value="application" className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Application Information</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Request corrections for applicant details, deceased
                      information, and address
                    </p>
                  </div>
                  <CorrectionRequestForm
                    warishApplicationId={app.id}
                    targetType="application"
                    availableFields={applicationFields}
                    onRequestSubmitted={handleRequestSubmitted}
                    requesterName={app.applicantName || ""}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                {details.length > 0 ? (
                  <div className="space-y-4">
                    {details.map((detail, index) => (
                      <div
                        key={detail.id || index}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{detail.name}</h3>
                            <div className="flex gap-2 mt-1 text-sm text-gray-600">
                              <span>Gender: {detail.gender}</span>
                              <span>|</span>
                              <span>Relation: {detail.relation}</span>
                              <span>|</span>
                              <span>Status: {detail.livingStatus}</span>
                              <span>|</span>
                              <span>Marital: {detail.maritialStatus}</span>
                            </div>
                          </div>
                          <CorrectionRequestForm
                            warishApplicationId={app.id}
                            warishDetailId={detail.id}
                            targetType="detail"
                            availableFields={detailFields(detail)}
                            onRequestSubmitted={handleRequestSubmitted}
                            requesterName={app.applicantName || ""}
                          />
                        </div>
                        {detail.hasbandName && (
                          <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Husband:</span>{" "}
                            {detail.hasbandName}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No warish details found for this application.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {app && requests.length > 0 && (
        <CorrectionRequestReview
          requests={requests}
          onRequestReviewed={handleRequestReviewed}
        />
      )}
    </div>
  );
}
