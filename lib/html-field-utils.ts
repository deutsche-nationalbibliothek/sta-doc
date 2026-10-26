/** True when a STRING value should use the rich HTML editor (tables, basic markup). */
export function stringValueLooksLikeHtml(value?: string | null): boolean {
  if (!value?.trim()) {
    return false;
  }
  return /<\s*(table|thead|tbody|tr|td|th|p|div|ul|ol|h[1-6]|br|strong|em|a)\b/i.test(
    value
  );
}
