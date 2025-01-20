import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/spline-scene";

export default function Page() {
  return (
    <div className="w-full h-full p-5 flex items-center justify-center">
      <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden">
        <div className="flex h-full">
          <SplineScene
            scene="https://draft.spline.design/6P4G2rL-QNk8ORGq/scene.splinecode"
            className="w-full h-full"
          ></SplineScene>
        </div>
      </Card>
    </div>
  );
}
