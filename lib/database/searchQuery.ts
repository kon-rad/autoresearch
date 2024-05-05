"use server"

import prisma from "@/lib/db"

export const createSearchQuery = async (data: any) => {
  return await prisma.searchQuery.create({
    data: {
      ...data,
    },
  })
}

export const updateSearchQuery = async (
  searchQueryId: string,
  newQueryText: string
) => {
  return await prisma.searchQuery.update({
    where: { id: searchQueryId },
    data: { query: newQueryText },
  })
}

export const fetchSearchQueryById = async (searchQueryId: string) => {
  return await prisma.searchQuery.findUnique({
    where: { id: searchQueryId },
  })
}
export const fetchSearchQueriesByUser = async (userId: string) => {
  return await prisma.searchQuery.findMany({
    where: { userId: userId },
  })
}

export const createSubtask = async (data: any) => {
  return await prisma.subtask.create({
    data: {
      ...data,
    },
  })
}

export const updateSubtask = async (subtaskId: string, newContent: string) => {
  return await prisma.subtask.update({
    where: { id: subtaskId },
    data: { content: newContent },
  })
}

export const fetchSubtasksBySearchQueryId = async (searchQueryId: string) => {
  return await prisma.subtask.findMany({
    where: { searchQueryId: searchQueryId },
  })
}
export const createSearchResult = async (data: any) => {
  return await prisma.searchResult.create({
    data: {
      ...data,
    },
  })
}

export const updateSearchResult = async (
  searchResultId: string,
  newContent: string
) => {
  return await prisma.searchResult.update({
    where: { id: searchResultId },
    data: { content: newContent, numberOfUpdates: { increment: 1 } },
  })
}

export const fetchSearchResultsBySearchQueryId = async (
  searchQueryId: string
) => {
  return await prisma.searchResult.findFirst({
    where: { searchQueryId: searchQueryId },
    orderBy: { createdAt: "desc" },
  })
}

export const fetchAllSearchResultsSorted = async () => {
  return await prisma.searchResult.findMany({
    orderBy: { createdAt: "desc" },
  })
}
