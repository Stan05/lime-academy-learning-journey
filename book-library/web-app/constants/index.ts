
  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: "https://ethereumnode.defiterm.io",
    3: "https://eth-ropsten.alchemyapi.io/v2",
    4: "https://eth-rinkeby.alchemyapi.io/v2"
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

  export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
  export const LIBRARY_ADDRESS = "0xc27C775C386e0f7D77E8148675aeac90746a40e5";
  export const LIBRARY_OWNER = "0xc1F1E9c745a41ef791836BE97D57E119218C632A";