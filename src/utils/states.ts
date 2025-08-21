/**
 * Canonical list of pixel states (must match contract exactly)
 * Order matters for consistency between contract and TypeScript
 */
export const ALLOWED_STATES = [
    "empty",
    "soil", 
    "seed",
    "sprout",
    "leaf",
    "flower:red",
    "flower:yellow", 
    "flower:blue",
    "flower:white",
    "shrub",
    "tree",
    "water",
    "stone",
    "path"
] as const;

export type PixelState = typeof ALLOWED_STATES[number];

/**
 * Generate state key (keccak256 hash) from state name
 * @param stateName The state name to hash
 * @returns The keccak256 hash as bytes32 string
 */
export function stateKey(stateName: string): `0x${string}` {
    const { keccak256, toHex } = require("viem");
    return keccak256(toHex(stateName));
}

/**
 * Validate if a state name is allowed
 * @param stateName The state name to validate
 * @returns True if the state is in the allowed list
 */
export function isValidState(stateName: string): stateName is PixelState {
    return ALLOWED_STATES.includes(stateName as PixelState);
}

/**
 * Get all allowed state names
 * @returns Array of all allowed state names
 */
export function getAllowedStates(): readonly string[] {
    return ALLOWED_STATES;
}

/**
 * Get state hash mapping for all allowed states
 * @returns Object mapping state names to their hashes
 */
export function getStateHashMap(): Record<PixelState, string> {
    const hashMap = {} as Record<PixelState, string>;
    
    for (const state of ALLOWED_STATES) {
        hashMap[state] = stateKey(state);
    }
    
    return hashMap;
}
