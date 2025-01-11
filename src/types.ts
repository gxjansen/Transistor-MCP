export interface ListShowsArgs {
  page?: number;
}

export interface ListEpisodesArgs {
  show_id: string;
  page?: number;
  status?: "published" | "draft" | "scheduled";
}

export interface CreateEpisodeArgs {
  show_id: string;
  title: string;
  summary?: string;
  description?: string;
  status?: "published" | "draft" | "scheduled";
  season_number?: number;
  episode_number?: number;
  audio_url: string;
}

export interface UpdateEpisodeArgs {
  episode_id: string;
  title?: string;
  summary?: string;
  description?: string;
  status?: "published" | "draft" | "scheduled";
  season_number?: number;
  episode_number?: number;
}

export interface GetAnalyticsArgs {
  show_id: string;
  episode_id?: string;
  start_date: string;
  end_date: string;
}

export interface GetAllEpisodeAnalyticsArgs {
  show_id: string;
  start_date: string;
  end_date: string;
}

export interface ListWebhooksArgs {
  show_id: string;
}

export interface SubscribeWebhookArgs {
  event_name: string;  // "episode_created"
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

export function isListShowsArgs(args: unknown): args is ListShowsArgs {
  if (!args || typeof args !== "object") return false;
  const { page } = args as ListShowsArgs;
  return page === undefined || typeof page === "number";
}

export function isListEpisodesArgs(args: unknown): args is ListEpisodesArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, page, status } = args as ListEpisodesArgs;
  return (
    typeof show_id === "string" &&
    (page === undefined || typeof page === "number") &&
    (status === undefined ||
      ["published", "draft", "scheduled"].includes(status))
  );
}

export function isCreateEpisodeArgs(args: unknown): args is CreateEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const {
    show_id,
    title,
    audio_url,
    summary,
    description,
    status,
    season_number,
    episode_number,
  } = args as CreateEpisodeArgs;
  return (
    typeof show_id === "string" &&
    typeof title === "string" &&
    typeof audio_url === "string" &&
    (summary === undefined || typeof summary === "string") &&
    (description === undefined || typeof description === "string") &&
    (status === undefined ||
      ["published", "draft", "scheduled"].includes(status)) &&
    (season_number === undefined || typeof season_number === "number") &&
    (episode_number === undefined || typeof episode_number === "number")
  );
}

export function isUpdateEpisodeArgs(args: unknown): args is UpdateEpisodeArgs {
  if (!args || typeof args !== "object") return false;
  const {
    episode_id,
    title,
    summary,
    description,
    status,
    season_number,
    episode_number,
  } = args as UpdateEpisodeArgs;
  return (
    typeof episode_id === "string" &&
    (title === undefined || typeof title === "string") &&
    (summary === undefined || typeof summary === "string") &&
    (description === undefined || typeof description === "string") &&
    (status === undefined ||
      ["published", "draft", "scheduled"].includes(status)) &&
    (season_number === undefined || typeof season_number === "number") &&
    (episode_number === undefined || typeof episode_number === "number")
  );
}

export function isGetAnalyticsArgs(args: unknown): args is GetAnalyticsArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, episode_id, start_date, end_date } =
    args as GetAnalyticsArgs;
  return (
    typeof show_id === "string" &&
    (episode_id === undefined || typeof episode_id === "string") &&
    typeof start_date === "string" &&
    typeof end_date === "string"
  );
}

export function isGetAllEpisodeAnalyticsArgs(args: unknown): args is GetAllEpisodeAnalyticsArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id, start_date, end_date } = args as GetAllEpisodeAnalyticsArgs;
  return (
    typeof show_id === "string" &&
    typeof start_date === "string" &&
    typeof end_date === "string"
  );
}

export function isListWebhooksArgs(args: unknown): args is ListWebhooksArgs {
  if (!args || typeof args !== "object") return false;
  const { show_id } = args as ListWebhooksArgs;
  return typeof show_id === "string";
}

export function isSubscribeWebhookArgs(args: unknown): args is SubscribeWebhookArgs {
  if (!args || typeof args !== "object") return false;
  const { event_name, show_id, url } = args as SubscribeWebhookArgs;
  return (
    typeof event_name === "string" &&
    typeof show_id === "string" &&
    typeof url === "string"
  );
}

export function isUnsubscribeWebhookArgs(args: unknown): args is UnsubscribeWebhookArgs {
  if (!args || typeof args !== "object") return false;
  const { webhook_id } = args as UnsubscribeWebhookArgs;
  return typeof webhook_id === "string";
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
