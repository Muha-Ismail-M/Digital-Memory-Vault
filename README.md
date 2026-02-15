# Digital Memory Vault

Digital Memory Vault is a clean, media-friendly personal archive that helps you **save, tag, and revisit memories** (photos, videos, audio, and text notes) in a timeline view. It’s built as a simple “capture → organize → rediscover” experience, with features like search, tags, a dedicated memory viewer, and an **“On This Day”** resurfacing section.

> Think of it as a lightweight, modern “private archive” UI backed by Supabase (database + file storage).

---

## What you can do

### Capture memories (files + notes)
- Create memories from:
  - **Images**
  - **Videos**
  - **Audio**
  - **Text-only notes**
- Add optional metadata while saving:
  - Title
  - Description
  - Tags
- Drag-and-drop upload experience with clear progress + success/error feedback

### Browse in a timeline
- Memories are shown in a **timeline grouped by day** (newest first).
- Date headers display in a human-friendly way (e.g., *Today*, *Yesterday*, or full date).

### Rediscover with “On This Day”
- If you have memories from past years on the same calendar date, the app highlights them at the top when you’re not searching.

### Search and filter
- Search matches memory titles and descriptions.
- Tag filtering is supported at the data layer (and is ready to be wired into a UI control).

### View details
- A dedicated memory viewer shows:
  - The media (image/video/audio) or text content
  - Date/time created
  - File name + download (when applicable)
  - Description and tags
  - Optional metadata such as dimensions/location/date taken (if present)

### Light/Dark theme
- Theme toggling is supported and persisted in local storage.
- The app also respects the user’s system preference on first load.

---

## How it works (high-level)

Digital Memory Vault is a Vite + React + TypeScript frontend backed by Supabase:

- **Supabase Database** stores memory records (title, content, tags, timestamps, metadata, and file info).
- **Supabase Storage** stores uploaded files (images/videos/audio) and returns a public URL that the UI can display.
- The app fetches memories in reverse chronological order and groups them by date for the timeline layout.
- Search and tag filtering are applied in the query layer so the UI stays fast and simple.

---

## Data model (conceptual)

Each **Memory** record is designed to support both “note-style” and “media-style” entries:

- Identity and timestamps:
  - `id`
  - `created_at`, `updated_at`
- Content:
  - `title` (optional)
  - `content` (optional)
- File attachment (optional):
  - `file_url`
  - `file_type` (image / video / audio / text)
  - `file_name`, `file_size`
- Organization:
  - `tags` (array of strings)
- Optional metadata:
  - location, date_taken, dimensions, etc.

---

## Supabase requirements (important)

This project expects Supabase credentials via environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

It also expects:
- A Supabase **table** named `memories` (used for CRUD operations)
- A Supabase **storage bucket** named `memories` (used for file uploads)

---

## Privacy & security notes

Digital Memory Vault is built to feel “private,” but privacy depends on your Supabase configuration:

- The current upload flow uses a **public URL** approach for stored files.
- The app does not include end-user authentication in the UI yet.

If you want this to be truly private/multi-user:
- Add Supabase Auth (sign-in) and associate each memory with a user.
- Enable Row Level Security (RLS) on the `memories` table.
- Make the storage bucket private and serve files via signed URLs.
- (Optional) Add client-side encryption before upload if you want “zero-knowledge” storage behavior.

---

## Tech stack

- React + TypeScript (frontend)
- Vite (build tooling)
- Tailwind CSS (styling)
- Supabase (database + file storage)
- date-fns (date formatting + grouping)
- react-dropzone (drag-and-drop uploads)
- react-hot-toast (user feedback)
- lucide-react (icons)

---

## Project structure (where to look)

- `src/App.tsx`  
  Main app layout, theme handling, “On This Day,” modal orchestration, and timeline rendering.

- `src/hooks/useMemories.ts`  
  Data layer for fetching/creating/updating/deleting memories, plus helper functions like “On This Day” and tags aggregation.

- `src/hooks/useFileUpload.ts`  
  Handles file uploads to Supabase Storage and returns public URLs for saved media.

- `src/lib/supabase.ts`  
  Supabase client initialization + the `Memory` TypeScript type.

- `src/components/`  
  UI components like Navbar, Timeline grouping, Memory cards, upload modal, and memory viewer.

---

## Roadmap ideas (high-impact)

- Add authentication (so the vault becomes truly personal per-user)
- Add a settings page (the UI already has an entry point)
- Add tag filter UI and saved views (e.g., “Family”, “Travel”, “School”)
- Add “favorite” memories and pinned moments
- Add full-text search and richer metadata extraction (EXIF for photos, duration for audio/video)
- Add pagination / infinite scroll for large archives

---

## License

No license file is included yet. If you plan to share or accept contributions, add a license (MIT / Apache-2.0) to make reuse terms explicit.
