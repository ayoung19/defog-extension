import type { PlasmoCSConfig } from "plasmo";

import { Storage } from "@plasmohq/storage";

import {
  ENABLED_KEY,
  MAPPINGS_KEY,
  parseMappings,
  type Mapping,
} from "@/types/storage";

export const config: PlasmoCSConfig = {
  matches: ["http://*/*", "https://*/*"],
  run_at: "document_idle",
};

// --- Replacement helpers ---

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildReplacementRegex(mappings: Mapping[]): RegExp | null {
  if (mappings.length === 0) return null;
  const pattern = mappings.map((m) => escapeRegex(m.pattern)).join("|");
  return new RegExp(pattern, "gi");
}

function buildLabelMap(mappings: Mapping[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of mappings) {
    map.set(m.pattern.toLowerCase(), m.label);
  }
  return map;
}

// --- DOM ---

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "IFRAME",
  "SVG",
]);

let currentRegex: RegExp | null = null;
let currentLabelMap = new Map<string, string>();
let globalEnabled = true;

// --- DOM replacement ---

function processTextNode(
  node: Text,
  regex: RegExp,
  labelMap: Map<string, string>,
) {
  const text = node.textContent;
  if (!text || !regex.test(text)) return;

  regex.lastIndex = 0;
  const replaced = text.replace(regex, (match) => {
    return labelMap.get(match.toLowerCase()) ?? match;
  });

  if (replaced !== text) {
    node.textContent = replaced;
  }
}

function walkAndReplace(
  root: Node,
  regex: RegExp,
  labelMap: Map<string, string>,
) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }

  for (const node of nodes) {
    processTextNode(node, regex, labelMap);
  }
}

function scanPage() {
  if (!currentRegex || !globalEnabled || !document.body) return;
  walkAndReplace(document.body, currentRegex, currentLabelMap);
}

// --- MutationObserver ---

const pendingTargets = new Set<Node>();
let scanScheduled = false;

const observer = new MutationObserver((mutations) => {
  if (!currentRegex || !globalEnabled) return;

  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        pendingTargets.add(node);
      }
    } else if (
      mutation.type === "characterData" &&
      mutation.target.parentNode
    ) {
      pendingTargets.add(mutation.target.parentNode);
    }
  }

  if (!scanScheduled && pendingTargets.size > 0) {
    scanScheduled = true;
    requestAnimationFrame(() => {
      observer.disconnect();

      for (const target of pendingTargets) {
        if (target.isConnected && currentRegex) {
          walkAndReplace(target, currentRegex, currentLabelMap);
        }
      }

      pendingTargets.clear();
      scanScheduled = false;
      startObserving();
    });
  }
});

function startObserving() {
  if (!document.body) return;
  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

// --- Rebuild ---

function rebuild(mappings: Mapping[]) {
  currentRegex = buildReplacementRegex(mappings);
  currentLabelMap = buildLabelMap(mappings);
  scanPage();
}

// --- Storage sync ---

const storage = new Storage({ area: "local" });

async function init() {
  const rawMappings = await storage.get<Mapping[]>(MAPPINGS_KEY);
  const enabled = (await storage.get<boolean>(ENABLED_KEY)) ?? true;

  globalEnabled = enabled;
  rebuild(parseMappings(rawMappings));
  startObserving();

  storage.watch({
    [MAPPINGS_KEY]: (change) => {
      rebuild(parseMappings(change.newValue as Mapping[]));
    },
    [ENABLED_KEY]: (change) => {
      globalEnabled = (change.newValue as boolean) ?? true;
      if (globalEnabled) scanPage();
    },
  });
}

init();
