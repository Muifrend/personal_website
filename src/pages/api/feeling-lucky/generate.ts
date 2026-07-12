import type { APIRoute } from 'astro';

import {
  AdventureImageError,
  generateAdventureImage,
} from '../../../features/feeling-lucky/server/generateAdventureImage';

const MAX_PORTRAIT_BYTES = 10 * 1024 * 1024;
const ALLOWED_PORTRAIT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

type GenerationState = 'generating' | 'complete' | 'failed';

// This is intentionally process-local: the demo runs under `npm run dev`, has no
// visitor database, and forgets all sessions when the dev server restarts.
const generationStates = new Map<string, GenerationState>();

function jsonError(status: number, code: string, message: string): Response {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

function hasValidImageSignature(bytes: Uint8Array, type: string): boolean {
  if (type === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type === 'image/png') {
    return (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  return (
    type === 'image/webp' &&
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function reserveSession(sessionId: string): GenerationState | undefined {
  const existing = generationStates.get(sessionId);
  if (existing) return existing;

  generationStates.set(sessionId, 'generating');
  return undefined;
}

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return jsonError(404, 'not_found', 'This development-only endpoint is unavailable.');
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
    return jsonError(415, 'invalid_content_type', 'Send a multipart form with a portrait.');
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, 'invalid_form', 'The uploaded form could not be read.');
  }

  const sessionId = form.get('sessionId');
  const portrait = form.get('portrait');

  if (typeof sessionId !== 'string' || !SESSION_ID_PATTERN.test(sessionId)) {
    return jsonError(400, 'invalid_session', 'A valid local adventure session is required.');
  }

  if (!(portrait instanceof File)) {
    return jsonError(400, 'portrait_required', 'Choose or capture a portrait to continue.');
  }

  if (!ALLOWED_PORTRAIT_TYPES.has(portrait.type)) {
    return jsonError(415, 'unsupported_portrait', 'Use a JPEG, PNG, or WebP portrait.');
  }

  if (portrait.size === 0 || portrait.size > MAX_PORTRAIT_BYTES) {
    return jsonError(413, 'portrait_too_large', 'The portrait must be between 1 byte and 10 MB.');
  }

  const signature = new Uint8Array(await portrait.slice(0, 16).arrayBuffer());
  if (!hasValidImageSignature(signature, portrait.type)) {
    return jsonError(400, 'invalid_portrait', 'The portrait file does not match its image type.');
  }

  const previousState = reserveSession(sessionId);
  if (previousState === 'generating') {
    return jsonError(409, 'generation_in_progress', 'This session is already creating an image.');
  }
  if (previousState) {
    return jsonError(409, 'generation_already_used', 'This session has already used its image reveal.');
  }

  try {
    const image = await generateAdventureImage(portrait);
    generationStates.set(sessionId, 'complete');

    return new Response(image, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': 'inline; filename="great-wall-adventure.jpg"',
        'Content-Type': 'image/jpeg',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    generationStates.set(sessionId, 'failed');

    if (error instanceof AdventureImageError) {
      const status = error.code === 'configuration_error' ? 503 : 502;
      return jsonError(status, error.code, error.message);
    }

    console.error('[feeling-lucky] Unexpected image generation failure');
    return jsonError(500, 'generation_failed', 'The adventure image could not be generated.');
  }
};

export const ALL: APIRoute = () =>
  jsonError(405, 'method_not_allowed', 'Only POST is supported by this endpoint.');
