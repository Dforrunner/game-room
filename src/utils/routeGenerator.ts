
export function routeGen(url: string, params?: Record<string, any>): string {
  url = (process.env.NEXT_PUBLIC_SERVER_URL || '') + url;

  if (params) {
    const filteredParams = Object.entries(params)
      .filter(([key, value]) => !!String(value).length)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as any);

    const searchParams = new URLSearchParams(filteredParams);
    const queryString = searchParams.toString();
    if (queryString) {
      return `${url}?${queryString}`;
    }
  }
  return url;
}
