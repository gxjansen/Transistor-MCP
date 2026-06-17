import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { TransistorApiClient } from "./api-client.js";
import {
  isListShowsArgs,
  isListEpisodesArgs,
  isCreateEpisodeArgs,
  isUpdateEpisodeArgs,
  isGetAnalyticsArgs,
  isGetEpisodeArgs,
  isGetAllEpisodeAnalyticsArgs,
  isListWebhooksArgs,
  isSubscribeWebhookArgs,
  isUnsubscribeWebhookArgs,
  isGetAuthenticatedUserArgs,
  isAuthorizeUploadArgs,
  isGetDownloadSummaryArgs,
  isCompareEpisodesArgs,
  isPublishEpisodeArgs,
  isGetShowArgs,
  isUpdateShowArgs,
  isListSubscribersArgs,
  isGetSubscriberArgs,
  isCreateSubscriberArgs,
  isCreateSubscribersBatchArgs,
  isUpdateSubscriberArgs,
  isDeleteSubscriberArgs,
  AuthorizeUploadArgs,
  GetDownloadSummaryArgs,
  CompareEpisodesArgs,
} from "./types.js";
import { toIsoDate } from "./date-utils.js";
import axios from "axios";

/**
 * Extract a concise, human-readable message from an unknown thrown value,
 * preferring the Transistor API's status/message when it is an Axios error.
 */
function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const apiMsg =
      (e.response?.data as { error?: string } | undefined)?.error ?? e.message;
    return status ? `HTTP ${status}: ${apiMsg}` : apiMsg;
  }
  return e instanceof Error ? e.message : String(e);
}

/**
 * Strip heavy fields from episode responses to reduce token usage.
 * Removes HTML descriptions, embed codes, and formatted variants
 * that are rarely needed by the caller.
 */
function trimEpisodeResponse(data: any): any {
  if (!data?.data) return data;

  const strip = (attrs: any) => {
    if (!attrs) return;
    delete attrs.formatted_description;
    delete attrs.formatted_summary;
    delete attrs.embed_html;
    delete attrs.embed_html_dark;
    // Keep description and summary since callers may need them
  };

  if (Array.isArray(data.data)) {
    for (const ep of data.data) strip(ep?.attributes);
  } else {
    strip(data.data?.attributes);
  }
  return data;
}

export class ToolHandlers {
  constructor(
    private apiClient: TransistorApiClient,
    private hasCredentials: boolean = true
  ) {}

