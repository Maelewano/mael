import { NextResponse } from 'next/server';

export function successResponse(data?: any, status = 200, statusText = "OK") {
    return NextResponse.json({
        success: true,
        status,
        statusText,
        ...(data !== undefined ? { data } : {})
    }, { status });
}

export function errorResponse(statusText: string, status = 500) {
    return NextResponse.json({
        success: false,
        status,
        statusText,
    }, { status });
}