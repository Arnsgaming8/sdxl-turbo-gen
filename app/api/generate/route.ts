import { NextRequest, NextResponse } from 'next/server';
import { pipeline, env } from '@xenova/transformers';

// Disable local model path restrictions
env.allowLocalModels = false;
env.useBrowserCache = true;

// Global model cache
let generator: any = null;

async function getGenerator() {
  if (!generator) {
    console.log('Loading SDXL Turbo model...');
    generator = await pipeline('text-to-image' as any, 'Xenova/sdxl-turbo', {
      quantized: true,
      revision: 'main',
    });
    console.log('Model loaded!');
  }
  return generator;
}

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

    // Load and run model
    const pipe = await getGenerator();
    const result = await pipe(enhancedPrompt, {
      num_inference_steps: 4,
      guidance_scale: 0.0,
      width: 512,
      height: 512,
    });

    // Convert blob to base64
    const buffer = Buffer.from(await result.blob.arrayBuffer());
    const base64 = buffer.toString('base64');

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
