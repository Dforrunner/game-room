import { NextResponse } from "next/server";

export async function GET() {
    const randomId = () => Math.random().toString(36).substring(2, 7).toLocaleUpperCase();
    return NextResponse.json({ id: randomId() });
}