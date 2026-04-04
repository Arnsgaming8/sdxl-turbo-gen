# SDXL Turbo Image Generator

A modern, fast image generation web app powered by Stability AI's SDXL Turbo model via Hugging Face Inference API.

## Features

- ⚡ **Lightning Fast**: SDXL Turbo generates images in a single inference step
- 🎨 **High Quality**: State-of-the-art text-to-image generation
- 📱 **Responsive Design**: Works beautifully on desktop and mobile
- 💾 **Download Images**: Save your generated creations
- 📝 **Prompt History**: Quick access to recent generations
- ✨ **Modern UI**: Dark theme with beautiful gradients

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Hugging Face API key (get one free at https://huggingface.co/settings/tokens)

### Installation

```bash
npm install
```

### Setup

1. Open `app/page.tsx`
2. Replace `'Bearer hf_DEMO_KEY'` with your actual Hugging Face API key:
   ```typescript
   'Authorization': 'Bearer hf_YOUR_ACTUAL_API_KEY',
   ```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How It Works

SDXL Turbo uses a novel distillation technique that enables high-quality image generation in just 1-4 steps, compared to 20-50 steps for traditional diffusion models. This makes it incredibly fast while maintaining excellent image quality.

## API Usage

The app uses the Hugging Face Inference API with the `stabilityai/sdxl-turbo` model. Each generation typically takes 1-3 seconds depending on network conditions.

## Tips for Best Results

- Be descriptive in your prompts
- Specify art styles (digital art, photorealistic, oil painting, etc.)
- Mention lighting and atmosphere
- Keep prompts under 77 tokens for optimal results

## License

MIT
