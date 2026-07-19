import React from "react";
import { DocumentTable } from "./DocumentTable";

export interface PageLimitConfig {
  firstPage: number;
  middle: number;
  lastPage: number;
}

// A4 Portrait standard limits
export const DEFAULT_LIMITS: PageLimitConfig = {
  firstPage: 12,
  middle: 18,
  lastPage: 8,
};

// A4 Landscape standard limits (less height, more width)
export const LANDSCAPE_LIMITS: PageLimitConfig = {
  firstPage: 6,
  middle: 9,
  lastPage: 4,
};

/**
 * Splits data array into pages based on limits, avoiding orphaned signature blocks on the last page.
 */
export function paginateData<T>(
  data: T[],
  limits: PageLimitConfig
): T[][] {
  if (data.length === 0) return [[]];

  // If everything fits on a single page (including the signature block)
  if (data.length <= limits.lastPage) {
    return [data];
  }

  const pages: T[][] = [];
  let currentIndex = 0;

  // 1. First Page
  let firstPageSize = Math.min(data.length, limits.firstPage);
  
  // If the total items don't fit on a single page with the signature block, 
  // but the first page takes all of them, we must leave some items for the next page.
  if (data.length > limits.lastPage && firstPageSize === data.length) {
    const leaveForNext = Math.min(3, limits.lastPage);
    firstPageSize = Math.max(1, data.length - leaveForNext);
  }
  
  pages.push(data.slice(0, firstPageSize));
  currentIndex += firstPageSize;

  // 2. Middle & Last Pages
  while (currentIndex < data.length) {
    const remainingCount = data.length - currentIndex;

    // If remaining items fit in the last page limit, put them all in the last page
    if (remainingCount <= limits.lastPage) {
      pages.push(data.slice(currentIndex));
      break;
    }

    // If remaining items are less than or equal to a middle page size, but greater than last page size,
    // we must split them so that the last page gets some rows alongside the signature block.
    if (remainingCount <= limits.middle) {
      // Split remaining: leave lastPage size (or remaining / 2) for the final page
      const lastPageCount = Math.min(Math.ceil(remainingCount / 2), limits.lastPage);
      const middlePageCount = remainingCount - lastPageCount;
      
      pages.push(data.slice(currentIndex, currentIndex + middlePageCount));
      pages.push(data.slice(currentIndex + middlePageCount));
      break;
    }

    // Standard middle page chunk
    pages.push(data.slice(currentIndex, currentIndex + limits.middle));
    currentIndex += limits.middle;
  }

  return pages;
}
