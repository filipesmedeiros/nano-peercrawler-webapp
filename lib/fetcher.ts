const fetcher = <T>(
  input: Parameters<typeof fetch>[0],
  init?: Omit<Exclude<Parameters<typeof fetch>[1], undefined>, 'body'> & {
    method?: 'POST' | 'PUT' | 'PATCH'
    body?: any
  }
) =>
  fetch(input, {
    ...init,
    headers:
      (init?.method ?? 'GET') === 'GET'
        ? []
        : [['Content-Type', 'application/json']],
    ...(init?.body !== undefined ? { body: JSON.stringify(init?.body) } : {}),
  }).then(res => {
    if (!res.ok) throw new Error() // todo improve this error
    return res.json() as Promise<T>
  })

export default fetcher
