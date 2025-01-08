import { lscImage } from "@/schema/lsc";
import { toast } from "sonner";

export function reranking(
  imageList: lscImage[],
  lastPageGaze: number[],
  currPage: number,
  farthestPage: number,
  imagePerPage: number = 8
) {
  function LLI(gazeList: number[]) {
    let minGaze = Math.min(...gazeList);
    let LLI_image_idx = gazeList.indexOf(minGaze);
    return LLI_image_idx;
  }

  function MLI(gazeList: number[]) {
    let maxGaze = Math.max(...gazeList);
    let LLI_image_idx = gazeList.indexOf(maxGaze);
    return LLI_image_idx;
  }
  function sameDay(image1: lscImage, image2: lscImage) {
    return image1.utcTime.split(" ")[0] == image2.utcTime.split(" ")[0];
  }

  if (farthestPage > currPage) {
    return imageList;
  }
  if (Math.max(...lastPageGaze) < 3) {
    return imageList;
  }
  let rankList = Array.from({ length: imageList.length }, (_, i) => i);
  if (currPage == 0) {
    return imageList;
  }
  if (currPage > 0) {
    let LLI_gaze_idx = LLI(lastPageGaze);
    let MLI_gaze_idx = MLI(lastPageGaze);
    let LLI_image_idx = (currPage - 1) * imagePerPage + LLI_gaze_idx;
    let MLI_image_idx = (currPage - 1) * imagePerPage + MLI_gaze_idx;

    function similarImages(image: lscImage, imageList: lscImage[]) {
      return imageList.filter((x) => sameDay(image, x));
    }

    let similarsLLI = similarImages(imageList[LLI_image_idx], imageList);
    let similarsMLI = similarImages(imageList[MLI_image_idx], imageList);
    let best_rank = currPage * imagePerPage;
    console.log("CurrPage", currPage, "FarthestPage", farthestPage);

    console.log("LLI", imageList[LLI_image_idx], lastPageGaze[LLI_gaze_idx]);
    console.log(similarsLLI);

    console.log("MLI", imageList[MLI_image_idx], lastPageGaze[MLI_gaze_idx]);
    console.log(similarsMLI);

    similarsMLI.forEach((similar) => {
      let idx = imageList.indexOf(similar);
      if (idx > currPage * imagePerPage) {
        // Move the image to a higher rank
        // However, the new rank should not change the rank of seen images
        rankList[idx] = Math.max(best_rank, rankList[idx] - 5);
      }
    });

    similarsLLI.forEach((similar) => {
      let idx = imageList.indexOf(similar);
      if (idx > currPage * imagePerPage) {
        // Move the image to a lower rank
        rankList[idx] = Math.max(best_rank, rankList[idx] + 5);
      }
    });
    // sort the image list based on the modified rank list
    let rankImageList: [number, lscImage][] = rankList.map((r, i) => [
      r,
      imageList[i],
    ]);
    rankImageList.sort((a, b) => (a[0] > b[0] ? 1 : -1));
    toast.info(`Reranked images`);
    const results = rankImageList.map((x) => x[1]);
    return results;
  }
}
