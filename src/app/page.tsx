import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import HomeView from "@/views/home/home-view";

export const metadata: Metadata = { alternates: { canonical: `${SITE_URL}/` } };

export default HomeView;
