import { CollectionConfig } from 'payload/types';

const gitSettings: CollectionConfig = {
  slug: 'git-settings',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'Token',
      type: 'text',
      required: true,
    },
    {
      label: 'Hub type',
      name: 'hubtype',
      type: 'select', // required
      hasMany: false,
      required: true,
      options: [
        {
          label: 'Github',
          value: 'github',
        },
        {
          label: 'Custon',
          value: 'custom',
        },
      ],
    },
  ],
}

export default gitSettings;
