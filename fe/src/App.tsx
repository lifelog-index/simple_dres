import "./App.css";
import "./global.css";
import { SearchBar } from "@/interface/search.tsx";
import { PageNavigation } from "@/interface/pagenav.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangeInfo } from "@/interface/info";
import { GlobalProvider } from "./contexts/global.context";
import { Toaster } from "@/components/ui/sonner";

import { ShotsGrid } from "@/interface/view/shots";
import { LocationGrid } from "@/interface/view/location";
import { DateGrid } from "@/interface/view/time";
import { TextSubmit } from "./interface/text_submit";

export function DisplayTabs() {
  const handleTabChange = (value: any) => {
    // Handle tab change logic here
    console.log("tab change triggered");
    console.log("Selected tab:", value);
  };

  return (
    <Tabs defaultValue="shot" className="" onChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="shot">All shots</TabsTrigger>
        <TabsTrigger value="day">Group by segment</TabsTrigger>
        <TabsTrigger value="location">Group by video</TabsTrigger>
      </TabsList>
      <div className="h-2" />
      <TabsContent value="shot">
        <ShotsGrid />
      </TabsContent>
      <TabsContent value="day">
        <DateGrid />
      </TabsContent>
      <TabsContent value="location">
        <LocationGrid />
      </TabsContent>
    </Tabs>
  );
}

function App() {
  return (
    <>
      <GlobalProvider>
        <header>
          <div className="h-2" />
          <div className="flex space-x-4">
            {/* <ComboboxDataset />
            <ComboboxStrategy /> */}
            <PageNavigation />
            <div className="flex-grow" />
            <ChangeInfo />
          </div>
          <SearchBar />
          <TextSubmit />
          <div className="h-4" />
        </header>
        <main>
          <DisplayTabs />
          <Toaster />
        </main>
      </GlobalProvider>
    </>
  );
}
export default App;
