import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  LANGCHAIN_CHAT = 'langchain-chat',
  GPT4 = 'gpt-4',
}

export enum PluginName {
  LANGCHAIN_CHAT = 'Enhance Mode',
  GPT4 = 'GPT-4',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.LANGCHAIN_CHAT]: {
    id: PluginID.LANGCHAIN_CHAT,
    name: PluginName.LANGCHAIN_CHAT,
    requiredKeys: []
  },
  [PluginID.GPT4]: {
    id: PluginID.GPT4,
    name: PluginName.GPT4,
    requiredKeys: []
  },
};

export const PluginList = Object.values(Plugins);
