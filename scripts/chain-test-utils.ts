import type { ChainTextGenerator } from "../src/chains";
import { ChainExecutionError } from "../src/chains";

export function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function createMockGenerator(
  responseText: string,
  inspectPrompt?: (prompt: string) => void
): ChainTextGenerator {
  return async (prompt) => {
    inspectPrompt?.(prompt);
    return { text: responseText };
  };
}

export async function expectChainError(
  action: () => Promise<unknown>
): Promise<void> {
  try {
    await action();
  } catch (error) {
    assert(
      error instanceof ChainExecutionError,
      "Expected ChainExecutionError"
    );
    return;
  }

  throw new Error("Expected chain to fail");
}

export function printPass(scriptName: string): void {
  console.log(`${scriptName}: passed`);
}
