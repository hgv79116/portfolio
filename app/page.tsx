"use client";

import Image, { StaticImageData } from "next/image";
import Typed from './utils/typed';
import fileViewerThumbnail from '../public/large_file_viewer.png'
import hsgsCodeCupThumbnail from '../public/hsgs_codecup.png'
import foundationThumbnal from '../public/foundation_of_visualiser.png'
import { useEffect, useState } from 'react';
import Link from 'next/link';

const COOLDOWN = 10

interface ProjectData {
  title: string
  description: string,
  thumbnail: StaticImageData,
  github: string
}

const aboutString = `
Hi, my name is Hoang.
I am currently a second year student studying Computing and Software Systems at the Univsersity of Melbourne.
`

const projectsData: Array<ProjectData> = [
  {
    title: 'Large File Viewer',
    description: 'A file viewer developed in C++ for very large text files with subtext searching.',
    thumbnail: fileViewerThumbnail,
    github: 'https://github.com/hgv79116/large-file-viewer'
  },
  {
    title: 'HSGS Code Cup',
    description: 'A platform for organising player-vs-player programming contests which.',
    thumbnail: hsgsCodeCupThumbnail,
    github: 'https://github.com/CodecupHSGS/codecuphsgs'
  },
  {
    title: 'Foundations of Visualiser',
    description: 'Visualisations for concepts in foundational computing subjects at the University of Melbourne.',
    thumbnail: foundationThumbnal,
    github: 'https://github.com/Ddoraaaaa/foundation-of-vis'
  }
]

function ProjectCard({ projectData, onFullyRendered }: { projectData: ProjectData, onFullyRendered: () => void }) {
  const THUMBNAIL_HEIGHT = 500
  const THUMBNAIL_WIDTH = 350
  const RATE = 3
  const COOLDOWN = 3
  const [thumbnailHeight, setThumbnailHeight] = useState(0)
  const [thumbnailRendered, setThumbnailRendered] = useState(false)
  const [titleRendered, setTitleRendered] = useState(false)



  useEffect(() => {
    let thumbnailHeightCopy = 0

    const check = () => {
      if (thumbnailHeightCopy === THUMBNAIL_HEIGHT) {
        clearInterval(interval)
        onFullyRendered();
        return;
      }

      thumbnailHeightCopy = Math.min(THUMBNAIL_HEIGHT, thumbnailHeightCopy + RATE)
      setThumbnailHeight(thumbnailHeightCopy)
    }

    const interval = setInterval(check, COOLDOWN)
  }, [])


  const onThumbnailRendered = () => {
    setThumbnailRendered(true)
  }

  const onTitleRendered = () => {
    setTitleRendered(true)
  }

  const shouldRenderTitle = thumbnailRendered

  const shouldRenderDescription = titleRendered && thumbnailRendered

  const shadowStyle = 'shadow-none shadow-gray-700 duration-700'
  const hoverShadowStyle = 'hover:shadow-xl hover:shadow-gray-100 duration-700'
  const titleStyle = 'underline'
  const titleHoverStyle = 'hover:underline duration-700'

  return (
    <svg width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT}>
      <clipPath id="clip">
        <path d={`M0,0 v${thumbnailHeight} l${THUMBNAIL_WIDTH},0 v-${thumbnailHeight} z`} />
      </clipPath>
      <foreignObject clip-path="url(#clip)" width={THUMBNAIL_WIDTH} height={THUMBNAIL_HEIGHT}>
        <div className={`w-full h-full rounded-md border-solid border-2 border-gray-800 bg-black ${shadowStyle} ${hoverShadowStyle}`}>
          <Link className='w-full h-full absolute' href={projectData.github}/>

          <div className={`w-full h-full flex flex-col items-center`}>
          <div className="img_section">
            <Image src={projectData.thumbnail} alt="sliced-image" />
          </div>
          <div className={`${titleStyle} ${titleHoverStyle}`}>
            {projectData.title}
          </div>
          <div>
            {projectData.description}
          </div>
          </div>
        </div>
      </foreignObject>
      </svg>
  )
}

