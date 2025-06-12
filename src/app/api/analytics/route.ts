import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get visitor information
    const visitorData = {
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      referrer: body.referrer || '',
      userAgent: request.headers.get('user-agent') || '',
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      event: body.event || 'pageview',
      sessionId: body.sessionId || '',
    };

    // Log to console (in production, you might want to save to a database)
    console.log('Analytics Event:', JSON.stringify(visitorData, null, 2));

    // You could save to a database here:
    // await saveToDatabase(visitorData);

    return NextResponse.json({ 
      success: true, 
      message: 'Analytics event recorded',
      data: visitorData 
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
} 