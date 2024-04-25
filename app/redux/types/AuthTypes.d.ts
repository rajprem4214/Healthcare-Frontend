declare type LoginResponse = {
  accessToken: string;
  user: string;
  email: string;
  expiry: string;
};

declare type ProfileResponse = {
  user: User
}