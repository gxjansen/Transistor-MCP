# Transistor MCP Server

This MCP server provides tools to interact with the Transistor.fm API, allowing you to manage podcasts, episodes, and view analytics.

## Configuration

Add the server to your MCP settings configuration file with your Transistor API key:

```json
{
  "mcpServers": {
    "transistor": {
      "command": "node",
      "args": ["path/to/transistor-server/build/index.js"],
      "env": {
        "TRANSISTOR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### list_shows
List all shows in your Transistor.fm account.

```json
{
  "page": number  // Optional, defaults to 1
}
```

### list_episodes
List episodes for a specific show.

```json
{
  "show_id": string,  // Required
  "page": number,     // Optional, defaults to 1
  "status": string    // Optional: "published", "draft", or "scheduled"
}
```

### get_episode
Get detailed information about a specific episode.

```json
{
  "episode_id": string,           // Required
  "include": string[],           // Optional: array of related resources to include
  "fields": {                    // Optional: sparse fieldsets
    "episode": string[],         // Fields to include for episode
    "show": string[]            // Fields to include for show
  }
}
```

### get_analytics
Get analytics for a show or specific episode.

```json
{
  "show_id": string,            // Required
  "episode_id": string,         // Optional: include for episode-specific analytics
  "start_date": string,         // Required: format "dd-mm-yyyy"
  "end_date": string           // Required: format "dd-mm-yyyy"
}
```

### create_episode
Create a new episode.

```json
{
  "show_id": string,           // Required
  "title": string,             // Required
  "audio_url": string,         // Required
  "summary": string,           // Optional
  "description": string,       // Optional
  "status": string,           // Optional: "published", "draft", or "scheduled"
  "season_number": number,     // Optional
  "episode_number": number     // Optional
}
```

### update_episode
Update an existing episode.

```json
{
  "episode_id": string,        // Required
  "title": string,            // Optional
  "summary": string,          // Optional
  "description": string,      // Optional
  "status": string,          // Optional: "published", "draft", or "scheduled"
  "season_number": number,    // Optional
  "episode_number": number    // Optional
}
```

### get_all_episode_analytics
Get analytics for all episodes of a show.

```json
{
  "show_id": string,            // Required
  "start_date": string,         // Required: format "dd-mm-yyyy"
  "end_date": string           // Required: format "dd-mm-yyyy"
}
```

### list_webhooks
List all webhooks for a show.

```json
{
  "show_id": string            // Required
}
```

### subscribe_webhook
Subscribe to a webhook for a show.

```json
{
  "event_name": string,        // Required: e.g., "episode_created"
  "show_id": string,          // Required
  "url": string              // Required: URL to receive webhook events
}
```

### unsubscribe_webhook
Unsubscribe from a webhook.

```json
{
  "webhook_id": string        // Required
}
```

## Important Notes

- Dates must be in "dd-mm-yyyy" format
- Page numbers start at 1
- Include arrays use the format `["resource_name"]`
- Fields objects specify which fields to return for each resource type
- All tools return data in JSONAPI format with proper relationships and metadata

## Example Usage

List shows:
```typescript
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "list_shows",
  arguments: {
    page: 1
  }
});
```

Get episode details:
```typescript
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_episode",
  arguments: {
    episode_id: "123456",
    include: ["show"],
    fields: {
      episode: ["title", "summary", "description"],
      show: ["title"]
    }
  }
});
```

Get show analytics:
```typescript
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_analytics",
  arguments: {
    show_id: "123456",
    start_date: "01-01-2024",
    end_date: "31-01-2024"
  }
});
```

Update episode:
```typescript
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "update_episode",
  arguments: {
    episode_id: "123456",
    title: "Updated Episode Title",
    summary: "New episode summary",
    description: "New detailed description",
    season_number: 2,
    episode_number: 5
  }
});
```

Get all episode analytics:
```typescript
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_all_episode_analytics",
  arguments: {
    show_id: "123456",
    start_date: "01-01-2024",
    end_date: "31-01-2024"
  }
});
```

Manage webhooks:
```typescript
// List webhooks
const webhooks = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "list_webhooks",
  arguments: {
    show_id: "123456"
  }
});

// Subscribe to webhook
const subscription = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "subscribe_webhook",
  arguments: {
    event_name: "episode_created",
    show_id: "123456",
    url: "https://your-webhook-endpoint.com/hook"
  }
});

// Unsubscribe from webhook
const unsubscribe = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "unsubscribe_webhook",
  arguments: {
    webhook_id: "webhook123"
  }
});
```

## Development Notes

The server has been thoroughly tested with the following improvements:
- Fixed pagination format to use `pagination[page]` instead of `page` for proper JSONAPI compliance
- Corrected analytics endpoint URL from `/v1/analytics/shows/{id}` to `/v1/analytics/{id}`
- Verified proper handling of sparse fieldsets and included resources
- Confirmed working analytics for both shows and individual episodes
