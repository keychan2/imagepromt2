import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cozeApiSecret = process.env.COZE_API_SECRET;

  if (!cozeApiSecret) {
    return NextResponse.json(
      { error: 'Coze API secret is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL provided.' }, { status: 400 });
    }

    // Directly call the Coze API using fetch
    const cozeResponse = await fetch('https://api.coze.cn/v1/workflow/run', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${cozeApiSecret}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            workflow_id: '7550509235257065512',
            parameters: {
                "img": imageUrl,
                "promptType": "all",
                "userQuery": "generate prompts for this image based on the content"
            },
        }),
    });

    if (!cozeResponse.ok) {
      const errorBody = await cozeResponse.text();
      console.error(`Coze API error: ${cozeResponse.status}`, errorBody);
      throw new Error(`Coze API request failed with status ${cozeResponse.status}`);
    }

    const cozeData = await cozeResponse.json();

    // According to Coze API docs, the result is in data.outputs
    if (cozeData.code !== 0 || !cozeData.data || !cozeData.data.outputs) {
        console.error('Invalid response structure from Coze API:', cozeData);
        throw new Error('Received invalid data structure from Coze API.');
    }

    const prompts = cozeData.data.outputs;

    return NextResponse.json({ prompts });

  } catch (error) {
    console.error('Error in image-prompt API:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}