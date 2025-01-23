import { MultiStepLoader } from "../ui/multi-step-loader";

const VerificationSteps = () => {
  const steps = [
    {
      title: "Issuer Signature Verification",
      description:
        "Confirms the validity of the digital signature of the issuing institution.",
    },
    {
      title: "User Signature Verification",
      description:
        "Checks the user’s digital signature, to verify their ownership of the credentials.",
    },
    {
      title: "Trusted Issuer Validation",
      description:
        "Verifies that the disclosed data originate from certificates issued by acceptable issuers.",
    },
    {
      title: "Selective Disclosure",
      description:
        "Decrypts only the specific data the user has chosen to share.",
    },
    {
      title: "Proof accepted 🎉",
      description: "The verifier has accepted your proof.",
    },
  ];

  return (
    <MultiStepLoader
      loading={true}
      loadingStates={steps.map((state) => ({
        text: state.title,
        description: state.description,
      }))}
      currentState={4}
    />
  );
};

export default VerificationSteps;
