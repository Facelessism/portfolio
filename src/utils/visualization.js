export function hash(value) {
  let result = 0;

  for (let index = 0; index < value.length; index += 1) {
    result = (result << 5) - result + value.charCodeAt(index);

    result |= 0;
  }

  return Math.abs(result);
}

export function getConnectedIds(edges, selected, getEndpoints) {
  if (!selected) return new Set();

  const ids = new Set([selected]);

  for (const edge of edges) {
    const [source, target] = getEndpoints(edge);

    if (source === selected) {
      ids.add(target);
    }

    if (target === selected) {
      ids.add(source);
    }
  }

  return ids;
}

const numberFormatter = new Intl.NumberFormat();

export function formatNumber(value) {
  return numberFormatter.format(value || 0);
}
