import { NextRequest, NextResponse } from 'next/server';
import { deleteFolder, deleteImage } from '@/lib/image';

export async function POST(req: NextRequest) {
  try {
    const { deletePaths } = await req.json();

    if (!deletePaths.length) {
      return NextResponse.json(
        { error: 'Please provide a delete path' },
        { status: 400 }
      );
    }

    for (const deletePath of deletePaths) {
      if (deletePath.endsWith('.webp')) {
        await deleteImage(deletePath);
      } else {
        await deleteFolder(
          'https://60xib2erhylug4tz.public.blob.vercel-storage.com' +
            deletePath
        );
      }
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}
