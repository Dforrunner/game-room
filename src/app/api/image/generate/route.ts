import { NextRequest, NextResponse } from 'next/server';
import { generateImageFromDalle } from '@/lib/image';
import { z } from 'zod';
import { withErrorHandler } from '@/utils/apiErrorHandler';
import { parsedAndValidateData } from '@/utils/zodParser';
import { PartyType } from '@/types/gameServers';

export async function generateImageHandler(req: NextRequest) {
  const schema = z.object({
    prompt: z.string().max(4000),
    playerId: z.string(),
    partyType: z.enum(Object.values(PartyType) as [PartyType, ...PartyType[]]),
    roomId: z.string(),
  });
  const rawData = await req.json();
  const data = parsedAndValidateData<typeof schema>(rawData, schema);

  const imageUrl = await generateImageFromDalle(data);

  // Return the image URL in the response
  return NextResponse.json({ imageUrl });
}

export const POST = withErrorHandler(generateImageHandler);
