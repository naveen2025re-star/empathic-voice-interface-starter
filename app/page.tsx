import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import ClientWrapper from "@/components/ClientWrapper";

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
