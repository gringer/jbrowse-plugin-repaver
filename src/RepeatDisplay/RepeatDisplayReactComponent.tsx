import React from 'react'
import { BaseLinearDisplayComponent } from '@jbrowse/plugin-linear-genome-view'

export default function RepeatDisplayReactComponent (props: any) {
  return (
    <div>
      <BaseLinearDisplayComponent {...props} />
    </div>
  );
}
