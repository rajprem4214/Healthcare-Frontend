export type UserTokens = {
  accessToken: string | null;
};

export type StoreUserInfo = {
  user: User;
  tokens: UserTokens;
  reset: () => void;
  setInfo: (user: User, token: UserTokens) => void;
  setTokens: (token: UserTokens) => void;
};
