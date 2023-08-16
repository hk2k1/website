import { TEAM_QUERY } from '@root/app/_graphql/team'
import type { Team } from '@root/payload-cloud-types'
import { payloadCloudToken } from './token'

export type TeamWithCustomer = Team & {
  hasPublishedProjects: boolean
  stripeCustomer: Customer | null | undefined
}

// TODO: type this using Stripe module
export interface Customer {
  deleted: boolean
  invoice_settings?: {
    default_payment_method:
      | string
      | {
          id?: string
        }
  }
}

export const fetchTeam = async (teamSlug?: string): Promise<Team> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const doc: Team = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: TEAM_QUERY,
      variables: {
        slug: teamSlug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Teams?.docs?.[0]
    })

  return doc
}

export const fetchTeamClient = async (slug: string): Promise<Team> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql?teams=${slug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: TEAM_QUERY,
        variables: {
          slug: slug.toLowerCase(),
        },
      }),
    },
  ).then(res => {
    return res.json()
  })

  return data?.Teams?.docs[0]
}

export const fetchTeamWithCustomer = async (slug?: string): Promise<TeamWithCustomer> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  if (!slug) throw new Error('No slug provided')

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${slug}/with-customer`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
    },
  )
    ?.then(res => {
      if (!res.ok) throw new Error(`Error getting team with customer: ${res.statusText}`)
      return res.json()
    })
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res
    })

  return data
}