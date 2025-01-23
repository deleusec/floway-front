// Utility functions for time conversion

/**
 * Converts total seconds to a formatted string in HH:mm:ss
 * @param {number} totalSeconds - The total seconds to convert.
 * @returns {string} The formatted time string.
 */
export function secondsToReadableTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Converts a formatted string in HH:mm:ss to total seconds.
 * @param {string} timeString - The formatted time string.
 * @returns {number} The total seconds.
 */
export function readableTimeToSeconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
}

/**
 * Converts total seconds to a compact readable format (e.g., "00sec", "00min00sec", "00hours00min00sec").
 * @param {number} totalSeconds - The total seconds to convert.
 * @returns {string} The formatted compact time string.
 */
export function secondsToCompactReadableTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString()}hours${minutes.toString().padStart(2, '0')}min${seconds.toString().padStart(2, '0')}sec`;
  } else if (minutes > 0) {
    return `${minutes.toString()}min${seconds.toString().padStart(2, '0')}sec`;
  } else {
    return `${seconds.toString()}sec`;
  }
}

/**
 * Converts total seconds to an object with hours, minutes, and seconds.
 * @param {number} totalSeconds - The total seconds to convert.
 * @returns {Object} An object with hours, minutes, and seconds.
 */
export function secondsToTimeObject(totalSeconds: number) {
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * Converts an object with hours, minutes, and seconds to total seconds.
 * @param {Object} timeObject - The time object.
 * @param {number} timeObject.hours - The hours.
 * @param {number} timeObject.minutes - The minutes.
 * @param {number} timeObject.seconds - The seconds.
 * @returns {number} The total seconds.
 */
export function timeObjectToSeconds({ hours = 0, minutes = 0, seconds = 0 }) {
  return hours * 3600 + minutes * 60 + seconds;
}
