# PreMID Activity Forwarding setup

This website now supports displaying Discord activity status via PreMID on the `/now` page.

## How it works

PreMID is a browser extension that displays what you're doing on various websites in your Discord Rich Presence. This implementation uses PreMID's Activity Forwarding feature to send your Discord activity to this website in real-time.

## Setup instructions

### 1. Install PreMID

Install the [PreMID Extension](https://premid.app/downloads) for your browser

### 2. Enable Activity Forwarding

1. Click on the PreMID extension icon in your browser
2. Go to Settings
3. Toggle on "Activity Forwarding"
4. Enter your website's activity endpoint URL:
   - For local development: `http://localhost:[port]/api/premid`
   - For production: `https://jarema.me/api/premid`

### 3. Verify it's working

1. Visit the `/now` page on your website
2. Start using a service that has a PreMID presence (e.g., YouTube, Spotify, etc.)
3. Your activity should appear in the "PreMID" section within 10 seconds

## API endpoint

The activity forwarding endpoint is located at `/api/premid` and accepts:

- `POST` requests to receive activity data from PreMID
- `GET` requests to retrieve the current activity (used by the frontend)

### Activity data format

When active, PreMID sends activity data including:
- Service name (e.g., "YouTube", "Spotify")
- Details (first line of activity)
- State (second line of activity)
- Timestamps (start/end times)
- Assets (images)
- Buttons (clickable links)

### Activity timeout

If no activity updates are received for 20 minutes (e.g., when you close your browser), the activity is automatically cleared.

## Features

- **Live updates**: Activity is polled every 10 seconds for near real-time updates
- **Rich display**: Shows service images, details, timestamps, and clickable buttons
- **Fallback content**: Shows a fallback message when no activity is available
- **Multilingual**: Fully integrated with the site's i18n system

## Development

The implementation consists of:
- `/pages/api/premid.ts` - API endpoint for receiving and serving activity data
- `/app/now/NowClient.tsx` - Frontend component with PreMID display logic
- `/content/now-items.ts` - Category definition for PreMID section
- Translation files - Multilingual support for the PreMID category

## Troubleshooting

**Activity not showing up?**
- Check that Activity Forwarding is enabled in PreMID settings
- Verify the endpoint URL is correct
- Check browser console for errors
- Make sure you're using a service with PreMID support

**Activity shows as cleared immediately?**
- The 20-minute timeout might have triggered
- Try refreshing your activity by changing what you're doing

**CORS errors?**
- The API endpoint includes CORS headers to allow PreMID to send data
- Check that your domain is accessible from the browser where PreMID is running

## Privacy note

Activity data is stored in server memory only and is not persisted to any database. The data is cleared when:
- You explicitly clear your activity in PreMID
- No updates are received for 20 minutes
- The server restarts
