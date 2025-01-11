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
  AuthorizeUploadArgs,
} from "./types.js";
import axios from "axios";

export class ToolHandlers {
  constructor(private apiClient: TransistorApiClient) {}

  getToolDefinitions() {
    return [
      {
        name: "get_authenticated_user",
        description: "Get details of the authenticated user account",
        inputSchema: {
          type: "object",
          properties: {},  // No parameters needed
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
          },
        },
      },
      {
        name: "list_episodes",
        description: "List episodes for a specific show",
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
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "Filter episodes by status",
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
            summary: {
              type: "string",
              description: "Episode summary",
            },
            description: {
              type: "string",
              description: "Episode description (supports HTML)",
            },
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "Episode status",
            },
            season_number: {
              type: "number",
              description: "Season number",
            },
            episode_number: {
              type: "number",
              description: "Episode number",
            },
            audio_url: {
              type: "string",
              description: "URL to the episode audio file",
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
            status: {
              type: "string",
              enum: ["published", "draft", "scheduled"],
              description: "New episode status",
            },
            season_number: {
              type: "number",
              description: "New season number",
            },
            episode_number: {
              type: "number",
              description: "New episode number",
            },
          },
          required: ["episode_id"],
        },
      },
      {
        name: "get_analytics",
        description: "Get analytics for a show or episode",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to get analytics for",
            },
            episode_id: {
              type: "string",
              description: "ID of the episode to get analytics for (optional)",
            },
            start_date: {
              type: "string",
              description: "Start date in YYYY-MM-DD format",
            },
            end_date: {
              type: "string",
              description: "End date in YYYY-MM-DD format",
            },
          },
          required: ["show_id", "start_date", "end_date"],
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
        description: "Get analytics for all episodes of a show",
        inputSchema: {
          type: "object",
          properties: {
            show_id: {
              type: "string",
              description: "ID of the show to get analytics for",
            },
            start_date: {
              type: "string",
              description: "Start date in dd-mm-yyyy format",
            },
            end_date: {
              type: "string",
              description: "End date in dd-mm-yyyy format",
            },
          },
          required: ["show_id", "start_date", "end_date"],
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
    ];
  }

  async handleToolCall(name: string, args: unknown) {
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
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
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
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
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
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
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
}
