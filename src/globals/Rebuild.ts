import { GlobalConfig } from "payload/dist/globals/config/types";
// import { getPluginConfig } from "../plugin";
import ToggleBotEnabled from "../hooks/StartBot";
import RebuildTriggerEndpoint from "../endpoints/RebuildTriggerEndpoint";
import PasswordField from "../fields/PasswordField";
import { RebuildTriggerField } from "../fields/RebuildTriggerField";

export type PluginRebuildConfig = {
  enabled: boolean;
  settings: {
    gitType: string;
    link: string;
    token?: string;
  };
};

// export function getRebuildTriggerSlug() {
//   const config = getPluginConfig();
//   return config.rebuildSlug ?? "rebuild";
// }

export function createRebuildTriggerGlobalConfig(
  slug: string | undefined
): GlobalConfig {
  return {
    // slug: getRebuildTriggerSlug(),
    slug: slug ?? 'rebuild',
    endpoints: [
      RebuildTriggerEndpoint,
    ],
    fields: [
      {
        name: "enabled",
        type: "checkbox",
        required: true,
        defaultValue: true,
        hooks: {
          afterChange: [ToggleBotEnabled],
        },
      },
      {
        type: 'tabs',
        tabs: [
          // required
          {
            label: 'Building',
            fields: [
              {
                name: 'prod',
                type: 'ui',
                admin: {
                  components: {
                    Field: (props) => RebuildTriggerField({ ...props }),
                  },
                },
                label: 'Rebuild prod',
              },
            ]
          },
          {
            label: 'Settings', // required
            description: 'This will appear within the tab above the fields.',
            fields: [
              {
                name: "settings",
                type: "group",
                label: "Authentication",
                fields: [
                  {
                    type: 'row', // required
                    fields: [
                      {
                        name: 'gitType',
                        type: 'select', // required
                        hasMany: false,
                        required: true,
                        options: [
                          {
                            label: 'Github',
                            value: 'github',
                          },
                          {
                            label: 'Custom',
                            value: 'custom',
                          },
                        ],
                        admin: {
                          width: '30%',
                        },
                      },
                      {
                        label: "Link",
                        name: 'link',
                        type: 'text',
                        required: true,
                        admin: {
                          width: '70%',
                        },
                      },
                    ],
                  },
                  {
                    label: "Token",
                    name: 'token',
                    type: 'text',
                    required: true,
                    admin: {
                      components: {
                          Field: PasswordField
                      }
                    }
                  },
                ],
              },
            ],
          },
          {
            name: 'variables',
            label: 'Env variables',
            fields: [
              {
                name: 'environment',
                type: 'array', 
                // label: 'Another label',
                minRows: 0,
                maxRows: 100, //Add this to palans ezy money $$$
                labels: {
                  singular: 'Env',
                  plural: 'Envs',
                },
                fields: [
                  // required
                  {
                    name: 'name',
                    type: 'text',
                  },
                  {
                    name: 'value',
                    type: 'text',
                  },
                  {
                    name: 'env',
                    type: 'select', // required
                    hasMany: false,
                    required: false,
                    options: [
                      {
                        label: 'Prod',
                        value: 'prod',
                      },
                      {
                        label: 'Stage',
                        value: 'stage',
                      },
                    ],
                      
                  },
                ],
                admin: {
                  components: {
                    // RowLabel: ({ data, index }: {data:any, index: number}) => {
                    //   return data?.title || `Env ${String(index).padStart(2, '0')}`
                    // },
                  },
                },
              },
            ],
          },
        ],
      },

    ],
  };
}
