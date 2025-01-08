// USER GUIDE:
// --- Overview ---
// This snippet is a context file that contains the global context for the application.
// It is used to manage the state of the application and provide the state to the components that need it.
// --- How to use ---
// 1. Update the GlobalContextData type to match the data you want to store in the context.
// Example: Value: string[];
// 2. Update the GlobalProvider function to initialize the state and provide the state to the components.
// Example: const [value, setValue] = React.useState<GlobalContextData["value"]>([]);

import React from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import {
  TEST_IMAGE_LIST,
  MAX_DISPLAY_IMAGE,
  API_SEARCH_ITEM,
  API_FETCH_SEGMENT,
  API_FETCH_SEQ,
  API_LOGIN,
  API_SEARCH,
  API_SUBMIT,
  API_GAZELIST,
  API_DEFAULT_TRACK,
} from "@/contexts/defaults";
import { uImage } from "@/schema/simple";
import { lscImage, convertLscImageToUImage } from "@/schema/lsc";
import { toast } from "sonner";
export enum GroupByType {
  Shot = 2,
  Location = 3,
  Time = 4,
}
type GlobalContextData = {
  imageList: lscImage[];
  displayImageList: uImage[];
  currPage: number;
  setCurrPage: React.Dispatch<React.SetStateAction<number>>;
  groupBy: GroupByType;
  setGroupBy: React.Dispatch<React.SetStateAction<GroupByType>>;
  groupedList: uImage[][];
  loginCallBack: (username: string, password: string) => any;
  searchCallBack: (searchQuery: string) => any;
  searchItem: (imageID: string) => any;
  fetchSequence: (imageID: string) => any;
  fetchSegment: (imageID: string) => any;
  submitAnswer: (image: string) => any;
  expandGroup: (imageID: string) => any;
  refreshPage: () => void;
  rerank: () => void;
  globalUsername: string;
  globalPassword: string;
  defaultDresTrack: string;
  setGlobalUsername: React.Dispatch<React.SetStateAction<string>>;
  setDefaultDresTrack: React.Dispatch<React.SetStateAction<string>>;
  setGlobalPassword: React.Dispatch<React.SetStateAction<string>>;
  farthestPage: number;
  updateServerDefaultTrack: (trackname: string) => void;
};

