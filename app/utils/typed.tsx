"use client";

import { useEffect, useState } from 'react';
import { GradualComponent } from './gradualComponent';

const Typed =
  ({ content, cooldown, onFullyRendered }: { content: string, cooldown: number, onFullyRendered: () => void }) => {
    const [prefixLen, setPrefixLen] = useState(0);

    useEffect(() => {
      const startTime = new Date().getTime();
      let prefixLenCopy = 0;

      const appendIfNeeded = () => {

        if (prefixLenCopy === content.length) {
          clearInterval(interval);
          onFullyRendered();
          return;
        }

        const currentTime = new Date().getTime();

        // Add a new character every cooldown miliseconds
        const newPrefixLen = Math.min(content.length, (currentTime - startTime) / cooldown)

        if (prefixLenCopy != newPrefixLen) {
          prefixLenCopy = newPrefixLen;
          setPrefixLen(newPrefixLen);
        }
      }

      const interval = setInterval(appendIfNeeded, 0.001)

      return () => {
        clearInterval(interval)
      }
    }, [])

    return content.slice(0, prefixLen)
  }

export default Typed