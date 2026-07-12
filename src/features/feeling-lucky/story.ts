/**
 * The curated story model for Join Andrew on an Adventure.
 *
 * This module deliberately contains no React or browser APIs. The experience can
 * render it however it likes, while the story remains finite and testable.
 */

export type StoryPhase =
  | "diagnosis"
  | "solution"
  | "priority"
  | "code-challenge"
  | "partnership"
  | "resolution";

export type DiagnosisId = "inspect-relay" | "ask-dragon" | "send-scout";
export type SolutionId = "predict-bursts" | "reroute-signal" | "charging-window";
export type PriorityId = "reliability" | "kindness" | "simplicity";
export type PartnershipId = "beacon-keeper" | "thermal-tester" | "mist-router";

export type PseudocodeBlockId =
  | "read-heat"
  | "predict-burst"
  | "move-signal"
  | "verify-delivery";

export interface StoryChoice<TId extends string> {
  id: TId;
  label: string;
  description: string;
  response: string;
}

export interface ChoiceScene<TId extends string> {
  id: StoryPhase;
  eyebrow: string;
  title: string;
  body: readonly string[];
  prompt: string;
  choices: readonly StoryChoice<TId>[];
}

export interface PseudocodeBlock {
  id: PseudocodeBlockId;
  code: string;
  plainEnglish: string;
}

export interface CodeChallenge {
  id: "signal-control-loop";
  eyebrow: string;
  title: string;
  body: string;
  prompt: string;
  blocks: readonly PseudocodeBlock[];
  correctOrder: readonly PseudocodeBlockId[];
  hint: string;
}

export interface AdventureChoices {
  diagnosis: DiagnosisId;
  solution: SolutionId;
  priority: PriorityId;
  codeOrder: readonly PseudocodeBlockId[];
  partnership: PartnershipId;
}

export type AdventureProgress = Partial<AdventureChoices>;

export interface ChallengeResult {
  correct: boolean;
  firstIncorrectIndex: number | null;
  message: string;
}

export interface AdventureOutcome {
  title: string;
  outcome: string;
  postcardLine: string;
  fieldNote: string;
  dragonRole: string;
  choicesSummary: readonly string[];
}

export const DIAGNOSIS_SCENE: ChoiceScene<DiagnosisId> = {
  id: "diagnosis",
  eyebrow: "Watchtower 17 · 19:42",
  title: "A dragon-shaped incident report",
  body: [
    "Dusk settles over the Great Wall in layers of indigo. Then the mountain mist parts around something enormous: brass wings, porcelain scales, and a furnace-bright throat.",
    "The mechanical dragon sneezes a neat column of flame. An ancient signal relay begins to glow cherry red. Farther along the Wall, amber beacons wink out one by one.",
    "Andrew lowers the emergency bucket. ‘I’m beginning to suspect this is not primarily a bucket problem.’",
  ],
  prompt: "How do you find out what is actually going wrong?",
  choices: [
    {
      id: "inspect-relay",
      label: "Inspect the relay",
      description: "Follow the scorch marks and read the hardware logs.",
      response:
        "You trace heat blooms across the relay housing. The dragon is not attacking it; each fire burst lands exactly when the relay draws peak power. An unfortunate synchronization bug, with scales.",
    },
    {
      id: "ask-dragon",
      label: "Ask the dragon",
      description: "Treat the alarming machine as a stakeholder first.",
      response:
        "The dragon answers in modem chirps and apologetic smoke rings. It has been waking every time the beacons pulse, then breathing fire to recharge. It looks relieved that someone finally asked.",
    },
    {
      id: "send-scout",
      label: "Deploy the tiny robot",
      description: "Send Andrew’s palm-sized scout into the mist.",
      response:
        "The scout returns soot-blackened but triumphant, projecting a heat map in the air. Relay spikes, dragon sneezes, melted coupler—always in that order. It also reports that the dragon likes having its chin scratched.",
    },
  ],
};

