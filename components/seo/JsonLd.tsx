/**
 * Renders a JSON-LD block. Server-safe: the payload is serialized at render
 * time so search engines see it in the initial HTML response.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Payload is developer-authored structured data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
