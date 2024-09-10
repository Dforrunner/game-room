import { randomId } from "@/utils/random";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ id: randomId() });
}