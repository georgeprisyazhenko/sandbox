import { NextRequest, NextResponse } from "next/server";

const MOEX_BASE_URL = "https://iss.moex.com/iss";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ secid: string }> },
) {
  const { secid } = await params;

  if (!secid) {
    return NextResponse.json({ error: "SECID is required" }, { status: 400 });
  }

  try {
    const url = `${MOEX_BASE_URL}/engines/futures/markets/options/securities/${secid}.json`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching market data for ${secid}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch market data from MOEX" },
      { status: 500 },
    );
  }
}
