'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const ContentMediaHero: React.FC<
  Pick<Page['hero'], 'richText' | 'media' | 'links'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, media, breadcrumbs, links }) => {
  return (
    <Gutter>
      <Grid className={classes.grid}>
        <Cell cols={7} colsM={8}>
          <Breadcrumbs items={breadcrumbs} />
          <RichText content={richText} />
          {Array.isArray(links) &&
            links.map(({ link }, i) => {
              return <CMSLink key={i} {...link} className={classes.link} />
            })}
        </Cell>
        {typeof media === 'object' && media !== null && (
          <Cell cols={5} start={8} colsM={8} startM={1}>
            <div className={classes.media}>
              <Media resource={media} sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          </Cell>
        )}
      </Grid>
      <div className={classes.defaultHero}></div>
    </Gutter>
  )
}
