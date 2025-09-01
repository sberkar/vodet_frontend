# VoDet Frontend

A modern web interface for VoIP traffic classification and analysis.

## Features
- Upload network metadata files (`.pcap`, `.pcapng`, `.log`, `.arff`)
- Track job status and classification progress
- Assign custom identifiers to jobs
- View paginated, color-coded results with intuitive tables
- Responsive, modern UI with contrasty colors and smooth interactions

## Technologies Used
- React (Next.js)
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env.local` file in the root directory and set your API host:
```
NEXT_PUBLIC_API_HOST=http://localhost:5000
```
Or use your deployed backend URL.

### Running the App
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## Usage
1. Upload a supported network file.
2. Assign an identifier (optional).
3. Track processing and classification status.
4. View results and download as needed.

## API Endpoints
See your backend API documentation for details. Main endpoints used:
- `POST /upload` — Upload file
- `GET /job_status/<jobid>` — Get job status
- `POST /classify/<jobid>` — Start classification
- `GET /results/<jobid>` — Get results (supports pagination)

## Customization
- Edit colors, fonts, and layout in Tailwind config and component files.
- Update API host in `.env.local` as needed.

## License
MIT

---

For questions or contributions, open an issue or pull request.
