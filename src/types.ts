export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
  rebuildSlug?: string;
}

export interface NewCollectionTypes {
  title: string
}

export type Git = 'github' | 'custom'

export type GetUrlParams =
| {	type: Exclude<Git, 'custom'>, link: undefined }
| { type: 'custom', link: string }

export type RebuildSettings = {
	link: string,
	token: string,
	gitType: Git
}