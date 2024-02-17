"use client";

import { useState } from 'react';
import type { GradualComponent } from './gradualComponent';

export default function GradualContainer({ components }: { components: GradualComponent[] }) {
  const numComponents = components.length


  const [renderingIndex, setRenderingIndex] = useState(0)

  const onChildFullyRendered = () => {
    if (renderingIndex + 1 < numComponents) {
      startRenderingNextComponent();
    }
  }

  const startRenderingNextComponent = () => {
    setRenderingIndex(renderingIndex + 1);
  }

  return (
    <div className='h-full w-full'>
      {
        components.slice(0, renderingIndex + 1).map(
          (Component, index) => {
            return  <Component onFullyRendered = { onChildFullyRendered } key = { index } ></Component>
          }
        )
      }
    </div>
  )
}