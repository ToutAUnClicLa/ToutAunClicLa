/** Backend dumps checkout meta into `order.notes` as `--- TITLE ---` blocks. */

export type OrderNoteLine = { label: string | null; value: string };
export type OrderNoteSection = { title: string; lines: OrderNoteLine[] };

const HEADER = /^---\s*(.+?)\s*---$/;

export function parseOrderNotes(raw: string): OrderNoteSection[] | null {
  const text = raw.replace(/\r\n/g, '\n').trim();
  if (!text.includes('---')) return null;

  const sections: OrderNoteSection[] = [];
  let current: OrderNoteSection | null = null;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const header = trimmed.match(HEADER);
    if (header) {
      current = { title: header[1].trim(), lines: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { title: '', lines: [] };
      sections.push(current);
    }
    const kv = trimmed.match(/^([^:]{1,80}):\s*(.*)$/);
    if (kv && kv[1].trim()) {
      current.lines.push({ label: kv[1].trim(), value: kv[2].trim() });
    } else {
      current.lines.push({ label: null, value: trimmed });
    }
  }

  return sections.some((section) => section.title || section.lines.length) ? sections : null;
}
