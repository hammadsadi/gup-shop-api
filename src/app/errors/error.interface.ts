export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources;
};

export type TErrorSources = {
  path: string | number;
  message: string;
}[];