const globalContext = React.createContext<GlobalContextData>(null as any);
import { reranking } from "./rerank";
export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [imageList, setImageList] = React.useState<
    GlobalContextData["imageList"]
  >([]);
  const [displayImageList, setDisplayImageList] =
    React.useState<GlobalContextData["displayImageList"]>(TEST_IMAGE_LIST);
  const [currPage, setCurrPage] = React.useState<number>(1);
  const [gazeList, setGazeList] = React.useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const [groupBy, setGroupBy] = React.useState<GlobalContextData["groupBy"]>(
    GroupByType.Shot
  );
  // const [sessionToken, setSessionToken] = React.useState<string>("empty");
  // create a session token using local storage
  const [sessionToken, setSessionToken] = React.useState<string>(
    localStorage.getItem("sessionToken") || ""
  );

  const [globalUsername, setGlobalUsername] = React.useState<string>(
    localStorage.getItem("username") || ""
  );

  const [defaultDresTrack, setDefaultDresTrack] = React.useState<string>(
    localStorage.getItem("trackname") || "KIS"
  );

  const [globalPassword, setGlobalPassword] = React.useState<string>(
    localStorage.getItem("password") || ""
  );
  // --- LOGIN ---
  const loginCallBack = React.useCallback(
    (username: string, password: string) => {
      toast.info(`Logging in with username ${username}`);
      axios
        .get(API_LOGIN, {
          params: {
            username: username,
            password: password,
          },
        })
        .then((response: AxiosResponse) => {
          setSessionToken(response.data.sessionId);
          toast.success(`Login successful with session token: ${sessionToken}`);
          localStorage.setItem("sessionToken", response.data.sessionId);
          // declare const toast: ((message: string | React.ReactNode, data?: ExternalToast) => string | number) & {
          //   success: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          //   info: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          //   warning: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          //   error: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          //   custom: (jsx: (id: number | string) => React.ReactElement, data?: ExternalToast) => string | number;
          //   message: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          //   promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) => string | number;
          //   dismiss: (id?: number | string) => string | number;
          //   loading: (message: string | React.ReactNode, data?: ExternalToast) => string | number;
          // };
          // write example success toast
        })
        .catch((error: any) => {
          console.error(error);
          toast.error("Login failed");
        });
      toast.info(`${API_LOGIN}`);
    },
    []
  );
  // --- LOGIN ---
  // --- MAIN ---
  const searchCallBack = React.useCallback((searchQuery: string) => {
    toast("", {
      description: "Searched for " + searchQuery,
    });
    axios
      .get(API_SEARCH, {
        params: {
          text: searchQuery,
        },
      })
      .then((response: AxiosResponse) => {
        setImageList(response.data.results);
        toast("", {
          description: "Received " + response.data.results.length + " images",
        });
      })
      .catch((error: any) => {
        console.error(error);

        if (error.code === "ERR_NETWORK") {
          toast.error("Connection refused. Please turn on the server.");
        }
      });
    refreshPage();
  }, []);

  const searchItem = React.useCallback((imageID: string) => {
    axios
      .get(API_SEARCH_ITEM, {
        params: {
          name: imageID,
        },
      })
      .then((response: AxiosResponse) => {
        setImageList(response.data.results);
        toast("", {
          description: "Received " + response.data.results.length + " images",
        });
      })
      .catch((error: any) => {
        console.error(error);
        if (error.code === "ERR_NETWORK") {
          toast.error("Connection refused. Please turn on the server.");
        }
      });
  }, []);

  const fetchSequence = React.useCallback((imageID: string) => {
    axios
      .get(API_FETCH_SEQ, {
        params: {
          name: imageID,
        },
      })
      .then((response: AxiosResponse) => {
        setImageList(response.data.results);
        toast("", {
          description: "Received " + response.data.results.length + " images",
        });
      })
      .catch((error: any) => {
        console.error(error);

        if (error.code === "ERR_NETWORK") {
          toast.error("Connection refused. Please turn on the server.");
        }
      });
  }, []);

  const fetchSegment = React.useCallback((imageID: string) => {
    axios
      .get(API_FETCH_SEGMENT, {
        params: {
          name: imageID,
        },
      })
      .then((response: AxiosResponse) => {
        setImageList(response.data.results);
        toast("", {
          description: "Received " + response.data.results.length + " images",
        });
      })
      .catch((error: any) => {
        console.error(error);

        if (error.code === "ERR_NETWORK") {
          toast.error("Connection refused. Please turn on the server.");
        }
      });
  }, []);

  // --- MAIN ---
  // const func restart
  const refreshPage = () => {
    setCurrPage(1);
    window.scrollTo(0, 0);
    setFarthestPage(1);
  };
  const submitAnswer = (image: string) => {
    toast.info(`Submit Image with token ${sessionToken}`);
    axios
      .get(API_SUBMIT, {
        params: {
          session: sessionToken,
          item: image,
        },
      })
      .then((response: AxiosResponse) => {
        if (response.data.success) {
          if (response.data.submission === "WRONG") {
            toast.error("Incorrect answer");
          }
          if (response.data.submission === "CORRECT") {
            toast.success("Correct answer");
          }
          if (response.data.submission === "INDETERMINATE") {
            toast.error("Pending answer");
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error: any) => {
        console.error(error);

        if (error.code === "ERR_NETWORK") {
          toast.error("Connection refused. Please turn on the server.");
        }
      });
  };
  // --- View Model ---

  const groupedList = React.useMemo(() => {
    // ImageList is a list of LSC Image Objects
    // DisplayImageList is a list of UImage Objects
    // This function groups the images based on the groupBy value
    // and returns a list of grouped images: uImage[][]

    // Group by Shot
    if (groupBy === GroupByType.Shot) {
      return imageList.map((image) => [convertLscImageToUImage(image)]);
    }

    if (groupBy === GroupByType.Location) {
      const groupedImages = new Map<string, uImage[]>();
      imageList.forEach((image) => {
        const loc = image.location;
        if (!groupedImages.has(loc)) {
          groupedImages.set(loc, []);
        }
        groupedImages.get(loc)!.push(convertLscImageToUImage(image));
      });
      return Array.from(groupedImages.values());
    }

    if (groupBy === GroupByType.Time) {
      const groupedImages = new Map<string, uImage[]>();
      imageList.forEach((image) => {
        const date = image.semanticTime;
        if (!groupedImages.has(date)) {
          groupedImages.set(date, []);
        }
        groupedImages.get(date)!.push(convertLscImageToUImage(image));
      });
      return Array.from(groupedImages.values());
    }
  }, [imageList, groupBy]);

  // --- View Model ---
  // expand group
  const expandGroup = React.useCallback(
    (imageID: string) => {
      const groupedData = groupedList.find((group) =>
        group.some((image) => image.url === imageID)
      );
      if (groupedData) {
        const newImageList = groupedData.flatMap((image) =>
          imageList.filter((lscImage) => lscImage.url === image.url)
        );
        setImageList(newImageList);
      }
    },
    [groupedList]
  );
  const [farthestPage, setFarthestPage] = React.useState<number>(1);

  React.useEffect(() => {
    setFarthestPage((prevFarthestPage) => Math.max(prevFarthestPage, currPage));
  }, [currPage]);

  // --- novelty reranking ---
  const rerank = React.useCallback(() => {
    // axios
    //   .get(API_GAZELIST)
    //   .then((response: AxiosResponse) => {
    //     setGazeList(response.data);
    //     console.log(gazeList);
    //   })
    //   .catch((error: any) => {
    //     setGazeList([0, 0, 0, 0, 0, 0, 0, 0]);
    //     console.error(error);
    //   });
    // if (gazeList.every((value, index) => value === 0)) {
    // } else {
    //   const tmp = [0, 0, 0, 0, 0, 0, 0, 0];
    //   const reranked = reranking(imageList, tmp, currPage, farthestPage, 8);
    //   // sanity check
    //   // all unique images in the reranked list are in the original list must be same
    //   const rerankedUrls = reranked.map((image) => image.url);
    //   const originalUrls = imageList.map((image) => image.url);
    //   if (rerankedUrls.some((url) => !originalUrls.includes(url))) {
    //     console.error("Reranked list contains images not in the original list");
    //   } else {
    //     console.log("Reranked list is valid");
    //   }
    // }
  }, [imageList, currPage, farthestPage]);

  const updateServerDefaultTrack = (trackname: string) => {
    axios
      .get(API_DEFAULT_TRACK, {
        params: {
          name: trackname,
        },
      })
      .then((response: AxiosResponse) => {
        console.log(response);
        toast.success("Default track changed to " + trackname);
      })
      .catch((error: any) => {
        console.log(error);
        if (error.code === "ERR_NETWORK") {
          toast.error("Default track change failed");
        }
      });
  };
  const contextValue = React.useMemo<GlobalContextData>(() => {
    return {
      currPage,
      setCurrPage,
      imageList,
      displayImageList,
      groupedList,
      setGroupBy,
      groupBy,
      loginCallBack,
      searchCallBack,
      submitAnswer,
      refreshPage,
      searchItem,
      fetchSegment,
      expandGroup,
      fetchSequence,
      rerank,
      globalUsername,
      globalPassword,
      defaultDresTrack,
      setGlobalUsername,
      setGlobalPassword,
      setDefaultDresTrack,
      farthestPage,
      updateServerDefaultTrack,
    };
  }, [
    currPage,
    setCurrPage,
    imageList,
    displayImageList,
    groupedList,
    setGroupBy,
    groupBy,
    loginCallBack,
    searchCallBack,
    submitAnswer,
    refreshPage,
    searchItem,
    fetchSequence,
    expandGroup,
    fetchSegment,
    rerank,
    globalUsername,
    globalPassword,
    defaultDresTrack,
    setGlobalUsername,
    setDefaultDresTrack,
    setGlobalPassword,
    farthestPage,
    updateServerDefaultTrack,
  ]);

  return (
    <globalContext.Provider value={contextValue}>
      {children}
    </globalContext.Provider>
  );
}

export function useGlobal() {
  return React.useContext(globalContext);
}
