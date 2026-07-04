import { findClashingSlots } from './src/types/timetable.js';

function assertEq(name, actual, expected) {
    const actualStr = JSON.stringify(actual.sort());
    const expectedStr = JSON.stringify(expected.sort());
    if (actualStr !== expectedStr) {
        console.error(`❌ [FAILED] ${name}`);
        console.error(`   Expected: ${expectedStr}`);
        console.error(`   Actual:   ${actualStr}`);
        process.exitCode = 1;
    } else {
        console.log(`✅ [PASSED] ${name}`);
    }
}

// Since taking B2, TC2/G2, and TDD2 consecutively leaves only 10 minute gaps, 
// a 15 min snacks break is violated.
assertEq("Full valid day CORRECTLY triggers snacks break when assigning consecutive afternoon slots", 
    findClashingSlots('TDD2', ['A1', 'C1', 'D1', 'F2', 'A2', 'B2', 'TC2/G2']), 
    ["Snacks break (TUE)"]);