  getToolDefinitions() {
    return [
      {
        name: "get_authenticated_user",
        description: "Get details of the authenticated user account",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "authorize_upload",
        description: "Get a pre-signed URL for uploading an audio file",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "Filename of the audio file to upload",
            },
          },
          required: ["filename"],
        },
      },
      {
        name: "list_shows",
        description: "List all shows in your Transistor.fm account",
        inputSchema: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "Page number for pagination",
              minimum: 1,
            },
            per: {
              type: "number",
              description: "Items per page (default 10, max 100)",
              minimum: 1,
              maximum: 100,
            },
            private: {
              type: "boolean",
              description: "Filter for private shows",
            },
            query: {
              type: "string",
              description: "Search query to filter shows",
            },
          },
        },
      },
      {
        name: "list_episodes",
        description:
          "List episodes for a specific show. Use 'fields' to request only specific attributes and reduce response size (e.g. {\"episode\": [\"title\", \"number\", \"status\", \"season\"]}). Use 'query' to search by title.",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to list episodes for",
            },
            page: {
              type: "number",
              description: "Page number for pagination",
              minimum: 1,
            },
            per: {
              type: "number",
              description: "Items per page (default 10, max 100)",
              minimum: 1,
              maximum: 100,
            },
            query: {
              type: "string",
              description: "Search episodes by title",
            },
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "Filter episodes by status",
            },
            order: {
              type: "string",
              enum: ["asc", "desc"],
              description:
                "Sort order: 'desc' (newest first, default) or 'asc' (oldest first)",
            },
            fields: {
              type: "object",
              description:
                "Sparse fieldsets to reduce response size. Keys are resource types (e.g. 'episode'), values are arrays of field names (e.g. ['title', 'number', 'status', 'season', 'transcript_url'])",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "create_episode",
        description: "Create a new episode",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to create the episode in",
            },
            title: {
              type: "string",
              description: "Episode title",
            },
            audio_url: {
              type: "string",
              description: "URL to the episode audio file",
            },
            summary: {
              type: "string",
              description: "Episode summary",
            },
            description: {
              type: "string",
              description: "Episode description (supports HTML)",
            },
            transcript_text: {
              type: "string",
              description: "Plain text transcript for the episode",
            },
            author: {
              type: "string",
              description: "Episode author name",
            },
            explicit: {
              type: "boolean",
              description: "Whether the episode contains explicit content",
            },
            image_url: {
              type: "string",
              description: "URL to episode artwork",
            },
            keywords: {
              type: "string",
              description: "Comma-separated list of keywords",
            },
            number: {
              type: "number",
              description: "Episode number",
            },
            season_number: {
              type: "number",
              description: "Season number",
            },
            type: {
              type: "string",
              enum: ["full", "trailer", "bonus"],
              description: "Episode type",
            },
            alternate_url: {
              type: "string",
              description: "Override the default share URL",
            },
            video_url: {
              type: "string",
              description: "YouTube or video URL",
            },
            email_notifications: {
              type: "boolean",
              description: "Override show email notification setting",
            },
            increment_number: {
              type: "boolean",
              description: "Auto-set next episode number",
            },
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "Episode status",
            },
          },
          required: ["show_id", "title", "audio_url"],
        },
      },
      {
        name: "update_episode",
        description: "Update an existing episode",
        inputSchema: {
          type: "object",
          properties: {
            episode_id: {
              type: "string",
              description: "ID of the episode to update",
            },
            title: {
              type: "string",
              description: "New episode title",
            },
            summary: {
              type: "string",
              description: "New episode summary",
            },
            description: {
              type: "string",
              description: "New episode description (supports HTML)",
            },
            transcript_text: {
              type: "string",
              description: "Plain text transcript for the episode",
            },
            author: {
              type: "string",
              description: "Episode author name",
            },
            explicit: {
              type: "boolean",
              description: "Whether the episode contains explicit content",
            },
            image_url: {
              type: "string",
              description: "URL to episode artwork",
            },
            keywords: {
              type: "string",
              description: "Comma-separated list of keywords",
            },
            number: {
              type: "number",
              description: "Episode number",
            },
            season_number: {
              type: "number",
              description: "New season number",
            },
            episode_number: {
              type: "number",
              description: "New episode number (alias for number)",
            },
            type: {
              type: "string",
              enum: ["full", "trailer", "bonus"],
              description: "Episode type",
            },
            alternate_url: {
              type: "string",
              description: "Override the default share URL",
            },
            video_url: {
              type: "string",
              description: "YouTube or video URL",
            },
            email_notifications: {
              type: "boolean",
              description: "Override show email notification setting",
            },
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "New episode status",
            },
          },
          required: ["episode_id"],
        },
      },
      {
        name: "get_analytics",
        description:
          "Get analytics for a show or episode. Defaults to last 14 days if no dates provided.",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to get analytics for",
            },
            episode_id: {
              type: "string",
              description:
                "ID of the episode to get analytics for (optional)",
            },
            start_date: {
              type: "string",
              description: "Start date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
            end_date: {
              type: "string",
              description: "End date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "get_episode",
        description: "Get a single episode",
        inputSchema: {
          type: "object",
          properties: {
            episode_id: {
              type: "string",
              description: "ID of the episode to get",
            },
            include: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Include related resources",
            },
            fields: {
              type: "object",
              description: "Sparse fieldsets",
            },
          },
          required: ["episode_id"],
        },
      },
      {
        name: "get_all_episode_analytics",
        description:
          "Get analytics for all episodes of a show. Defaults to last 7 days if no dates provided.",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to get analytics for",
            },
            start_date: {
              type: "string",
              description: "Start date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
            end_date: {
              type: "string",
              description: "End date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "list_webhooks",
        description: "List all webhooks for a show",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to list webhooks for",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "subscribe_webhook",
        description: "Subscribe to a webhook for a show",
        inputSchema: {
          type: "object",
          properties: {
            event_name: {
              type: "string",
              description: "Event name (e.g., 'episode_created')",
            },
            show_id: {
              type: "string",
              description: "ID of the show to subscribe to",
            },
            url: {
              type: "string",
              description: "URL to receive webhook events",
            },
          },
          required: ["event_name", "show_id", "url"],
        },
      },
      {
        name: "unsubscribe_webhook",
        description: "Unsubscribe from a webhook",
        inputSchema: {
          type: "object",
          properties: {
            webhook_id: {
              type: "string",
              description: "ID of the webhook to unsubscribe from",
            },
          },
          required: ["webhook_id"],
        },
      },
      {
        name: "get_download_summary",
        description:
          "Get a computed download summary for a show or episode. Returns total downloads, daily average, week-over-week trend, and best/worst days — no manual calculation needed.",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show",
            },
            episode_id: {
              type: "string",
              description: "ID of a specific episode (optional, omit for show-level stats)",
            },
            start_date: {
              type: "string",
              description: "Start date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
            end_date: {
              type: "string",
              description: "End date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "compare_episodes",
        description:
          "Compare download performance across 2 or more episodes. Returns side-by-side stats: total downloads, daily average, peak day, and days since publish for each episode.",
        inputSchema: {
          type: "object",
          properties: {
            episode_ids: {
              type: "array",
              items: { type: "string" },
              minItems: 2,
              description: "Array of episode IDs to compare (minimum 2)",
            },
            start_date: {
              type: "string",
              description: "Start date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
            end_date: {
              type: "string",
              description: "End date (accepts yyyy-mm-dd or dd-mm-yyyy) (optional)",
            },
          },
          required: ["episode_ids"],
        },
      },
      {
        name: "publish_episode",
        description:
          "Publish, schedule, or unpublish an episode. Use this to change an episode's publish status separately from updating its metadata.",
        inputSchema: {
          type: "object",
          properties: {
            episode_id: {
              type: "string",
              description: "ID of the episode",
            },
            status: {
              type: "string",
              enum: ["published", "scheduled", "draft"],
              description:
                "New status: 'published' to publish now, 'scheduled' to schedule for a future date, 'draft' to unpublish",
            },
            published_at: {
              type: "string",
              description:
                "Date/time to publish or schedule (in the podcast's time zone). Required when status is 'scheduled'.",
            },
          },
          required: ["episode_id", "status"],
        },
      },
      {
        name: "get_show",
        description: "Get details of a single show by ID",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "update_show",
        description: "Update a show's metadata",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to update",
            },
            author: {
              type: "string",
              description: "Show author name",
            },
            category: {
              type: "string",
              description: "Primary podcast category",
            },
            copyright: {
              type: "string",
              description: "Copyright notice",
            },
            description: {
              type: "string",
              description: "Show description",
            },
            explicit: {
              type: "boolean",
              description: "Whether the show contains explicit content",
            },
            image_url: {
              type: "string",
              description: "URL to show artwork",
            },
            keywords: {
              type: "string",
              description: "Comma-separated keywords",
            },
            language: {
              type: "string",
              description: "Show language (e.g. 'en')",
            },
            owner_email: {
              type: "string",
              description: "Owner email address",
            },
            secondary_category: {
              type: "string",
              description: "Secondary podcast category",
            },
            show_type: {
              type: "string",
              enum: ["episodic", "serial"],
              description: "Show type",
            },
            title: {
              type: "string",
              description: "Show title",
            },
            time_zone: {
              type: "string",
              description: "Time zone for the show",
            },
            website: {
              type: "string",
              description: "Show website URL",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "list_subscribers",
        description:
          "List subscribers for a private podcast. Returns a paginated list.",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the private podcast",
            },
            page: {
              type: "number",
              description: "Page number for pagination",
              minimum: 1,
            },
            per: {
              type: "number",
              description: "Items per page (default 10)",
              minimum: 1,
            },
            query: {
              type: "string",
              description: "Search query to filter subscribers",
            },
          },
          required: ["show_id"],
        },
      },
      {
        name: "get_subscriber",
        description: "Get details of a single subscriber",
        inputSchema: {
          type: "object",
          properties: {
            subscriber_id: {
              type: "string",
              description: "ID of the subscriber",
            },
          },
          required: ["subscriber_id"],
        },
      },
      {
        name: "create_subscriber",
        description: "Add a subscriber to a private podcast",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the private podcast",
            },
            email: {
              type: "string",
              description: "Subscriber email address",
            },
            skip_welcome_email: {
              type: "boolean",
              description: "Skip sending welcome email (default false)",
            },
          },
          required: ["show_id", "email"],
        },
      },
      {
        name: "create_subscribers_batch",
        description: "Add multiple subscribers to a private podcast at once",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the private podcast",
            },
            emails: {
              type: "array",
              items: { type: "string" },
              description: "Array of subscriber email addresses",
            },
            skip_welcome_email: {
              type: "boolean",
              description: "Skip sending welcome emails (default false)",
            },
          },
          required: ["show_id", "emails"],
        },
      },
      {
        name: "update_subscriber",
        description: "Update a subscriber's email address",
        inputSchema: {
          type: "object",
          properties: {
            subscriber_id: {
              type: "string",
              description: "ID of the subscriber to update",
            },
            email: {
              type: "string",
              description: "New email address",
            },
          },
          required: ["subscriber_id", "email"],
        },
      },
      {
        name: "delete_subscriber",
        description:
          "Delete a subscriber by ID or by show_id + email. Provide either subscriber_id alone, or both show_id and email.",
        inputSchema: {
          type: "object",
          properties: {
            subscriber_id: {
              type: "string",
              description: "ID of the subscriber to delete",
            },
            show_id: {
              type: "string",
              description:
                "ID of the show (use with email instead of subscriber_id)",
            },
            email: {
              type: "string",
              description:
                "Email of the subscriber to delete (use with show_id instead of subscriber_id)",
            },
          },
        },
      },
    ];
  }

  async handleToolCall(name: string, args: unknown) {
    if (!this.hasCredentials) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        "TRANSISTOR_API_KEY environment variable is required. " +
          "Get your API key at https://dashboard.transistor.fm/account, set it, and restart the server."
      );
    }
    try {
      switch (name) {
        case "get_authenticated_user": {
          if (!isGetAuthenticatedUserArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_authenticated_user"
            );
          }
          const data = await this.apiClient.getAuthenticatedUser();
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "authorize_upload": {
          if (!isAuthorizeUploadArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for authorize_upload"
            );
          }
          const data = await this.apiClient.authorizeUpload(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "list_shows": {
          if (!isListShowsArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for list_shows"
            );
          }
          const data = await this.apiClient.listShows(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "list_episodes": {
          if (!isListEpisodesArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for list_episodes"
            );
          }
          const data = await this.apiClient.listEpisodes(args);
          const trimmed = trimEpisodeResponse(data);
          return {
            content: [
              { type: "text", text: JSON.stringify(trimmed, null, 2) },
            ],
          };
        }

        case "create_episode": {
          if (!isCreateEpisodeArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for create_episode"
            );
          }
          const data = await this.apiClient.createEpisode(args);
          const trimmed = trimEpisodeResponse(data);
          return {
            content: [
              { type: "text", text: JSON.stringify(trimmed, null, 2) },
            ],
          };
        }

        case "update_episode": {
          if (!isUpdateEpisodeArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for update_episode"
            );
          }
          const data = await this.apiClient.updateEpisode(args);
          const trimmed = trimEpisodeResponse(data);
          return {
            content: [
              { type: "text", text: JSON.stringify(trimmed, null, 2) },
            ],
          };
        }

        case "get_analytics": {
          if (!isGetAnalyticsArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_analytics"
            );
          }
          const data = await this.apiClient.getAnalytics(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "get_episode": {
          if (!isGetEpisodeArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_episode"
            );
          }
          const data = await this.apiClient.getEpisode(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "get_all_episode_analytics": {
          if (!isGetAllEpisodeAnalyticsArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_all_episode_analytics"
            );
          }
          const data = await this.apiClient.getAllEpisodeAnalytics(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "list_webhooks": {
          if (!isListWebhooksArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for list_webhooks"
            );
          }
          const data = await this.apiClient.listWebhooks(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "subscribe_webhook": {
          if (!isSubscribeWebhookArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for subscribe_webhook"
            );
          }
          const data = await this.apiClient.subscribeWebhook(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "unsubscribe_webhook": {
          if (!isUnsubscribeWebhookArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for unsubscribe_webhook"
            );
          }
          const data = await this.apiClient.unsubscribeWebhook(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "get_download_summary": {
          if (!isGetDownloadSummaryArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_download_summary"
            );
          }
          const summary = await this.computeDownloadSummary(
            args as GetDownloadSummaryArgs
          );
          return {
            content: [
              { type: "text", text: JSON.stringify(summary, null, 2) },
            ],
          };
        }

        case "compare_episodes": {
          if (!isCompareEpisodesArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for compare_episodes (need at least 2 episode_ids)"
            );
          }
          const comparison = await this.computeEpisodeComparison(
            args as CompareEpisodesArgs
          );
          return {
            content: [
              { type: "text", text: JSON.stringify(comparison, null, 2) },
            ],
          };
        }

        case "publish_episode": {
          if (!isPublishEpisodeArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for publish_episode"
            );
          }
          const data = await this.apiClient.publishEpisode(args);
          const trimmed = trimEpisodeResponse(data);
          return {
            content: [
              { type: "text", text: JSON.stringify(trimmed, null, 2) },
            ],
          };
        }

        case "get_show": {
          if (!isGetShowArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_show"
            );
          }
          const data = await this.apiClient.getShow(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "update_show": {
          if (!isUpdateShowArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for update_show"
            );
          }
          const data = await this.apiClient.updateShow(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "list_subscribers": {
          if (!isListSubscribersArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for list_subscribers"
            );
          }
          const data = await this.apiClient.listSubscribers(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "get_subscriber": {
          if (!isGetSubscriberArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for get_subscriber"
            );
          }
          const data = await this.apiClient.getSubscriber(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "create_subscriber": {
          if (!isCreateSubscriberArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for create_subscriber"
            );
          }
          const data = await this.apiClient.createSubscriber(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "create_subscribers_batch": {
          if (!isCreateSubscribersBatchArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for create_subscribers_batch"
            );
          }
          const data = await this.apiClient.createSubscribersBatch(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "update_subscriber": {
          if (!isUpdateSubscriberArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for update_subscriber"
            );
          }
          const data = await this.apiClient.updateSubscriber(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        case "delete_subscriber": {
          if (!isDeleteSubscriberArgs(args)) {
            throw new McpError(
              ErrorCode.InvalidParams,
              "Invalid arguments for delete_subscriber: provide subscriber_id or (show_id + email)"
            );
          }
          const data = await this.apiClient.deleteSubscriber(args);
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `Transistor API error: ${
                error.response?.data?.message ?? error.message
              }`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }

  /**
   * Extract per-day download entries from a Transistor analytics response.
   * The API returns { data: { attributes: { downloads: [ { date, downloads } ] } } }
   */
  private extractDownloads(
    analyticsData: any
  ): { date: string; downloads: number }[] {
    const downloads =
      analyticsData?.data?.attributes?.downloads ??
      analyticsData?.data?.attributes?.episodes;
    if (!Array.isArray(downloads)) return [];
    return downloads.map((d: any) => ({
      date: typeof d.date === "string" ? toIsoDate(d.date) : d.date,
      downloads: Number(d.downloads ?? 0),
    }));
  }

  /**
   * Compute summary stats from a list of daily download entries.
   */
  private summarizeDownloads(days: { date: string; downloads: number }[]) {
    if (days.length === 0) {
      return {
        total_downloads: 0,
        daily_average: 0,
        days_in_range: 0,
        best_day: null,
        worst_day: null,
        week_over_week_trend: null,
      };
    }

    const total = days.reduce((sum, d) => sum + d.downloads, 0);
    const avg = total / days.length;

    const sorted = [...days].sort((a, b) => b.downloads - a.downloads);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    // Week-over-week: compare last 7 days vs previous 7 days
    let weekOverWeekTrend: {
      current_week: number;
      previous_week: number;
      change_pct: number;
    } | null = null;

    if (days.length >= 14) {
      // Sort chronologically before slicing — the API does not guarantee
      // ordering, and ISO yyyy-mm-dd strings sort lexicographically by date.
      const byDate = [...days].sort((a, b) => a.date.localeCompare(b.date));
      const lastWeek = byDate.slice(-7);
      const prevWeek = byDate.slice(-14, -7);
      const lastTotal = lastWeek.reduce((s, d) => s + d.downloads, 0);
      const prevTotal = prevWeek.reduce((s, d) => s + d.downloads, 0);
      const changePct =
        prevTotal === 0 ? 0 : ((lastTotal - prevTotal) / prevTotal) * 100;
      weekOverWeekTrend = {
        current_week: lastTotal,
        previous_week: prevTotal,
        change_pct: Math.round(changePct * 10) / 10,
      };
    }

    return {
      total_downloads: total,
      daily_average: Math.round(avg * 10) / 10,
      days_in_range: days.length,
      best_day: { date: best.date, downloads: best.downloads },
      worst_day: { date: worst.date, downloads: worst.downloads },
      week_over_week_trend: weekOverWeekTrend,
    };
  }

  private async computeDownloadSummary(args: GetDownloadSummaryArgs) {
    const analyticsData = await this.apiClient.getAnalytics({
      show_id: args.show_id,
      episode_id: args.episode_id,
      start_date: args.start_date,
      end_date: args.end_date,
    });

    const days = this.extractDownloads(analyticsData);
    return this.summarizeDownloads(days);
  }

  private async computeEpisodeComparison(args: CompareEpisodesArgs) {
    const results = await Promise.all(
      args.episode_ids.map(async (episode_id) => {
        // Fetch analytics and episode metadata in parallel. Capture failures
        // per-episode so one bad episode does not abort the whole comparison,
        // but surface the error instead of silently reporting zero downloads.
        const [analyticsData, episodeData] = await Promise.all([
          this.apiClient
            .getAnalytics({
              show_id: "_", // show_id is ignored when episode_id is provided
              episode_id,
              start_date: args.start_date,
              end_date: args.end_date,
            })
            .catch((e: unknown) => ({ __error: errorMessage(e) })),
          this.apiClient
            .getEpisode({ episode_id })
            .catch(() => null),
        ]);

        const analyticsError =
          analyticsData && typeof analyticsData === "object" && "__error" in analyticsData
            ? (analyticsData as { __error: string }).__error
            : null;
        const days = analyticsError
          ? []
          : this.extractDownloads(analyticsData);
        const total = days.reduce((s, d) => s + d.downloads, 0);
        const avg = days.length > 0 ? total / days.length : 0;
        const sorted = [...days].sort((a, b) => b.downloads - a.downloads);
        const peak = sorted.length > 0 ? sorted[0] : null;

        // Compute days since publish
        const publishedAt =
          episodeData?.data?.attributes?.published_at ?? null;
        let daysSincePublish: number | null = null;
        if (publishedAt) {
          const pubDate = new Date(publishedAt);
          const now = new Date();
          daysSincePublish = Math.floor(
            (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }

        const title =
          episodeData?.data?.attributes?.title ?? `Episode ${episode_id}`;

        return {
          episode_id,
          title,
          total_downloads: total,
          daily_average: Math.round(avg * 10) / 10,
          peak_day: peak
            ? { date: peak.date, downloads: peak.downloads }
            : null,
          days_in_range: days.length,
          days_since_publish: daysSincePublish,
          ...(analyticsError ? { error: analyticsError } : {}),
        };
      })
    );

    // Sort by total downloads descending
    results.sort((a, b) => b.total_downloads - a.total_downloads);

    return { episodes: results };
  }
}
