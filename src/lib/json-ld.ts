/**
 * Safely serialize a JSON-LD object for embedding in a `<script>` tag.
 *
 * Escapes `<`, `>`, and `&` as their Unicode equivalents to prevent
 * breaking out of the `<script>` context via crafted strings like
 * `</script>` in title/description fields.
 */
export function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}
