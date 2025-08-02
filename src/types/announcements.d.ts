export type AnnouncementsRequestBody = {
  title: string;
  content: string;
  date: string;
  status: StatusAnnouncements;
};
type StatusAnnouncements = "DRAFT" | "PUBLISHED";
