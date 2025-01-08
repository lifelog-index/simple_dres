import { GroupByType, useGlobal } from "@/contexts/global.context";
import { ImageDeck } from "@/interface/image/deck";
import { LOADING_IMAGE } from "@/contexts/defaults";
import { useEffect } from "react";
import { toast } from "sonner";
export function ShotsGrid() {
  const { groupedList, setGroupBy } = useGlobal();
  const { currPage, refreshPage } = useGlobal();

  useEffect(() => {
    setGroupBy(GroupByType.Shot);
    toast("", {
      description: 'Switched to "Shots" grouping',
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
