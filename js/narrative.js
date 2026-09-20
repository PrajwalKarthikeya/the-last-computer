// Narrative system for THE LAST COMPUTER
export function initNarrative() {
  // Hide the text display initially
  const textDisplay = document.getElementById('text-display');
  textDisplay.style.opacity = '0';
}

// Story fragments for each component
const STORY_FRAGMENTS = {
  CPU: [
    "Initializing...",
    "CPU: Intel Xeon E5-2680 v4 @ 2.40GHz",
    "Core Temperature: 38°C",
    "Load: 0.0%",
    "Last User Interaction: 2025-03-14 08:23:17"
  ],
  MEMORY: [
    "Memory Bank Status: Online",
    "Total Capacity: 32 GB DDR4",
    "Used: 2.1 GB",
    "Error Correction: Enabled",
    "Last Access: 2025-03-14 08:23:19"
  ],
  STORAGE: [
    "Primary Storage: NVMe SSD 4TB",
    "Partition C:\\ - NTFS - 3.2TB Free",
    "Partition D:\\ - EXT4 - 800MB Free",
    "Recent Activity: Log Archive",
    "Last Modified: 2025-03-14 08:23:21"
  ],
  POWER: [
    "Power Supply Unit: 850W Platinum",
    "Input Voltage: 120V AC Stable",
    "Output: 12V DC - 230W",
    "Battery Backup: 94% Charge",
    "Power Cycles: 1,204"
  ],
  NETWORK: [
    "Network Interface: Disabled",
    "MAC Address: 00:1A:7D:DA:71:13",
    "Last Connection: 2025-03-14 08:20:03",
    "Signal Strength: N/A",
    "Packet Loss: 100%"
  ]
};

// Final story sequences
const FINAL_SEQUENCE = [
  "> accessing core logs...",
  "> retrieving user count...",
  "USER COUNT: 1",
  "> identifying active user...",
  "ACTIVE USER: YOU",
  "> system diagnostic complete...",
  "SYSTEM STATUS: OPERATIONAL",
  "WELCOME BACK."
];

let inspectedComponents = new Set();
let showingFinalSequence = false;
let sequenceIndex = 0;
let sequenceTimer = null;

// Function to get narrative text for a component
export function getNarrativeText(componentName) {
  if (showingFinalSequence) {
    // If we're showing the final sequence, return the current step
    return FINAL_SEQUENCE[sequenceIndex] || '';
  }

  const fragments = STORY_FRAGMENTS[componentName];
  if (!fragments) return 'System Diagnostic';

  // Show a random fragment or progress through them
  // For simplicity, we'll show the first fragment not yet seen
  // In a more advanced version, we could track per-component index
  return fragments[0]; // Just show the first one for now
}

// Function to handle component inspection
export function inspectComponent(componentName) {
  inspectedComponents.add(componentName);

  // Check if all components have been inspected
  if (inspectedComponents.size >= Object.keys(STORY_FRAGMENTS).length) {
    triggerFinalSequence();
  }
}

// Function to trigger the final story sequence
function triggerFinalSequence() {
  showingFinalSequence = true;
  sequenceIndex = 0;
  showNextSequenceStep();
}

// Function to show the next step in the final sequence
function showNextSequenceStep() {
  const textDisplay = document.getElementById('text-display');
  if (sequenceIndex < FINAL_SEQUENCE.length) {
    textDisplay.textContent = FINAL_SEQUENCE[sequenceIndex];
    textDisplay.style.opacity = '1';
    sequenceIndex++;

    // Set timer for next step (varying delay for dramatic effect)
    const delay = sequenceIndex === 2 || sequenceIndex === 4 ? 2000 : 1500; // Longer pause for key revelations
    sequenceTimer = setTimeout(showNextSequenceStep, delay);
  } else {
    // Sequence complete, keep the final message
    textDisplay.textContent = FINAL_SEQUENCE[FINAL_SEQUENCE.length - 1];
  }
}

// Function to hide narrative (used when exiting inspection)
export function hideNarrative() {
  const textDisplay = document.getElementById('text-display');
  textDisplay.style.opacity = '0';
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
  // Reset if we were in final sequence
  showingFinalSequence = false;
  sequenceIndex = 0;
  inspectedComponents.clear();
}