export const SOLUTION_SCENE: ChoiceScene<SolutionId> = {
  id: "solution",
  eyebrow: "Expedition log · Root cause found",
  title: "Fix the system, not the dragon",
  body: [
    "The dragon coils around the next watchtower, trying very hard not to breathe. This is noble, but not a durable service-level agreement.",
    "The relay still has to carry its warning signal across the mountains. The dragon still needs to recharge. A sword would solve neither requirement and would be extremely difficult to expense.",
  ],
  prompt: "Which intervention should anchor the repair?",
  choices: [
    {
      id: "predict-bursts",
      label: "Predict the fire bursts",
      description: "Learn the dragon’s thermal rhythm and create a safe window.",
      response:
        "You sketch a tiny predictor that can see a furnace-cycle building seconds before the dragon sneezes. Andrew names the model S.N.I.F.F., then refuses to explain the acronym.",
    },
    {
      id: "reroute-signal",
      label: "Route around the heat",
      description: "Shift traffic to cool watchtowers before each burst.",
      response:
        "You map a redundant path through three neighboring towers. The Wall has survived dynasties; it can survive a little graceful failover.",
    },
    {
      id: "charging-window",
      label: "Schedule dragon charging",
      description: "Give the dragon predictable power without cooking the relay.",
      response:
        "The dragon studies your proposed charging calendar, taps the dusk slot with one careful claw, and adds a recurring event. Its calendar etiquette is impeccable.",
    },
  ],
};

export const PRIORITY_SCENE: ChoiceScene<PriorityId> = {
  id: "priority",
  eyebrow: "Design review · One constraint remains",
  title: "Choose what the system protects",
  body: [
    "The repair can work several ways, but the old relay has the processing power of a determined teapot. You can optimize one principle into the first version.",
  ],
  prompt: "What should guide the control system?",
  choices: [
    {
      id: "reliability",
      label: "Reliability first",
      description: "No beacon is allowed to disappear without a backup route.",
      response:
        "You reserve a fallback path for every signal. The relay clicks approvingly, which is as close as infrastructure gets to applause.",
    },
    {
      id: "kindness",
      label: "Dragon comfort first",
      description: "Never interrupt a recharge or startle an eight-ton collaborator.",
      response:
        "You add generous cool-down windows and a soft chime before rerouting. The dragon’s shoulders visibly relax.",
    },
    {
      id: "simplicity",
      label: "Simplicity first",
      description: "Prefer the smallest loop a future watchkeeper can repair.",
      response:
        "You remove three clever abstractions and one unnecessary dashboard. Andrew quietly closes the tab labeled ‘dashboard for the dashboard.’",
    },
  ],
};

export const CODE_CHALLENGE: CodeChallenge = {
  id: "signal-control-loop",
  eyebrow: "Field terminal · Control loop",
  title: "Put the relay logic in order",
  body:
    "The pieces are all here. Arrange the four blocks into a loop that notices heat before it moves the signal—and confirms the message arrived before beginning again.",
  prompt: "Drag or move the blocks into a safe execution order.",
  blocks: [
    {
      id: "move-signal",
      code: "route_signal(to: coolest_tower)",
      plainEnglish: "Move the message onto the safest available route.",
    },
    {
      id: "read-heat",
      code: "heat = read_dragon_sensor()",
      plainEnglish: "Read the dragon’s current thermal state.",
    },
    {
      id: "verify-delivery",
      code: "confirm(beacon.delivered)",
      plainEnglish: "Confirm the beacon reached the next watchtower.",
    },
    {
      id: "predict-burst",
      code: "burst = predict_next_breath(heat)",
      plainEnglish: "Predict whether a fire burst is approaching.",
    },
  ],
  correctOrder: [
    "read-heat",
    "predict-burst",
    "move-signal",
    "verify-delivery",
  ],
  hint: "Observe first, predict second, act third, then verify.",
};

export const PARTNERSHIP_SCENE: ChoiceScene<PartnershipId> = {
  id: "partnership",
  eyebrow: "All beacons online · One final decision",
  title: "A new job for an old dragon",
  body: [
    "Your loop runs. A breath gathers in the dragon’s chest; the signal slips safely to a cooler tower; amber light races along the Wall. The fire lands on an empty charging plate with a resonant, satisfied hum.",
    "The dragon has gone from incident to infrastructure. It would like to know its title.",
  ],
  prompt: "What role should the dragon take?",
  choices: [
    {
      id: "beacon-keeper",
      label: "Keeper of the beacons",
      description: "Guard the signal and relight towers after storms.",
      response:
        "The dragon bows solemnly and polishes the nearest beacon with one wing. Its first performance review is outstanding.",
    },
    {
      id: "thermal-tester",
      label: "Chief thermal tester",
      description: "Stress-test every repair under responsibly supervised fire.",
      response:
        "The dragon produces a tiny pair of brass safety goggles from behind one ear. Apparently it has been preparing for this opportunity.",
    },
    {
      id: "mist-router",
      label: "Mountain mist router",
      description: "Fly messages across the valleys when weather hides the Wall.",
      response:
        "The dragon unfurls its wings and threads a ribbon of amber light through the clouds. The mist has never had better network coverage.",
    },
  ],
};

