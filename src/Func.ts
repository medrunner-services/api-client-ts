export type Func<T> = () => T;

export type AsyncProvider<T> = Func<Promise<T>>;

export type AsyncAction<T> = (arg: T) => Promise<void>;

export type HeaderProvider<T extends Headers = Headers> = AsyncProvider<T>;

export type Headers = { [key: string]: unknown };
