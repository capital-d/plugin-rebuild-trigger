'use client'

import type {
  FieldType as FieldType,
  Options,
} from 'payload/dist/admin/components/forms/useField/types'
import type { TextField as TextFieldType } from 'payload/types'

import { TextInput, useAllFormFields, useField } from 'payload/components/forms'
import { Button } from 'payload/components/elements'
import { useConfig, useDocumentInfo, useLocale } from 'payload/components/utilities'
import React, { useCallback } from 'react'


// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type MetaTitleProps = TextFieldType & {
  path: string
}

export const MetaTitle: React.FC<MetaTitleProps> = (props) => {
  const { name, label = 'Release', path, required } = props || {}


  const field: FieldType<string> = useField({
    name,
    label,
    path,
  } as Options)

  const slug = 'create-release'

  const locale = useLocale()
  const [fields] = useAllFormFields() 
  const docInfo = useDocumentInfo()

  const config = useConfig()

  const {
    routes: {
    api,
      admin: adminRoute, // already includes leading slash
    } = {},
    serverURL,
  } = config

  const link = fields?.["settings.link"]?.value as string | undefined

  const { setValue, showError, value, errorMessage, } = field

  const  triggerRelease  = async () => {

    const url = `${serverURL}${api}/globals/${slug}/create-release?env=${name}`

    const request = await fetch(url)
    const response = await request.json()
    console.log(response)

  }

  return (
    <div
      style={{
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          marginBottom: '10px',
          position: 'relative',
        }}
      >
              <Button
              onClick={triggerRelease}
              disabled={false} >
                {typeof label === 'string' ? label : name}
              </Button>
      </div>

    </div>
  )
}

export const CreateReleaseField = (props: MetaTitleProps) => <MetaTitle {...props} />