import { NextRequest, NextResponse } from "next/server";
import { seedFAQData, resetAndSeedFAQData } from "@/lib/utils/seedFAQ";
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "seed";

    let result;
    
    if (action === "reset") {
      result = await resetAndSeedFAQData();
    } else {
      result = await seedFAQData();
    }

    if (result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Seed API error', error);
    return NextResponse.json(
      { error: 'Failed to seed FAQ data' },
      { status: 500 }
    );
  }
}