const NUM_POINTS = 30
const VIEWBOX_X = 200
const VIEWBOX_Y = 100;
interface Point {
  x: number,
  y: number
}
interface Vector {
  x: number,
  y: number
}
const coordinates: Array<Point> = []
const directions: Array<Vector> = []
for (let i = 0; i < NUM_POINTS; i++) {
  coordinates.push({
    x: Math.random() * VIEWBOX_X,
    y: Math.random() * VIEWBOX_Y
  })
}
// From -1 to 1
for (let i = 0; i < NUM_POINTS; i++) {
  directions.push({
    x: (Math.random()-0.5) * 0.25,
    y: (Math.random()-0.5) * 0.25
  })
}

function BackgroundImage() {
  const [currentTime, setCurrentTime] = useState(new Date().getTime())
  useEffect(() => {
    const update = () => {
      console.log("updating")
      for (let i = 0; i < coordinates.length; i++) {
        coordinates[i].x += directions[i].x
        coordinates[i].y += directions[i].y

        while (coordinates[i].x <= 0) coordinates[i].x += VIEWBOX_X;
        while (coordinates[i].x > VIEWBOX_X) coordinates[i].x -= VIEWBOX_X
        while (coordinates[i].y <= 0) coordinates[i].y += VIEWBOX_Y
        while (coordinates[i].y > VIEWBOX_Y) coordinates[i].y -= VIEWBOX_Y
      }

      setCurrentTime(new Date().getTime())
    }

    const interval = setInterval(update, 50)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const getDist = (i: number, j: number) => {
    return Math.sqrt(Math.pow(coordinates[i].x - coordinates[j].x, 2) + Math.pow(coordinates[i].y - coordinates[j].y, 2))
  }

  const lines: Array<Array<number>> = [];

  for (let i = 0; i + 1 < NUM_POINTS; i++) {
    let minIndex = NUM_POINTS - 1;
    let minDist = getDist(i, minIndex)
    for (let j = 0; j < NUM_POINTS; j++) {
      if (i === j) continue

      const newDist = getDist(i, j)
      if (newDist < minDist) {
        minDist = newDist
        minIndex = j
      }
    }

    lines.push([i, minIndex])
  }

  console.log(lines)

  return (
    <svg viewBox='0 0 200 200'>
      {coordinates.map((point, index) => {
        return <circle key={index} r={0.3} cx={point.x} cy={point.y} fill="gray"></circle>
      })}
      {lines.map((lineIndices, index) => {
        const i = lineIndices[0];
        const j = lineIndices[1];
        return <line key={index}
          x1={coordinates[i].x}
          y1={coordinates[i].y}
          x2={coordinates[j].x}
          y2={coordinates[j].y}
          stroke='gray'
          strokeWidth={0.1}
        />
      })}
    </svg>
  )
}

export default function Home() {
  const [introductionRendered, setIntroductionRendered] = useState(false);
  const [numProjectsRendered, setNumProjectsRendered] = useState(0);

  const shouldRenderProjects = introductionRendered;

  const shouldRenderContacts = introductionRendered && (numProjectsRendered == projectsData.length)

  const onIntroductionFullyRendered = () => {
    setIntroductionRendered(true);
  }

  const onProjectRendered = () => {
    setNumProjectsRendered((oldValue) => oldValue + 1)
  }

  return (
    <div className='h-full w-full'>
      <div className='w-full h-full absolute -z-20'>
        <BackgroundImage/>
      </div>
      <div className='w-1/2 h-full m-auto mt-10 z-20'>
        <Typed content={aboutString} onFullyRendered={onIntroductionFullyRendered} cooldown={COOLDOWN}></Typed>
        {shouldRenderProjects &&
          <div className='w-full h-full grid grid-rows-2 grid-cols-2'>
            {projectsData.map((projectData, index) => {
              return (
                <div key={index} className='w-1/2 p-5'>
                  <ProjectCard projectData={projectData} onFullyRendered={onProjectRendered}/>
                </div>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
}
