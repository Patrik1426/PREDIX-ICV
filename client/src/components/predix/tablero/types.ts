import { dashboardData } from "@/lib/predixDemoData";

export type Period = "30d" | "90d" | "ytd";
export type Delegation = "todas" | (typeof dashboardData)["delegations"][number]["name"];
