import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";

const ClientWrapper = dynamic(() => import("@/components/ClientWrapper").then(mod => ({ default: mod.ClientWrapper })), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error('Unable to get access token');
  }

  return (
    <div className={"grow flex flex-col"}>
      <ClientWrapper accessToken={accessToken} />
    </div>
  );
}
