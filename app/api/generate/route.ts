import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating for prompt:', prompt);

    // Add anti-text suffix
    const antiTextSuffix = ', no text, no words, no letters, no watermark, no signature, clean image';
    const enhancedPrompt = prompt + antiTextSuffix;

    // Use Pollinations.ai - free image generation API (no API key needed)
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&seed=42&nologo=true`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.status}`);
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      prompt,
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
