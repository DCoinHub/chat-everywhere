import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  LANGCHAIN_CHAT = 'langchain-chat',
  GPT4 = 'gpt-4',
  IMAGE_GEN = 'image-gen',
  IMAGE_TO_PROMPT = 'image-to-prompt',
}

export enum PluginName {
  LANGCHAIN_CHAT = 'Enhance Mode',
  GPT4 = 'GPT-4',
  IMAGE_GEN = 'image-gen',
  IMAGE_TO_PROMPT = 'image-to-prompt',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.LANGCHAIN_CHAT]: {
    id: PluginID.LANGCHAIN_CHAT,
    name: PluginName.LANGCHAIN_CHAT,
    requiredKeys: [],
  },
  [PluginID.GPT4]: {
    id: PluginID.GPT4,
    name: PluginName.GPT4,
    requiredKeys: [],
  },
  [PluginID.IMAGE_GEN]: {
    id: PluginID.IMAGE_GEN,
    name: PluginName.IMAGE_GEN,
    requiredKeys: [],
  },
  [PluginID.IMAGE_TO_PROMPT]: {
    id: PluginID.IMAGE_TO_PROMPT,
    name: PluginName.IMAGE_TO_PROMPT,
    requiredKeys: [],
  },
};

export const PluginList = Object.values(Plugins);
