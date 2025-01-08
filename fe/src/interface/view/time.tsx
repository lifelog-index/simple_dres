// create a grid 6 x 2 of CarouselHolder, with 2 side alignment
// using maps
import { useGlobal, GroupByType } from "@/contexts/global.context";
import { ImageDeck } from "@/interface/image/deck";
import { toast } from "sonner";
import { useEffect } from "react";
import { LOADING_IMAGE } from "@/contexts/defaults";

export function DateGrid() {
  const { groupedList, setGroupBy } = useGlobal();
  const { currPage, refreshPage } = useGlobal();

  useEffect(() => {
    setGroupBy(GroupByType.Time);
    toast("", {
      description: 'Switched to "Segment" grouping',
    });
    refreshPage();
  }, []);

  const fromIdx = Math.max(8 * (currPage - 1), 0);
  const toIdx = Math.min(8 * currPage, groupedList.length);
  const selectedImages = groupedList.slice(fromIdx, toIdx);
  if (selectedImages.length < 8) {
    for (let i = 0; i < 8 - selectedImages.length + 1; i++) {
      selectedImages.push([LOADING_IMAGE]);
    }
  }

  return (
    <div className="grid grid-cols-8 gap-10 w-max">
      {selectedImages.map((imageList, index) => (
        <div className="col-span-2">
          <ImageDeck imageList={imageList} carouselIndex={index} />
        </div>
      ))}
    </div>
  );
}
