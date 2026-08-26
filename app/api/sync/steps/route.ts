import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stepsParam = searchParams.get('steps') || searchParams.get('sync_steps');
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const sourceParam = searchParams.get('source') || 'apple_health';

  if (stepsParam) {
    const steps = parseInt(stepsParam.replace(/,/g, '').trim(), 10);
    if (!isNaN(steps) && steps >= 0) {
      return NextResponse.json({
        success: true,
        steps,
        date: dateParam,
        source: sourceParam,
        timestamp: new Date().toISOString(),
        message: `Successfully received ${steps.toLocaleString()} steps for ${dateParam}`,
      });
    }
  }

  return NextResponse.json({
    status: 'online',
    service: 'Seelye Health Step Sync API',
    instructions: 'Send GET ?steps=8420 or POST {"steps": 8420} to sync Apple Health & Watch steps automatically.',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const steps = typeof body.steps === 'number' ? body.steps : parseInt(String(body.steps || '').replace(/,/g, '').trim(), 10);
    const date = body.date || new Date().toISOString().split('T')[0];
    const source = body.source || 'apple_health';

    if (isNaN(steps) || steps < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid step count payload' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      steps,
      date,
      source,
      timestamp: new Date().toISOString(),
      message: `Successfully synchronized ${steps.toLocaleString()} steps for ${date}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to parse JSON payload' },
      { status: 400 }
    );
  }
}
