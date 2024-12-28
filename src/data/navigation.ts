export const navMain = [
  {
    title: "Download the Wallet",
    url: "/playground/download-wallet",
  },
  {
    title: "Verifiable Credentials",
    url: "/playground/verifiable-credentials",
    items: [
      {
        title: "Obtain a credential",
        url: "/playground/verifiable-credentials/obtain",
        items: [
          {
            title: "Certificate of Vaccination",
            url: "/playground/verifiable-credentials/obtain/vaccination",
          },
          {
            title: "Digital ID",
            url: "/playground/verifiable-credentials/obtain/digital-id",
          },
        ],
      },
      {
        title: "Prove it digitally",
        url: "/playground/verifiable-credentials/prove",
      },
    ],
  },
];
