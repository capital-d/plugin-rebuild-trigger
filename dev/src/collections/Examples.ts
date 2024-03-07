import { CollectionConfig } from 'payload/types'

const JsonFromExamples: CollectionConfig = {
  slug: 'jsonformExamples',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}

export default JsonFromExamples