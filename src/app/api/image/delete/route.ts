import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs-extra';
import { join } from 'path';
import { PartyType } from '@/types/gameServers';

export async function POST(req: NextRequest) {
  try {
    const { deletePath } = await req.json();

    const normalizedPath = join('/', deletePath);
    if (
      !Object.values(PartyType)
        .map((p) => join('/', 'uploads', p))
        .some((p) => normalizedPath.startsWith(p))
    ) {
      return NextResponse.json(
        { message: 'Invalid delete path' },
        { status: 400 }
      );
    }

    const deleteFilePath = join(process.cwd(), 'public', deletePath);
    // Verify the path exists
    const pathExists = await fs.pathExists(deleteFilePath);

    if (!pathExists) {
      return NextResponse.json({ message: 'File not found' }, { status: 400 });
    }

    console.log({ deleteFilePath });
    // Delete the file
    await fs.remove(deleteFilePath);

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}
