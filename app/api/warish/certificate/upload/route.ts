import { NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/app/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { fileName, fileType, base64, warishId } = await req.json()

    if (!fileName || !fileType || !base64 || !warishId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Delete any existing WarishCertificate documents for this application to make regeneration idempotent
    await prisma.warishDocument.deleteMany({
      where: { warishId, documentType: 'WarishCertificate' },
    })

    const { url, public_id } = await uploadToCloudinary(base64, 'warish_certificates')

    await prisma.warishDocument.create({
      data: {
        warishId,
        documentType: 'WarishCertificate',
        cloudinaryUrl: url,
        cloudinaryPublicId: public_id,
        verified: true,
      },
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

