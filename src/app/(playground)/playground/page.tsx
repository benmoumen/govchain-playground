"use server";
import { AppDownloadButtons } from "@/components/ui/app-download-buttons";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/spline-scene";
import * as motion from "motion/react-client";

export default async function Page() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Card className="w-full h-[600px] py-0 bg-black/[0.96] relative overflow-hidden">
        <div className="flex h-full">
          <SplineScene
            scene="https://draft.spline.design/6P4G2rL-QNk8ORGq/scene.splinecode"
            className="w-full h-full"
          ></SplineScene>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1 }}
          className="absolute top-0 p-4"
        >
          <AppDownloadButtons />
        </motion.div>
      </Card>
    </div>
  );
}
