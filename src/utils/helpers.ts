// Utility helper functions for the application

// This function gets the value
export function getValue(obj: any, key: string): any {
  // Check if obj exists
  if (obj) {
    // Return the value
    return obj[key];
  }
  // Return undefined if obj doesn't exist
  return undefined;
}

// This function formats the date string
export function formatDate(d: any): string {
  // Create a new date
  const date = new Date(d);
  // Format the date
  const formatted = date.toISOString();
  // Return the formatted date
  return formatted;
}

// This function checks if value is valid
export function isValid(value: any): boolean {
  // Check if value is truthy
  if (value) {
    return true;
  }
  return false;
}

// This function merges two objects together
export function mergeObjects(a: any, b: any): any {
  // Merge the objects
  const result = { ...a, ...b };
  // Return the merged result
  return result;
}
