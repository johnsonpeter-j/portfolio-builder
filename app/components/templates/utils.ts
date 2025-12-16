/**
 * Calculates responsive grid columns based on both screen size and data count
 * @param count - Number of items to display
 * @param maxCols - Maximum columns for large screens (default: 3)
 * @returns Tailwind CSS grid classes
 */
export function getResponsiveGridClasses(count: number, maxCols: number = 3): string {
    if (count === 0) {
        return "grid grid-cols-1";
    }
    
    if (count === 1) {
        return "grid grid-cols-1";
    }
    
    if (count === 2) {
        return "grid grid-cols-1 sm:grid-cols-2";
    }
    
    if (count === 3) {
        if (maxCols >= 3) {
            return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
        } else {
            return "grid grid-cols-1 sm:grid-cols-2";
        }
    }
    
    // For 4+ items, use responsive columns based on maxCols
    if (maxCols === 2) {
        return "grid grid-cols-1 sm:grid-cols-2";
    } else if (maxCols === 3) {
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    } else if (maxCols === 4) {
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
    
    // Default to 3 columns max
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}





