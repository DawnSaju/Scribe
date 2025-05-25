import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const crxPath = path.join(process.cwd(), 'public', 'extension', 'Scribe.crx');
    const fileBuffer = await fs.readFile(crxPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/x-chrome-extension',
        'Content-Disposition': 'attachment; filename="Scribe.crx"',
      },
    });
  } catch {
    return new NextResponse('CRX file not found or cannot be read', { status: 404 });
  }
}
