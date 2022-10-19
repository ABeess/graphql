import Model from '../entities/Model';

type ArgsType<T> = Model & T;

export const formatDate = <T, P extends ArgsType<T>>(args: P): P => ({
  ...args,
  createdAt: new Date(args.createdAt),
  updatedAt: new Date(args.updatedAt),
});
