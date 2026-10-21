// Forgiving site search: "about", "about us", "who are you" and "when do you open"
// should all land somewhere useful. Filler words are ignored, each remaining
// word may match the start of any keyword, and results are ranked by hits.

const STOP = new Set(
  'the a an and or to of for on in at by is are was be us me my i your you we our it this that with page pages please show find go see where what when how do does can tell more beauven &'.split(
    ' '
  )
);

export const normalise = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9@.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export function searchItems(items, query) {
  const q = normalise(query);
  if (!q) return { results: items, exact: true };

  const raw = q.split(' ');
  const tokens = raw.filter((t) => !STOP.has(t));
  // A query made only of filler ("beauven", "the") shows everything
  if (!tokens.length) return { results: items, exact: true };

  const scored = items
    .map((item, order) => {
      const words = normalise(`${item.label} ${item.hint} ${item.terms}`).split(' ');
      let score = 0;
      for (const t of tokens) {
        if (words.some((w) => w === t)) score += 3;
        else if (words.some((w) => w.startsWith(t) || (t.length > 3 && t.startsWith(w) && w.length > 3))) score += 2;
        else if (t.length > 2 && words.some((w) => w.includes(t))) score += 1;
      }
      return { item, score, order };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((r) => r.item);

  return { results: scored, exact: scored.length > 0 };
}
