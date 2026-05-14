export function normalizeExternalUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (!parsed.protocol.match(/^https?:$/)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function normalizeInternalPath(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith("//") ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmed)
  ) {
    return null;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
