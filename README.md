# Transistor MCP Server

This MCP server provides tools to interact with the Transistor.fm API, allowing you to manage podcasts, episodes, and view analytics.

## Configuration

Add the server to your MCP settings configuration file with your Transistor API key:

```json
{
  "mcpServers": {
    "transistor": {
      "command": "node",
      "args": ["path/to/Transistor-MCP/build/index.js"],
      "env": {
        "TRANSISTOR_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### list_shows
List all shows in your Transistor.fm account, ordered by updated date (newest first). Returns a paginated list with 10 items per page.

```json
{
  "page": number,     // Optional, defaults to 0 (first page)
  "per": number,      // Optional, defaults to 10 items per page
  "private": boolean, // Optional: filter for private shows
  "query": string     // Optional: search query
}
```

Note: All parameters are optional. Calling this endpoint without parameters will return the first page of shows.

### list_episodes
List episodes for a specific show.

```json
{
  "show_id": string,  // Required
  "page": number,     // Optional, defaults to 0
  "per": number,      // Optional, defaults to 10
  "query": string,    // Optional: search query
  "status": string,   // Optional: "published", "draft", or "scheduled"
  "order": string     // Optional: "desc" (newest first) or "asc" (oldest first), defaults to "desc"
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
Get analytics for a show or specific episode. Defaults to the last 14 days if no dates are provided.

```json
{
  "show_id": string,            // Required
  "episode_id": string,         // Optional: include for episode-specific analytics
  "start_date": string,         // Optional: format "dd-mm-yyyy", required if end_date is provided
  "end_date": string           // Optional: format "dd-mm-yyyy", required if start_date is provided
}
```

### create_episode
Create a new episode.

```json
{
  "show_id": string,               // Required
  "title": string,                 // Required
  "audio_url": string,             // Required
  "summary": string,               // Optional
  "description": string,           // Optional: may contain HTML
  "transcript_text": string,       // Optional: full episode transcript
  "author": string,               // Optional
  "explicit": boolean,            // Optional
  "image_url": string,            // Optional: episode artwork
  "keywords": string,             // Optional: comma-separated list
  "number": number,               // Optional: episode number
  "season_number": number,        // Optional
  "type": string,                // Optional: "full", "trailer", or "bonus"
  "alternate_url": string,       // Optional: override share_url
  "video_url": string,           // Optional: YouTube URL
  "email_notifications": boolean, // Optional: override show setting
  "increment_number": boolean     // Optional: auto-set next episode number
}
```

### update_episode
Update an existing episode.

```json
{
  "episode_id": string,           // Required
  "title": string,               // Optional
  "summary": string,             // Optional
  "description": string,         // Optional: may contain HTML
  "transcript_text": string,     // Optional: full episode transcript
  "author": string,             // Optional
  "explicit": boolean,          // Optional
  "image_url": string,          // Optional: episode artwork
  "keywords": string,           // Optional: comma-separated list
  "number": number,             // Optional: episode number
  "season_number": number,      // Optional
  "type": string,              // Optional: "full", "trailer", or "bonus"
  "alternate_url": string,     // Optional: override share_url
  "video_url": string,         // Optional: YouTube URL
  "email_notifications": boolean // Optional: override show setting
}
```

### get_all_episode_analytics
Get analytics for all episodes of a show. Defaults to the last 7 days if no dates are provided.

```json
{
  "show_id": string,            // Required
  "start_date": string,         // Optional: format "dd-mm-yyyy", required if end_date is provided
  "end_date": string           // Optional: format "dd-mm-yyyy", required if start_date is provided
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

- API requests are rate-limited to 10 requests per 10 seconds
- Dates must be in "dd-mm-yyyy" format
- Page numbers start at 0
- All endpoints support:
  - Sparse fieldsets: Specify which fields to return using `fields[resource_type][]`
  - Including related resources: Use `include[]` to fetch related resources in a single request
- Include arrays use the format `["resource_name"]`
- Fields objects specify which fields to return for each resource type
- All tools return data in JSONAPI format with proper relationships and metadata

## Example Usage

List shows:
```typescript
// List first page of shows (default behavior)
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "list_shows",
  arguments: {}
});

// List shows with pagination and filtering
const resultWithParams = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "list_shows",
  arguments: {
    page: 1,
    per: 20,
    private: true,
    query: "podcast"
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
// Get analytics for the last 14 days (default behavior)
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_analytics",
  arguments: {
    show_id: "123456"
  }
});

// Get analytics for a specific date range
const resultWithDates = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_analytics",
  arguments: {
    show_id: "123456",
    start_date: "01-01-2024",
    end_date: "31-01-2024"
  }
});

// Get analytics for a specific episode
const episodeAnalytics = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_analytics",
  arguments: {
    show_id: "123456",
    episode_id: "789012",
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
// Get analytics for all episodes for the last 7 days (default behavior)
const result = await use_mcp_tool({
  server_name: "transistor",
  tool_name: "get_all_episode_analytics",
  arguments: {
    show_id: "123456"
  }
});

// Get analytics for all episodes for a specific date range
const resultWithDates = await use_mcp_tool({
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
