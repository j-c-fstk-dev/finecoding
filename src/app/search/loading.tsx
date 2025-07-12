import { WifiLoader } from "@/components/layout/WifiLoader";

export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <WifiLoader />
    </div>
  );
}
