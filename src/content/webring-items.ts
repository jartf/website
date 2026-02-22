// Webring items types
export type WebringItem = {
  name: string;
  url: string;
  previous: string;
  random: string | null;
  next: string;
  description?: string;
  status: "active" | "pending";
};
