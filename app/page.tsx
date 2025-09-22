import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import BusinessDashboard from "@/components/BusinessDashboard";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  // Always show the business dashboard as the main interface
  // Pass the access token so it can show voice features when available
  return <BusinessDashboard accessToken={accessToken} />;
}
