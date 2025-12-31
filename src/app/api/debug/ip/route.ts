import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get outgoing IP using ipify
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();

    return NextResponse.json({
      outgoingIP: ipData.ip,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get IP", details: String(error) },
      { status: 500 }
    );
  }
}
