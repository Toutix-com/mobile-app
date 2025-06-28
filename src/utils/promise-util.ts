export type InlineArrayResult<T, E = Error> = [T | null, E | null];

export const inlinePromise = <T, E = Error>(
  promise: Promise<T>,
): Promise<InlineArrayResult<T, E>> => {
  return promise
    .then((data: T): InlineArrayResult<T, E> => [data, null])
    .catch((error: E): InlineArrayResult<T, E> => [null, error]);
}; 