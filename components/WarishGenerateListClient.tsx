"use client"

import type { WarishApplicationProps } from "@/types"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { formatDate } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import WarishCertificatePDF from "@/components/PrintTemplet/WarishCertificatePDF"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, FileText, Download } from "lucide-react"

export default function WarishGenerateListClient({ applications: initial }: { applications: WarishApplicationProps[] }) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(initial.length)
  const [applications, setApplications] = useState<WarishApplicationProps[]>(initial)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      const url = `/api/warish/generate-ready?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`
      const res = await fetch(url, { signal: controller.signal })
      if (res.ok) {
        const data = await res.json()
        setApplications(data.items)
        setTotal(data.total)
      }
    }
    run()
    return () => controller.abort()
  }, [q, page, pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Card className="shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Ready to Generate Certificates</CardTitle>
            <CardDescription className="mt-1 text-gray-600 dark:text-gray-300">
              {total} application{total !== 1 ? 's' : ''} ready for certificate generation
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by applicant, deceased, or reference no..."
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value) }}
              className="pl-9 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/70">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Deceased Person</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead className="text-center">Reference No</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length > 0 ? (
                applications.map((application, index) => (
                  <TableRow key={application.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <TableCell className="font-medium">{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="font-semibold">{application.nameOfDeceased}</TableCell>
                    <TableCell>{application.applicantName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono px-2 py-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {application.warishRefNo || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{application.warishRefDate ? formatDate(application.warishRefDate) : "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Ready
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <WarishCertificatePDF applicationDetails={application} mode="uploadAndDownload"/>
                        
                      
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                      <FileText className="h-12 w-12 opacity-50" />
                      <p className="text-lg font-medium">No applications found</p>
                      <p className="text-sm">Try adjusting your search query</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {applications.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium">{Math.min(page * pageSize, total)}</span> of{" "}
              <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1 text-sm">
                <span>Page</span>
                <span className="font-medium">{page}</span>
                <span>of</span>
                <span className="font-medium">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
