#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TransistorApiClient } from "./api-client.js";
import { ToolHandlers } from "./tool-handlers.js";

const API_KEY = process.env.TRANSISTOR_API_KEY;
if (!API_KEY) {
  throw new Error("TRANSISTOR_API_KEY environment variable is required");
}

class TransistorServer {
  private server: Server;
  private toolHandlers: ToolHandlers;

  constructor() {
    this.server = new Server(
      {
        name: "transistor-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const apiClient = new TransistorApiClient(API_KEY as string);
    this.toolHandlers = new ToolHandlers(apiClient);

    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolHandlers.getToolDefinitions(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      return this.toolHandlers.handleToolCall(
        request.params.name,
        request.params.arguments
      );
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Transistor MCP server running on stdio");
  }
}

const server = new TransistorServer();
server.run().catch(console.error);
