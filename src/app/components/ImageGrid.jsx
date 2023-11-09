'use client'
import Image from 'next/image'
import {useState} from "react";
import timeSince from "../utils/timeSince";
import Lightbox from "@/app/components/Lightbox";


const ImageItem = ({tx, timestamp, tags}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  const baseClass = "rounded-lg overflow-hidden transform transition will-change-auto brightness-80 group-hover:brightness-110 duration-700 ease-in-out";
  const imgClass = `${baseClass} ${loading === true ? 'saturation-25 blur-md scale-110' : 'grayscale-0 blur-0 scale-100'}`

  return (
    <div>
      <span className="bg-white/50 rounded-lg overflow-hidden">
        {!error &&
          <Image
            alt=''
            className={imgClass}
            style={{transform: 'translate3d(0, 0, 0)'}}
            src={`https://arweave.net/${tx}`}
            width={480}
            height={480}
            unoptimized={true}
            onLoadingComplete={() => setLoading(false)}
            onLoad={event => setLoading(false)}
            onClick={() => setOpen(true)}
            onCaptureError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        }
        {error &&
          <Image
            alt=''
            className={imgClass}
            style={{transform: 'translate3d(0, 0, 0)'}}
            src="/not-found.png"
            width={480}
            height={480}
            unoptimized={true}
            onLoadingComplete={() => setLoading(false)}
            onLoad={event => setLoading(false)}
            onCaptureError={() => setError(true)}
          />
        }
      </span>
      {!error && <Lightbox open={open} handleClose={()=>setOpen(false)} image={`https://arweave.net/${tx}`} />}
      <span className="px-1 py-3">{timeSince(timestamp)}</span>
    </div>
  )
}
export function ImageGrid({ images, setCurrentImage }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 xl:columns-4 2xl:columns-5">
      {/*{images && images.map(({ id, url, ar, blur }) => (*/}
      {images && images.map(({ id, block, tags }) => {

        return (
          <div
            key={id}
            // href={`https://unsplash.com/photos/${id}`}
            className="break-inside-avoid-column
              after:content group cursor-pointer
              relative mb-4 block w-full
              after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight
            "
            // onClick={() => {
            //   setCurrentImage({id, url, ar, blur});
            // }}
          >
            <ImageItem tx={id} timestamp={block.timestamp} tags={tags} />
          </div>
        )

      })}
    </div>)
}