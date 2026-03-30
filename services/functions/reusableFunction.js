export function mergeUniqueByKey(array1, array2, keyPath) {
  const a1 = Array.isArray(array1) ? array1 : [];
  const a2 = Array.isArray(array2) ? array2 : [];
  const map = new Map();

  const getNestedValue = (obj, path) => {
    if (!path || !obj) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  [...a1, ...a2].forEach((item) => {
    const uniqueKey = getNestedValue(item, keyPath);

    if (item && uniqueKey !== undefined) {
      map.set(uniqueKey, item);
    }
  });

  return Array.from(map.values());
}

export function mergeUniqueByKeyID(array1, array2, key) {
  const a1 = Array.isArray(array1) ? array1 : [];
  const a2 = Array.isArray(array2) ? array2 : [];
  const map = new Map();

  [...a1, ...a2].forEach((item) => {
    if (item && item[key] !== undefined) {
      map.set(item[key], item);
    }
  });

  return Array.from(map.values());
}
