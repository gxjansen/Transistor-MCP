import axios, { AxiosInstance } from "axios";
import {
  AuthorizeUploadArgs,
  CreateEpisodeArgs,
  GetAnalyticsArgs,
  GetEpisodeArgs,
  ListEpisodesArgs,
  ListShowsArgs,
  UpdateEpisodeArgs,
  GetAllEpisodeAnalyticsArgs,
  ListWebhooksArgs,
  SubscribeWebhookArgs,
  UnsubscribeWebhookArgs,
  PublishEpisodeArgs,
  GetShowArgs,
  UpdateShowArgs,
  ListSubscribersArgs,
  GetSubscriberArgs,
  CreateSubscriberArgs,
  CreateSubscribersBatchArgs,
  UpdateSubscriberArgs,
  DeleteSubscriberArgs,
} from "./types.js";
import { toTransistorDate } from "./date-utils.js";

export class TransistorApiClient {
  private api: AxiosInstance;

  constructor(apiKey: string) {
    this.api = axios.create({
      baseURL: "https://api.transistor.fm",
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
    });
  }

  async getAuthenticatedUser() {
    const response = await this.api.get("/v1");
    return response.data;
  }

  async authorizeUpload(args: AuthorizeUploadArgs) {
    const response = await this.api.get("/v1/episodes/authorize_upload", {
      params: { filename: args.filename },
    });
    return response.data;
  }

  async listShows(args: ListShowsArgs) {
    const { page = 1, per = 10, query } = args;
    const params: Record<string, string | number | boolean> = {
      "pagination[page]": page,
      "pagination[per]": per,
    };
    if (query) params.query = query;
    if (args.private !== undefined) params.private = args.private;
    const response = await this.api.get("/v1/shows", { params });
    return response.data;
  }

  async listEpisodes(args: ListEpisodesArgs) {
    const { show_id, page = 1, per = 10, query, status, order, fields } = args;
    const params: Record<string, string | number | string[]> = {
      show_id,
      "pagination[page]": page,
      "pagination[per]": per,
    };
    if (status) params.status = status;
    if (query) params.query = query;
    if (order) params.order = order;
    if (fields) {
      for (const [resource, fieldList] of Object.entries(fields)) {
        params[`fields[${resource}]`] = fieldList.join(",");
      }
    }
    const response = await this.api.get("/v1/episodes", { params });
    return response.data;
  }

  async createEpisode(args: CreateEpisodeArgs) {
    const { show_id, ...episodeData } = args;
    const response = await this.api.post("/v1/episodes", {
      episode: { show_id, ...episodeData },
    });
    return response.data;
  }

  async updateEpisode(args: UpdateEpisodeArgs) {
    const { episode_id, ...updateData } = args;
    const response = await this.api.patch(`/v1/episodes/${episode_id}`, {
      episode: updateData,
    });
    return response.data;
  }

  async getAnalytics(args: GetAnalyticsArgs) {
    const { show_id, episode_id, start_date, end_date } = args;
    const endpoint = episode_id
      ? `/v1/analytics/episodes/${episode_id}`
      : `/v1/analytics/${show_id}`;
    const params: Record<string, string> = {};
    const convertedStart = toTransistorDate(start_date);
    const convertedEnd = toTransistorDate(end_date);
    if (convertedStart) params.start_date = convertedStart;
    if (convertedEnd) params.end_date = convertedEnd;
    const response = await this.api.get(endpoint, { params });
    return response.data;
  }

  async getAllEpisodeAnalytics(args: GetAllEpisodeAnalyticsArgs) {
    const { show_id, start_date, end_date } = args;
    const params: Record<string, string> = {};
    const convertedStart = toTransistorDate(start_date);
    const convertedEnd = toTransistorDate(end_date);
    if (convertedStart) params.start_date = convertedStart;
    if (convertedEnd) params.end_date = convertedEnd;
    const response = await this.api.get(`/v1/analytics/${show_id}/episodes`, {
      params,
    });
    return response.data;
  }

  async listWebhooks(args: ListWebhooksArgs) {
    const { show_id } = args;
    const response = await this.api.get("/v1/webhooks", {
      params: { show_id },
    });
    return response.data;
  }

  async subscribeWebhook(args: SubscribeWebhookArgs) {
    const response = await this.api.post("/v1/webhooks", args);
    return response.data;
  }

  async unsubscribeWebhook(args: UnsubscribeWebhookArgs) {
    const { webhook_id } = args;
    const response = await this.api.delete(`/v1/webhooks/${webhook_id}`);
    return response.data;
  }

  async getEpisode(args: GetEpisodeArgs) {
    const { episode_id, include, fields } = args;
    const params: { [key: string]: string | string[] } = {};
    if (include) {
      params["include[]"] = include;
    }
    if (fields) {
      for (const [resource, fieldList] of Object.entries(fields)) {
        params[`fields[${resource}][]`] = fieldList;
      }
    }
    const response = await this.api.get(`/v1/episodes/${episode_id}`, {
      params,
    });
    return response.data;
  }

  async publishEpisode(args: PublishEpisodeArgs) {
    const { episode_id, status, published_at } = args;
    const episode: Record<string, string> = { status };
    if (published_at) episode.published_at = published_at;
    const response = await this.api.patch(
      `/v1/episodes/${episode_id}/publish`,
      { episode }
    );
    return response.data;
  }

  async getShow(args: GetShowArgs) {
    const response = await this.api.get(`/v1/shows/${args.show_id}`);
    return response.data;
  }

  async updateShow(args: UpdateShowArgs) {
    const { show_id, ...showData } = args;
    const response = await this.api.patch(`/v1/shows/${show_id}`, {
      show: showData,
    });
    return response.data;
  }

  async listSubscribers(args: ListSubscribersArgs) {
    const { show_id, page = 1, per = 10, query } = args;
    const params: Record<string, string | number> = {
      show_id,
      "pagination[page]": page,
      "pagination[per]": per,
    };
    if (query) params.query = query;
    const response = await this.api.get("/v1/subscribers", { params });
    return response.data;
  }

  async getSubscriber(args: GetSubscriberArgs) {
    const response = await this.api.get(
      `/v1/subscribers/${args.subscriber_id}`
    );
    return response.data;
  }

  async createSubscriber(args: CreateSubscriberArgs) {
    const response = await this.api.post("/v1/subscribers", args);
    return response.data;
  }

  async createSubscribersBatch(args: CreateSubscribersBatchArgs) {
    const response = await this.api.post("/v1/subscribers/batch", args);
    return response.data;
  }

  async updateSubscriber(args: UpdateSubscriberArgs) {
    const { subscriber_id, email } = args;
    const response = await this.api.patch(
      `/v1/subscribers/${subscriber_id}`,
      { subscriber: { email } }
    );
    return response.data;
  }

  async deleteSubscriber(args: DeleteSubscriberArgs) {
    if (args.subscriber_id) {
      const response = await this.api.delete(
        `/v1/subscribers/${args.subscriber_id}`
      );
      return response.data;
    }
    // Delete by show_id + email — both are required for this branch.
    if (!args.show_id || !args.email) {
      throw new Error(
        "delete_subscriber requires either subscriber_id, or both show_id and email."
      );
    }
    const response = await this.api.delete("/v1/subscribers", {
      params: { show_id: args.show_id, email: args.email },
    });
    return response.data;
  }
}
