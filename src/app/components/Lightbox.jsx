"use client"
import {Fragment} from "react";
import Image from "next/image";


export default function Lightbox({open, handleClose, image, isSvg}) {
  return (
    <Fragment>
      {open &&
          <div
            onClick={handleClose}
            className="fixed left-0 top-0 right-0 bottom-0 z-[100]
            justify-center items-center p-8
            md:inset-0
            !w-[calc(100vw-(100vw-100%))] !h-[calc(100vw-(100vw-100%))]
            bg-gray-900/50"
          >
              <div
                className="relative h-full w-full"
              >
                {isSvg
                    // eslint-disable-next-line @next/next/no-img-element
                  ? <img
                    src={image}
                    className="w-full h-full object-contain"
                    alt={""}
                  />
                  : <Image
                    src={image}
                    fill
                    className="object-contain"
                    alt={""}
                  />
                }
              </div>
          </div>

      }
    </Fragment>
  );
}