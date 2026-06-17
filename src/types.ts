export interface GetAuthenticatedUserArgs {
  // No arguments needed for this endpoint
}

export interface AuthorizeUploadArgs {
  filename: string;
}

export interface ListShowsArgs {
  page?: number;
  per?: number;
  private?: boolean;
  query?: string;
}

export interface ListEpisodesArgs {
  show_id: string;
  page?: number;
  per?: number;
  query?: string;
  status?: "published" | "draft" | "scheduled";
  order?: "asc" | "desc";
  fields?: { [key: string]: string[] };
}

export interface CreateEpisodeArgs {
  show_id: string;
  title: string;
  audio_url: string;
  summary?: string;
  description?: string;
  transcript_text?: string;
  author?: string;
  explicit?: boolean;
  image_url?: string;
  keywords?: string;
  number?: number;
  season_number?: number;
  type?: "full" | "trailer" | "bonus";
  alternate_url?: string;
  video_url?: string;
  email_notifications?: boolean;
  increment_number?: boolean;
  status?: "published" | "draft" | "scheduled";
}

export interface UpdateEpisodeArgs {
  episode_id: string;
  title?: string;
  summary?: string;
  description?: string;
  transcript_text?: string;
  author?: string;
  explicit?: boolean;
  image_url?: string;
  keywords?: string;
  number?: number;
  season_number?: number;
  episode_number?: number;
  type?: "full" | "trailer" | "bonus";
  alternate_url?: string;
  video_url?: string;
  email_notifications?: boolean;
  status?: "published" | "draft" | "scheduled";
}

export interface GetAnalyticsArgs {
  show_id: string;
  episode_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface GetAllEpisodeAnalyticsArgs {
  show_id: string;
  start_date?: string;
  end_date?: string;
}

export interface ListWebhooksArgs {
  show_id: string;
}

export interface SubscribeWebhookArgs {
  event_name: string;
  show_id: string;
  url: string;
}

export interface UnsubscribeWebhookArgs {
  webhook_id: string;
}

export interface GetEpisodeArgs {
  episode_id: string;
  include?: string[];
  fields?: { [key: string]: string[] };
}

export interface GetDownloadSummaryArgs {
  show_id: string;
  episode_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface CompareEpisodesArgs {
  episode_ids: string[];
  start_date?: string;
  end_date?: string;
}

export interface PublishEpisodeArgs {
  episode_id: string;
  status: "published" | "scheduled" | "draft";
  published_at?: string;
}

export interface GetShowArgs {
  show_id: string;
}

export interface UpdateShowArgs {
  show_id: string;
  author?: string;
  category?: string;
  copyright?: string;
  description?: string;
  explicit?: boolean;
  image_url?: string;
  keywords?: string;
  language?: string;
  owner_email?: string;
  secondary_category?: string;
  show_type?: "episodic" | "serial";
  title?: string;
  time_zone?: string;
  website?: string;
}

export interface ListSubscribersArgs {
  show_id: string;
  page?: number;
  per?: number;
  query?: string;
}

export interface GetSubscriberArgs {
  subscriber_id: string;
}

export interface CreateSubscriberArgs {
  show_id: string;
  email: string;
  skip_welcome_email?: boolean;
}

export interface CreateSubscribersBatchArgs {
  show_id: string;
  emails: string[];
  skip_welcome_email?: boolean;
}

export interface UpdateSubscriberArgs {
  subscriber_id: string;
  email: string;
}

export interface DeleteSubscriberArgs {
  subscriber_id?: string;
  show_id?: string;
  email?: string;
}

// --- Validators ---

export function isListShowsArgs(args: unknown): args is ListShowsArgs {
  if (!args || typeof args !== "object") return false;
  const { page, per, query } = args as ListShowsArgs;
  return (
    (page === undefined || typeof page === "number") &&
    (per === undefined || typeof per === "number") &&
    (query === undefined || typeof query === "string")
  );
}

export function isListEpisodesArgs(args: unknown): args is ListEpisodesArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, page, per, query, status, order, fields } =
    args as ListEpisodesArgs;
  return (
    typeof show_id === "string" &&
    (page === undefined || typeof page === "number") &&
    (per === undefined || typeof per === "number") &&
    (query === undefined || typeof query === "string") &&
    (status === undefined ||
      ["published", "draft", "scheduled"].includes(status)) &&
    (order === undefined || ["asc", "desc"].includes(order)) &&
    (fields === undefined || typeof fields === "object")
  );
}

export function isCreateEpisodeArgs(args: unknown): args is CreateEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, title, audio_url } = args as CreateEpisodeArgs;
  return (
    typeof show_id === "string" &&
    typeof title === "string" &&
    typeof audio_url === "string"
  );
}

export function isUpdateEpisodeArgs(args: unknown): args is UpdateEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const { episode_id } = args as UpdateEpisodeArgs;
  return typeof episode_id === "string";
}

export function isGetAnalyticsArgs(args: unknown): args is GetAnalyticsArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, episode_id, start_date, end_date } =
    args as GetAnalyticsArgs;
  return (
    typeof show_id === "string" &&
    (episode_id === undefined || typeof episode_id === "string") &&
    (start_date === undefined || typeof start_date === "string") &&
    (end_date === undefined || typeof end_date === "string")
  );
}

