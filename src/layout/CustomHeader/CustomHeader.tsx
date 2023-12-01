import { FC } from "react";

import { useWeb3React, type Web3ReactHooks } from "@web3-react/core";
import { Button, Layout } from "antd";
import mainHead from "assets/images/main-head.png";
import sideHeadRight from "assets/images/side-head-right.png"

import dark_mode from "assets/images/dark_mode.png";
import light_mode from "assets/images/light_mode.png";
import ConnectAccount from "components/Account/ConnectAccount";
import ChainSelector from "components/ChainSelector";
import { useWindowWidthAndHeight } from "hooks";

const { Header } = Layout;

const styles = {
  header: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    paddingTop: "15px",
    zIndex: 1
  },
  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    paddingRight: "10px",
    fontSize: "15px",
    fontWeight: "600"
  }
} as const;

type CustomHeaderProps = {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const CustomHeader: FC<CustomHeaderProps> = ({ isDarkMode, setIsDarkMode }) => {
  const { isMobile } = useWindowWidthAndHeight();
  const { isActive } = useWeb3React();

  const toggleColorMode = () => {
    setIsDarkMode((previousValue) => !previousValue);
  };

  return (
    <Header style={{ ...styles.header, padding: isMobile ? "15px 5px 0 5px" : "15px 20px 0 20px" }}>
      <Logo isActive={isActive} />
      <div style={styles.headerRight}>
        <ChainSelector />
        <ConnectAccount />
        <Button
          shape="round"
          ghost
          onClick={toggleColorMode}
          style={{ height: "42px", padding: "5px 7px 0 10px", border: "none" }}
        >
          <img src={isDarkMode ? light_mode : dark_mode} alt="color mode" width="25px" />
        </Button>
      </div>
    </Header>
  );
};

export default CustomHeader;

export const Logo = ({
  isActive
}: {
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>;
}) => {
  const { isMobile } = useWindowWidthAndHeight();

  let status = false;
  if (isActive) {
    status = !status
  }

  return (
    <div style={{ paddingTop: isMobile ? "25px" : "40px" }}>
      <img
        src={status ? sideHeadRight : mainHead}
        alt="main-head"
        width={isMobile ? "70px" : "90px"}
      />
    </div>
  );
};
