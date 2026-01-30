# Pastebin-Lite

A small Pastebin-like service built with Node.js, Express, and MongoDB Atlas using an MVC structure.

## Features
- Create text pastes
- Shareable URLs
- Optional TTL and view limits
- HTML and JSON access

## Tech Stack
- Node.js
- Express
- MongoDB Atlas (via Mongoose)

## Running Locally

```bash
npm install
export MONGODB_URI="your_mongodb_atlas_uri"
npm start
```

## Environment Variables
- `MONGODB_URI` – MongoDB Atlas connection string
- `TEST_MODE=1` – enables deterministic time testing

## Persistence Layer
MongoDB Atlas is used to ensure data persists across requests and deployments.
