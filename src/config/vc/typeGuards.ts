import type { CredentialUseCaseConfig, ProofUseCaseConfig } from "@/types/vc";

/**
 * Type guard to check if the config is CredentialUseCaseConfig
 */
export function isCredentialUseCaseConfig(
  config: CredentialUseCaseConfig | ProofUseCaseConfig
): config is CredentialUseCaseConfig {
  return "form" in config;
}

/**
 * Type guard to check if the config is ProofUseCaseConfig
 */
export function isProofUseCaseConfig(
  config: CredentialUseCaseConfig | ProofUseCaseConfig
): config is ProofUseCaseConfig {
  return "proofRequest" in config;
}
