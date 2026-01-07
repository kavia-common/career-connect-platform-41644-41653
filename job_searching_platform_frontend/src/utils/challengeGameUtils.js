//
// Utility file for challenge scoring, streak, timer, and leaderboard with localStorage persistence.
//

const SCORE_KEY = 'challenge_score';
const STREAK_KEY = 'challenge_streak';
const LEADERBOARD_KEY = 'challenge_leaderboard';

const CHALLENGE_TIME_LIMIT = 180; // 3 minutes per challenge, in seconds

// PUBLIC_INTERFACE
export function getScore() {
    /** Gets the current total score from localStorage. */
    return parseInt(localStorage.getItem(SCORE_KEY), 10) || 0;
}

// PUBLIC_INTERFACE
export function setScore(newScore) {
    /** Sets the current total score in localStorage. */
    localStorage.setItem(SCORE_KEY, newScore);
}

// PUBLIC_INTERFACE
export function incrementScore(amount = 1) {
    /** Increments the score by amount and persists. */
    const current = getScore();
    setScore(current + amount);
    return current + amount;
}

// PUBLIC_INTERFACE
export function resetScore() {
    /** Resets the score to zero. */
    setScore(0);
}

// PUBLIC_INTERFACE
export function getStreak() {
    /** Gets the current streak from localStorage. */
    return parseInt(localStorage.getItem(STREAK_KEY), 10) || 0;
}

// PUBLIC_INTERFACE
export function incrementStreak() {
    /** Increments streak count and persists. */
    const current = getStreak();
    localStorage.setItem(STREAK_KEY, current + 1);
    return current + 1;
}

// PUBLIC_INTERFACE
export function resetStreak() {
    /** Resets the streak to zero. */
    localStorage.setItem(STREAK_KEY, 0);
}

// PUBLIC_INTERFACE
export function addToLeaderboard(username, score) {
    /**
     * Adds or updates the user's score in the leaderboard.
     * Only keeps top 5 scores, persists in localStorage.
     */
    const current = getLeaderboard();
    let found = false;
    const now = Date.now();
    let updated = current.map(entry => {
        if (entry.username === username) {
            found = true;
            return { ...entry, score: Math.max(entry.score, score), time: now };
        }
        return entry;
    });
    if (!found) {
        updated.push({ username, score, time: now });
    }
    // Sort descending by score, then ascending by earliest time
    updated.sort((a, b) => b.score !== a.score ? (b.score - a.score) : (a.time - b.time));
    // Keep only top 5
    updated = updated.slice(0, 5);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
}

// PUBLIC_INTERFACE
export function getLeaderboard() {
    /**
     * Retrieves the leaderboard from localStorage.
     * Returns an array [{ username, score, time }]
     */
    let lb = [];
    try {
        lb = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
        if (!Array.isArray(lb)) lb = [];
    } catch {
        lb = [];
    }
    return lb;
}

// PUBLIC_INTERFACE
export function resetLeaderboard() {
    /** Removes all leaderboard data. */
    localStorage.removeItem(LEADERBOARD_KEY);
}

// PUBLIC_INTERFACE
export function getInitialTimer() {
    /** Returns the time limit in seconds for a challenge. */
    return CHALLENGE_TIME_LIMIT;
}
