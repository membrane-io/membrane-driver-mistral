// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { state } from "membrane";

export function status() {
  if (!state.apiKey) {
    return "Please [get an Mistral API key](https://mistral.ai) and [configure](:configure) it.";
  } else {
    return `Ready`;
  }
}

export async function configure({ apiKey }) {
  state.apiKey = apiKey ?? state.apiKey;
}

async function api(method: string, path: string, body?: any) {
  const response = await fetch(`https://api.mistral.ai/v1/${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      Authorization: "Bearer {state.apiKey}",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return await response.json();
}

export async function complete(args: any) {
  return await api("POST", "/chat/completions", args);
}

export async function createEmbeddings(args: any) {
  return await api("POST", "/embeddings", args);
}

export const Root = {
  models: async () => {
    return await api("GET", "/models");
  },
};
