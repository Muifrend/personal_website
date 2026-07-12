import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const ADVENTURE_IMAGE_PROMPT =
  'Create a cinematic, magical-realism adventure scene on the Great Wall of China at blue hour. Integrate the supplied person naturally as Andrew\u2019s co-adventurer: preserve their recognizable likeness, natural proportions, and clothing where possible. They stand on the Wall with a friendly distant mechanical dragon emerging through mountain mist; subtle amber signal lights trace between watchtowers. Elegant storybook travel photography, deep indigo and warm amber palette, cinematic depth, no text, logos, watermark, or UI.';

const OPENAI_IMAGE_EDIT_URL = 'https://api.openai.com/v1/images/edits';
const GREAT_WALL_IMAGE_PATH = 'src/assets/gallery/Great_Wall_Of_China.webp';
const OPENAI_TIMEOUT_MS = 115_000;

type OpenAIImageEditResponse = {
  data?: Array<{
    b64_json?: string;
  }>;
};

export class AdventureImageError extends Error {
  constructor(
    public readonly code: 'configuration_error' | 'generation_failed' | 'generation_timeout',
    message: string,
  ) {
    super(message);
    this.name = 'AdventureImageError';
  }
}

function decodeBase64Image(base64: string): ArrayBuffer {
  const bytes = Buffer.from(base64, 'base64');
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

export async function generateAdventureImage(portrait: File): Promise<ArrayBuffer> {
  // Deliberately use only the private Node environment. Never read a PUBLIC_ variable.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AdventureImageError(
      'configuration_error',
      'Portrait generation is not configured in this local environment.',
    );
  }

  const greatWallBytes = await readFile(resolve(process.cwd(), GREAT_WALL_IMAGE_PATH));
  const form = new FormData();
  form.append('model', 'gpt-image-2');
  form.append('prompt', ADVENTURE_IMAGE_PROMPT);
  form.append('image[]', portrait, portrait.name || 'portrait.jpg');
  form.append(
    'image[]',
    new Blob([greatWallBytes], { type: 'image/webp' }),
    'great-wall-reference.webp',
  );
  // gpt-image-2 currently rejects `input_fidelity` with
  // `invalid_input_fidelity_model` even though older image models accept it.
  form.append('size', '1536x1024');
  form.append('quality', 'medium');
  form.append('output_format', 'jpeg');
  form.append('output_compression', '90');

  const timeout = AbortSignal.timeout(OPENAI_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENAI_IMAGE_EDIT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
      signal: timeout,
    });
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      throw new AdventureImageError(
        'generation_timeout',
        'The adventure image took too long to generate.',
      );
    }

    throw new AdventureImageError(
      'generation_failed',
      'The adventure image could not be generated.',
    );
  }

  if (!response.ok) {
    // Do not relay the provider response: it may contain implementation details that
    // should not cross this local server boundary.
    console.error(`[feeling-lucky] OpenAI image edit failed with status ${response.status}`);
    throw new AdventureImageError(
      'generation_failed',
      'The adventure image could not be generated.',
    );
  }

  let payload: OpenAIImageEditResponse;
  try {
    payload = (await response.json()) as OpenAIImageEditResponse;
  } catch {
    throw new AdventureImageError(
      'generation_failed',
      'The adventure image service returned an invalid response.',
    );
  }

  const imageBase64 = payload.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new AdventureImageError(
      'generation_failed',
      'The adventure image service returned no image.',
    );
  }

  return decodeBase64Image(imageBase64);
}
