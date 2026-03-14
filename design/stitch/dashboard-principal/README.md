## Stitch Assets — Dashboard Principal

This folder is reserved for assets exported from Google Stitch for the **Dashboard Principal** screen of the EduInsights app.

When you have access to Stitch, follow these steps to populate it:

1. Open the Stitch project with ID `4716620872316177824`.
2. Select the screen **"Dashboard Principal"** with ID `207de7aee3334b58b544d87650f2f623`.
3. From the Stitch UI or MCP tools, locate the hosted download URLs for:
   - The screen screenshot (`screenshot.downloadUrl`)
   - The generated HTML/CSS code (`htmlCode.downloadUrl`)
4. Use `curl -L` to download the assets into this folder, for example:

```bash
# Replace the placeholder URLs with the real ones from Stitch
curl -L "https://stitch.example.com/path/to/screenshot.png" -o design/stitch/dashboard-principal/dashboard-principal.png

curl -L "https://stitch.example.com/path/to/dashboard.html" -o design/stitch/dashboard-principal/dashboard-principal.html
```

These files are used as design reference only. The React implementation in `frontend` should follow the PRD (`PRD.md`) and the Stitch/Figma visual design, not import this HTML directly.

