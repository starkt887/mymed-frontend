import Router from "./router/Router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Toaster from "./components/Toaster/Toaster";
import Loader from "./components/Loader/Loader";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { useWeb3ModalTheme, Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { arbitrum, mainnet, polygon, polygonMumbai } from "wagmi/chains";

import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "react-hot-toast";

//chain setup 1
const chains = [polygonMumbai];
const projectId = "aa58411dd51014e3be5af1f8c54f8777";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        light: "#3e6dd7",
        main: "#2754BB",
        dark: "#1e4191",
        contrastText: "#fff",
      },
      secondary: {
        light: "#212530",
        main: "#191C24",
        dark: "#111318",
        contrastText: "#fff",
      },
    },
  });

  //chain setup 2
  const { setTheme } = useWeb3ModalTheme();
  setTheme({
    themeMode: "dark",
    themeColor: "default",
    themeBackground: "themeColor",
  });

  //Hotkey restrictions
  useHotkeys("ctrl+c", (e) => {
    e.preventDefault();
    toast.error("Copy action is restricted!");
  });
  useHotkeys("ctrl+shift+i", (e) => {
    e.preventDefault();
    toast.error("Restricted area!");
  });

  document.onkeyup = keystrokes;
  function keystrokes(e) {
    switch (e.which) {
      case 44:
        stopPrntScr();
        alert("You cannot print screen!");
    }
  }
  function stopPrntScr() {
    var inpFld = document.createElement("input");
    inpFld.setAttribute("value", ".");
    inpFld.setAttribute("width", "0");
    inpFld.style.height = "0px";
    inpFld.style.width = "0px";
    inpFld.style.border = "0px";
    document.body.appendChild(inpFld);
    inpFld.select();
    document.execCommand("copy");
    inpFld.remove(inpFld);
  }

  return (
    <ThemeProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <Router />
        <Toaster />
        <Loader />
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;
