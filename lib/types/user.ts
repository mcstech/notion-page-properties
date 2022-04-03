interface UserBase<T extends string> {
  object: 'user';
  id: string;
  type: T;
  name: string;
  avatar_url?: string;
}

export interface PersonUser extends UserBase<'person'> {
  person?: {
    email: string;
  };
}

export type BotUser = UserBase<'bot'>;

export type User = PersonUser | BotUser;