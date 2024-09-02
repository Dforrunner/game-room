import { writeFile, mkdir, access } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const playerId = formData.get('playerId') as string | null;
    const roomId = formData.get('roomId') as string | null;
    const party = formData.get('party') as string | null;
    const isAvator = formData.get('isAvator') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!playerId || !roomId || !party) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${playerId}.webp`;
    const optimizedImage = await sharp(buffer)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .webp()
      .toBuffer();

    const relativeDir = join('uploads', party, roomId);
    const uploadDir = join(process.cwd(), 'public', relativeDir);

    const pulicImgUrl = join('/', relativeDir, fileName);

    // Check if the upload directory exists
    try {
      await access(uploadDir);
    } catch (error) {
      // If the directory doesn't exist, create it
      await mkdir(uploadDir, { recursive: true });
    }
    await writeFile(join(uploadDir, fileName), optimizedImage);

    return NextResponse.json({
      message: 'File uploaded successfully',
      imageUrl: pulicImgUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
