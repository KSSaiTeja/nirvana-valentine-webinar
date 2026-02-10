# Testing this project with TestSprite (local MCP)

Use this guide when running TestSprite MCP from Cursor against the Nirvana Valentine Webinar app.

## 1. Ensure TestSprite MCP is installed and connected

- **Cursor:** Settings → **Tools & Integration** → Add custom MCP (or use the [one-click install](https://docs.testsprite.com/mcp/getting-started/installation)).
- Config (replace `your-api-key` with your [TestSprite API key](https://www.testsprite.com/dashboard)):

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": ["@testsprite/testsprite-mcp@latest"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

- **Cursor sandbox:** If tests don’t run, set **Cursor → Settings → Chat → Auto-Run → Auto-Run Mode** to **“Ask Every time”** or **“Run Everything”** so TestSprite can run fully ([docs](https://docs.testsprite.com/mcp/getting-started/installation#cursor-sandbox-mode-configuration)).

## 2. Start the app locally

From the project root:

```bash
npm run dev
```

App should be at **http://localhost:3000**.

## 3. Run the test from chat

In Cursor chat (with this project open and TestSprite MCP connected), use the magic prompt:

```text
Help me test this project with TestSprite.
```

Or:

```text
Can you test this project with TestSprite?
```

If the AI has access to TestSprite MCP tools, it will drive the rest of the flow.

## 4. Complete the TestSprite configuration in the browser

When the **Testing Configuration** page opens:

| Field | Suggested value |
|-------|------------------|
| **Testing type** | **Frontend** (UI and user flows). |
| **Scope** | **Codebase** (full project) or **Code Diff** (only recent changes). |
| **Application URL** | `http://localhost:3000` |
| **Test account** | Leave empty (no login for this landing page). |
| **PRD** | Upload `testsprite-prd.md` from this repo (or paste its contents). Even a draft is fine; TestSprite will normalize it. |

Save/continue so TestSprite can generate the test plan and run tests.

## 5. After the run

- Reports and artifacts usually appear under `testsprite_tests/` (or the path TestSprite reports).
- To ask the AI to fix issues: *“Please fix the codebase based on TestSprite testing results.”*

## 6. Test plan (no MCP)

If TestSprite MCP is not connected, a manual test plan derived from the PRD is in **`testsprite_tests/test-plan.md`**. You can run those steps in a browser or hand them to QA. Once TestSprite MCP is added, use the prompts above so the AI can drive TestSprite for you.

## References

- [TestSprite MCP – First test](https://docs.testsprite.com/mcp/getting-started/first-test)
- [TestSprite MCP – Installation](https://docs.testsprite.com/mcp/getting-started/installation)
