"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

type CertificateItem = {
  id: string
  applicantName: string
  nameOfDeceased: string
  warishRefNo: string | null
  warishRefDate: Date | null
  documentUrl: string
}

export default function WarishPrintListClient({ items: initial }: { items: CertificateItem[] }) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(initial.length)
  const [items, setItems] = useState<CertificateItem[]>(initial)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      const url = `/api/warish/certificates?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`
      const res = await fetch(url, { signal: controller.signal })
      if (res.ok) {
        const data = await res.json()
        setItems(data.items)
        setTotal(data.total)
      }
    }
    run()
    return () => controller.abort()
  }, [q, page, pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  return (
    <Card className="shadow-lg border-gray-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800/40">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl">Stored Warish Certificates</CardTitle>
          <Input placeholder="Search by applicant, deceased, certificate no" value={q} onChange={(e) => { setPage(1); setQ(e.target.value) }} className="w-64" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/40">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Deceased</TableHead>
                <TableHead>Certificate No</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-semibold">{item.applicantName}</TableCell>
                  <TableCell>{item.nameOfDeceased}</TableCell>
                  <TableCell>{item.warishRefNo || 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => handleDownload(item.documentUrl)}>Download</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-4 text-sm text-muted-foreground">
          <div>
            Page {page} of {totalPages} • {total} results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
