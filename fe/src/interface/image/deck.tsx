import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ContextMenuImage } from "./shot";
import { uImage } from "@/schema/simple";
import { bionicConvertLSC } from "./caption";
// TODO: Add imageList, loop, AutoPlayDelay to CarouselHolder
export function ImageDeck({
  // imageList = [] as string[],
  imageList = [] as uImage[],
  loop = false,
  AutoPlayDelay = 5000,
  idx = 0,
  carouselIndex = 0,
}) {
  return (
    <Carousel className="w-full max-w-xs mb-[-20px]">
      <CarouselContent className="">
        {imageList.length !== 0 ? (
          Array.from({ length: imageList.length }).map((_, index) => (
            <CarouselItem key={index}>
              {/* <CarouselItem key={index}> */}
              <ContextMenuImage
                imageUrl={imageList[index].url}
                HDimageUrl={imageList[index].hdurl}
                carouselIndex={carouselIndex}
                badges={[`Image ${index + 1} out of ${imageList.length}`]}
              />
              <div>
                {imageList[index].titles.map((title) => (
                  <div className="text-s mb-[15px]">
                    {bionicConvertLSC(title)}
                  </div>
                ))}
              </div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <ContextMenuImage imageUrl={""} />
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}
