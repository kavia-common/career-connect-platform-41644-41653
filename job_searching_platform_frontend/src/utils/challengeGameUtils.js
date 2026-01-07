//
// Utilities for challenge game logic, including localStorage helpers for challenge state.
//

// PUBLIC_INTERFACE
export function loadState() {
  /**
   * Loads the saved state for the challenge game from localStorage.
   * Returns an object with currentChallengeIdx, score, streak, xp if present.
   */
  try {
    const data = localStorage.getItem('codingChallengeState');
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

// PUBLIC_INTERFACE
export function saveState(stateObj) {
  /**
   * Saves the state for the challenge game to localStorage.
   * Accepts an object with currentChallengeIdx, score, streak, xp.
   */
  try {
    localStorage.setItem('codingChallengeState', JSON.stringify(stateObj));
  } catch (err) {
    // Ignore any storage error
  }
}

// PUBLIC_INTERFACE
export function clearState() {
  /**
   * Clears the stored state for the challenge game from localStorage.
   */
  try {
    localStorage.removeItem('codingChallengeState');
  } catch (err) {
    // Ignore any storage error
  }
}

// If there are other utilities already here, add them below (if not, this file will solely provide localStorage game state helpers for now)