export const STORY_SCENES = [
  DIAGNOSIS_SCENE,
  SOLUTION_SCENE,
  PRIORITY_SCENE,
  CODE_CHALLENGE,
  PARTNERSHIP_SCENE,
] as const;

const diagnosisLabels: Record<DiagnosisId, string> = {
  "inspect-relay": "read the relay’s heat scars",
  "ask-dragon": "listened to the dragon",
  "send-scout": "sent in a very brave tiny robot",
};

const solutionLabels: Record<SolutionId, string> = {
  "predict-bursts": "predicted each fire burst",
  "reroute-signal": "built a cool redundant route",
  "charging-window": "negotiated a dragon-friendly charging window",
};

const priorityLabels: Record<PriorityId, string> = {
  reliability: "kept every beacon backed up",
  kindness: "designed around an unusual collaborator",
  simplicity: "kept the repair watchkeeper-simple",
};

const roleLabels: Record<PartnershipId, string> = {
  "beacon-keeper": "Keeper of the Beacons",
  "thermal-tester": "Chief Thermal Tester",
  "mist-router": "Mountain Mist Router",
};

const outcomeBySolution: Record<SolutionId, string> = {
  "predict-bursts":
    "The relay now anticipates every furnace cycle and moves its work into the quiet seconds between breaths.",
  "reroute-signal":
    "The beacon network now flows around hot towers without dropping so much as a single dramatic warning.",
  "charging-window":
    "The Wall and its largest resident now share a charging rhythm: signals first, magnificent fire second.",
};

const fieldNoteByPriority: Record<PriorityId, string> = {
  reliability:
    "Field note: redundancy is considerably more charming when it includes a brass dragon.",
  kindness:
    "Field note: the best system accommodated every user, including the one with a furnace for a chest.",
  simplicity:
    "Field note: four clear steps beat forty clever ones, especially when debugging beside open flame.",
};

/** Return the authored response for a selected option without duplicating lookup logic in UI. */
export function getChoiceResponse<TId extends string>(
  scene: ChoiceScene<TId>,
  choiceId: TId,
): string {
  return scene.choices.find((choice) => choice.id === choiceId)?.response ?? "";
}

/** Validate a submitted control loop and identify the earliest block to reconsider. */
export function evaluateCodeOrder(
  order: readonly PseudocodeBlockId[],
): ChallengeResult {
  const expected = CODE_CHALLENGE.correctOrder;
  const firstIncorrectIndex = expected.findIndex((id, index) => order[index] !== id);

  if (firstIncorrectIndex === -1 && order.length === expected.length) {
    return {
      correct: true,
      firstIncorrectIndex: null,
      message:
        "The loop hums to life: observe, predict, route, verify. Somewhere in the mist, a dragon gives an approving modem chirp.",
    };
  }

  return {
    correct: false,
    firstIncorrectIndex:
      firstIncorrectIndex === -1 ? Math.min(order.length, expected.length - 1) : firstIncorrectIndex,
    message:
      "The relay makes a thoughtful clunk. Close—but make sure it observes and predicts before rerouting, then verifies the delivery.",
  };
}

/**
 * Create the finite ending copy. Call only after all five interactions are set;
 * the UI can use `isAdventureComplete` to guard this boundary.
 */
export function createAdventureOutcome(choices: AdventureChoices): AdventureOutcome {
  const dragonRole = roleLabels[choices.partnership];

  return {
    title: "The Wall is speaking again",
    outcome: `${outcomeBySolution[choices.solution]} The mechanical dragon accepts the post of ${dragonRole}, effective immediately.`,
    postcardLine: `Together, you and Andrew ${solutionLabels[choices.solution]} and prevented the Great Wall’s first dragon-caused distributed-systems outage.`,
    fieldNote: fieldNoteByPriority[choices.priority],
    dragonRole,
    choicesSummary: [
      `You ${diagnosisLabels[choices.diagnosis]}.`,
      `You ${solutionLabels[choices.solution]}.`,
      `You ${priorityLabels[choices.priority]}.`,
      `You commissioned the dragon as ${dragonRole}.`,
    ],
  };
}

export function isAdventureComplete(
  progress: AdventureProgress,
): progress is AdventureChoices {
  return Boolean(
    progress.diagnosis &&
      progress.solution &&
      progress.priority &&
      progress.partnership &&
      progress.codeOrder &&
      evaluateCodeOrder(progress.codeOrder).correct,
  );
}

/** A canonical safe order for hint/autocomplete affordances, so nobody gets stuck. */
export function getSafeCodeOrder(): readonly PseudocodeBlockId[] {
  return [...CODE_CHALLENGE.correctOrder];
}
