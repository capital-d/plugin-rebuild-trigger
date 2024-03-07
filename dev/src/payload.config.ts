import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Examples from './collections/Examples';
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { rebuildTriggerPlugin } from '../../src/index'

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
            // [path.resolve(__dirname, '../../src')]: path.resolve(__dirname, '../../src/admin.js'),
            // [path.resolve(__dirname, '../../src/index')]: path.resolve(
            //   __dirname,
            //   '../../src/admin/index.ts',
            // ),
          },
        },
      }
      return newConfig
    },
  },
  editor: slateEditor({}),
  collections: [
    Examples, Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  // graphQL: {
  //   schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  // },
  plugins: [
    rebuildTriggerPlugin({
      rebuildSlug: 'rebuild',
    }),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
