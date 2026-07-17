type SuccessState<T> = {
  status: 'success';
  data: T;
};

type ErrorState = {
  status: 'error';
  message: string;
};

export type Result<T> = ErrorState | SuccessState<T>