import { NextRequest, NextResponse } from "next/server";

const MOEX_BASE_URL = "https://iss.moex.com/iss";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const asset = searchParams.get("asset");

  if (!asset) {
    return NextResponse.json(
      { error: "Asset parameter is required" },
      { status: 400 },
    );
  }

  try {
    const url = `${MOEX_BASE_URL}/engines/futures/markets/options/securities.json?asset=${asset}`;
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
    console.error("Error fetching from MOEX:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from MOEX" },
      { status: 500 },
    );
  }
}