export function isGetAllEpisodeAnalyticsArgs(
  args: unknown
): args is GetAllEpisodeAnalyticsArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, start_date, end_date } =
    args as GetAllEpisodeAnalyticsArgs;
  return (
    typeof show_id === "string" &&
    (start_date === undefined || typeof start_date === "string") &&
    (end_date === undefined || typeof end_date === "string")
  );
}

export function isListWebhooksArgs(args: unknown): args is ListWebhooksArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id } = args as ListWebhooksArgs;
  return typeof show_id === "string";
}

export function isSubscribeWebhookArgs(
  args: unknown
): args is SubscribeWebhookArgs {
  if (!args || typeof args !== "object") return false;
  const { event_name, show_id, url } = args as SubscribeWebhookArgs;
  return (
    typeof event_name === "string" &&
    typeof show_id === "string" &&
    typeof url === "string"
  );
}

export function isUnsubscribeWebhookArgs(
  args: unknown
): args is UnsubscribeWebhookArgs {
  if (!args || typeof args !== "object") return false;
  const { webhook_id } = args as UnsubscribeWebhookArgs;
  return typeof webhook_id === "string";
}

export function isGetAuthenticatedUserArgs(
  args: unknown
): args is GetAuthenticatedUserArgs {
  return true;
}

export function isAuthorizeUploadArgs(
  args: unknown
): args is AuthorizeUploadArgs {
  if (!args || typeof args !== "object") return false;
  const { filename } = args as AuthorizeUploadArgs;
  return typeof filename === "string";
}

export function isGetEpisodeArgs(args: unknown): args is GetEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const { episode_id, include, fields } = args as GetEpisodeArgs;
  return (
    typeof episode_id === "string" &&
    (include === undefined || Array.isArray(include)) &&
    (fields === undefined || typeof fields === "object")
  );
}

export function isGetDownloadSummaryArgs(
  args: unknown
): args is GetDownloadSummaryArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, episode_id, start_date, end_date } =
    args as GetDownloadSummaryArgs;
  return (
    typeof show_id === "string" &&
    (episode_id === undefined || typeof episode_id === "string") &&
    (start_date === undefined || typeof start_date === "string") &&
    (end_date === undefined || typeof end_date === "string")
  );
}

export function isCompareEpisodesArgs(
  args: unknown
): args is CompareEpisodesArgs {
  if (!args || typeof args !== "object") return false;
  const { episode_ids, start_date, end_date } = args as CompareEpisodesArgs;
  return (
    Array.isArray(episode_ids) &&
    episode_ids.length >= 2 &&
    episode_ids.every((id: unknown) => typeof id === "string") &&
    (start_date === undefined || typeof start_date === "string") &&
    (end_date === undefined || typeof end_date === "string")
  );
}

export function isPublishEpisodeArgs(
  args: unknown
): args is PublishEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const { episode_id, status } = args as PublishEpisodeArgs;
  return (
    typeof episode_id === "string" &&
    ["published", "scheduled", "draft"].includes(status)
  );
}

export function isGetShowArgs(args: unknown): args is GetShowArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id } = args as GetShowArgs;
  return typeof show_id === "string";
}

export function isUpdateShowArgs(args: unknown): args is UpdateShowArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id } = args as UpdateShowArgs;
  return typeof show_id === "string";
}

export function isListSubscribersArgs(
  args: unknown
): args is ListSubscribersArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id } = args as ListSubscribersArgs;
  return typeof show_id === "string";
}

export function isGetSubscriberArgs(
  args: unknown
): args is GetSubscriberArgs {
  if (!args || typeof args !== "object") return false;
  const { subscriber_id } = args as GetSubscriberArgs;
  return typeof subscriber_id === "string";
}

export function isCreateSubscriberArgs(
  args: unknown
): args is CreateSubscriberArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, email } = args as CreateSubscriberArgs;
  return typeof show_id === "string" && typeof email === "string";
}

export function isCreateSubscribersBatchArgs(
  args: unknown
): args is CreateSubscribersBatchArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, emails } = args as CreateSubscribersBatchArgs;
  return (
    typeof show_id === "string" &&
    Array.isArray(emails) &&
    emails.every((e: unknown) => typeof e === "string")
  );
}

export function isUpdateSubscriberArgs(
  args: unknown
): args is UpdateSubscriberArgs {
  if (!args || typeof args !== "object") return false;
  const { subscriber_id, email } = args as UpdateSubscriberArgs;
  return typeof subscriber_id === "string" && typeof email === "string";
}

export function isDeleteSubscriberArgs(
  args: unknown
): args is DeleteSubscriberArgs {
  if (!args || typeof args !== "object") return false;
  const { subscriber_id, show_id, email } = args as DeleteSubscriberArgs;
  // Either subscriber_id OR (show_id + email) must be provided
  return (
    typeof subscriber_id === "string" ||
    (typeof show_id === "string" && typeof email === "string")
  );
}
