import Spline from "@splinetool/react-spline/next";
interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div>
      <Spline scene={scene} className={className} />
    </div>
  );
}
