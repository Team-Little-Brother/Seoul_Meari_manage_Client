export type CaseStyle = 'camel' | 'snake';

export const toSnake = (s: string) =>
  s.replace(/([A-Z])/g, '_$1').replace(/__/g, '_').toLowerCase();

export const toCamel = (s: string) =>
  s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

export function transformKeysDeep(obj: any, target: CaseStyle): any {
  if (Array.isArray(obj)) return obj.map((v) => transformKeysDeep(v, target));
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(obj)) {
      const nk = target === 'snake' ? toSnake(k) : toCamel(k);
      out[nk] = transformKeysDeep(obj[k], target);
    }
    return out;
  }
  return obj;
}