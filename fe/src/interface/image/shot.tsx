import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "./skeleton";
import React from "react";
import { useGlobal } from "@/contexts/global.context";
import { zoomEffect } from "./contextmenu/zoom";
import { toast } from "sonner";

export function ImageCard({ oneImage = "", badges = ["test"] }) {
  return (
    <Card className="mb-[-20px] mt-[-20px]">
      <CardContent className="h-[250px] flex justify-center p-5">
        <div className="overflow-hidden rounded-md">
          <img src={oneImage} alt="image" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center  mt-[-15px]">
        {badges.map((badge) => (
          <Badge>{badge}</Badge>
        ))}
      </CardFooter>
    </Card>
  );
}

export function ContextMenuImage({
  imageUrl = "",
  HDimageUrl = "",
  badges = [],
  carouselIndex = 0,
}) {
  if (imageUrl === "") {
    return <SkeletonCard />;
  }
  const { submitAnswer, searchItem, fetchSequence, fetchSegment, expandGroup } =
    useGlobal();
  const handleSubmit = React.useCallback(() => {
    submitAnswer(imageUrl);
  }, [carouselIndex, imageUrl]);

  const handleZoom = React.useCallback(() => {
    zoomEffect(HDimageUrl); // HDimageUrl
  }, [carouselIndex, HDimageUrl]);

  const handleSimilarImages = React.useCallback(() => {
    searchItem(imageUrl);
  }, [carouselIndex, imageUrl]);

  const handleShowThisDay = React.useCallback(() => {
    fetchSequence(imageUrl);
  }, [carouselIndex, imageUrl]);

  const handleShowThisTimeOfDay = React.useCallback(() => {
    fetchSegment(imageUrl);
  }, [carouselIndex, imageUrl]);

  const handleShowImageID = React.useCallback(() => {
    // https://lifeseeker-ci.computing.dcu.ie/images/lsc22/video12/0001.jpg
    // video id = video12
    // image id = 0001
    // const imageID = imageUrl.split("/").pop().split(".")[0];
    const videoID = imageUrl.split("/").slice(-2, -1)[0];
    const imageID = imageUrl.split("/").pop().split(".")[0];
    toast.info(`Video ID: ${videoID} - Image ID: ${imageID}`);
  }, []);
  const handleExpandGroup = React.useCallback(() => {
    expandGroup(imageUrl);
  }, [carouselIndex, imageUrl]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <ImageCard oneImage={imageUrl} badges={badges} />
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onClick={handleSubmit}>
          Submit
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleZoom}>
          Zoom
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={handleShowThisDay}>
          Show this video
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleShowThisTimeOfDay}>
          Show this segment
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleExpandGroup}>
          Expand this group
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={handleSimilarImages}>
          Similar Image
        </ContextMenuItem>
        <ContextMenuItem inset onClick={handleShowImageID}>
          Show Image ID
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
