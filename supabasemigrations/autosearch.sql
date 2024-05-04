CREATE TABLE "SearchQuery" (
    "id" TEXT PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "userId" TEXT,
    "result" TEXT NOT NULL
);

CREATE TABLE "Subtask" (
    "id" TEXT PRIMARY KEY,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "searchQueryId" TEXT NOT NULL,
    FOREIGN KEY ("searchQueryId") REFERENCES "SearchQuery"("id")
);

CREATE TABLE "SearchResult" (
    "id" TEXT PRIMARY KEY,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "numberOfUpdates" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "searchQueryId" TEXT NOT NULL,
    FOREIGN KEY ("searchQueryId") REFERENCES "SearchQuery"("id")
);