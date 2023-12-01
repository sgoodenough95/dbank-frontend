import { useWeb3React } from "@web3-react/core";
import { Divider, Typography } from "antd";
const { Title } = Typography;

import { useWindowWidthAndHeight } from "hooks";

import { Infos, Status } from "./components";
import Credit from './components/Credit';
import Loan from './components/Loan';

const styles = {
  container: {
    width: "80%",
    minWidth: "330px",
    maxWidth: "900px",
    textAlign: "center",
    margin: "auto",
    padding: "20px 0",
    borderRadius: "10px",
    boxShadow: "0px 0px 30px 30px rgba(30, 136, 229, 0.2)"
  },
  content: {
    width: "85%",
    margin: "auto",
    fontSize: "17px"
  },
  action: {
    display: "inline-flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px"
  }
} as const;

type DisplayPaneProps = {
  isDarkMode: boolean;
};

const DisplayPane: React.FC<DisplayPaneProps> = ({ isDarkMode }) => {
  const { chainId, isActivating, isActive } = useWeb3React();
  const { isMobile } = useWindowWidthAndHeight();

  return (
    <div
      style={{
        ...styles.container,
        border: isDarkMode ? "1px solid rgba(152, 161, 192, 0.24)" : "none",
        width: isMobile ? "90%" : "80%"
      }}
    >
      <Title>🏦 Welcome to dBank 🏦</Title>
      <div style={styles.content}>
        <Status isActivating={isActivating} isActive={isActive} />
        <Infos chainId={chainId} />

        {isActive && (
          <>
            <Divider />
            <div style={styles.action}>
              <Loan />
              {!isMobile && <Divider type="vertical" style={{ fontSize: "120px !important" }} />}
              <Credit />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayPane;
