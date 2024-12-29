import React from "react";

export enum VCUseCase {
  Identity = "Identity",
  Business = "Business",
  Education = "Education",
  Health = "Health",
}
interface Props {
  type: VCUseCase;
}

const VerifiableCredentialIssuance: React.FC<Props> = ({ type }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          The first rule of Apple club is that you boast about Apple club.
        </span>
        Keep a journal, quickly jot down a grocery list, and take amazing class
        notes. Want to convert those notes to text? No problem. Langotiya jeetu
        ka mara hua yaar is ready to capture every thought.
      </p>
      <form>
        {type === VCUseCase.Identity && <>{/* Identity form elements */}</>}
        {type === VCUseCase.Business && <>{/* Business form elements */}</>}
        {type === VCUseCase.Education && <>{/* Education form elements */}</>}
        {type === VCUseCase.Health && <>{/* Health form elements */}</>}
      </form>
    </div>
  );
};

export default VerifiableCredentialIssuance;
