import { ExportFormatV4 } from './export';
import { PluginID } from './plugin';

import { SupabaseClient } from '@supabase/supabase-js';

export interface User extends UserProfile {
  email: string;
  token: string;
}

export type SubscriptionPlan = 'free' | 'pro' | 'edu';

export interface UserConversation {
  id: string;
  uid: string;
  conversations: ExportFormatV4;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: SubscriptionPlan;
  referralCode: string | undefined;
  referralCodeExpirationDate: string | undefined;
  proPlanExpirationDate: string | undefined;
  hasReferee: boolean;
  hasReferrer: boolean;
  isInReferralTrial: boolean;
}

export interface CreditUsage {
  [PluginID.GPT4]: {
    remainingCredits: number;
  };
  [PluginID.IMAGE_GEN]: {
    remainingCredits: number;
  };
}

export interface UserProfileQueryProps {
  client: SupabaseClient;
  userId?: string;
  email?: string;
}

type RequiredOne<T, Keys extends keyof T = keyof T> = Required<Pick<T, Keys>> &
  Partial<T>;

export type UserProfileQuery = RequiredOne<
  UserProfileQueryProps,
  'userId' | 'email'
>;
