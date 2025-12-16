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

/**
 * Formats a date string or Date object to a readable format (e.g., "Jan 2024")
 * @param date - Date string or Date object
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A';
    
    try {
        let dateObj: Date;
        if (typeof date === 'string') {
            if (!date.trim()) return 'N/A';
            dateObj = new Date(date);
        } else {
            dateObj = date;
        }
        
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return typeof date === 'string' ? date : 'N/A'; // Return the original string if invalid
        }
        
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(dateObj);
    } catch (error) {
        // If formatting fails, return the original value or N/A
        return typeof date === 'string' ? date : 'N/A';
    }
};





