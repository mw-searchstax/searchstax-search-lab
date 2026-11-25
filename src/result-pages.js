// A repeated page replaces its previous batch. Keep the accumulated results in
// the kit's data layer so links and tracking can still resolve earlier cards.
export function createResultPages() {
  const batches = new Map();
  return {
    clear() { batches.clear(); },
    collect(start, items) {
      if (start === 0) batches.clear();
      batches.set(start, items);
      const seen = new Set();
      const results = [];
      for (const batch of batches.values()) {
        for (const item of batch) {
          // Separate indexed records can share a URL or have no mapped link.
          const key = item.uniqueId;
          if (key != null && key !== '') {
            if (seen.has(key)) continue;
            seen.add(key);
          }
          results.push(item);
        }
      }
      return results;
    },
  };
}
