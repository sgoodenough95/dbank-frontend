import { useWeb3React, Web3ReactHooks } from "@web3-react/core";
import { Button, Typography } from "antd";
const { Paragraph } = Typography;

import { useNativeBalance } from "hooks";
import { parseBigNumberToFloat } from "utils/formatters";

const styles = {
  display: {
    paddingBlock: "0 15px",
    display: "flex",
    flexDirection: "column"
  },
  statusText: {
    fontSize: "17px"
  },
  statusValue: {
    fontWeight: 800
  }
} as const;

const Infos = ({ chainId }: { chainId: ReturnType<Web3ReactHooks["useChainId"]> }) => {
  const { account, provider } = useWeb3React();
  const balance = useNativeBalance(provider, account);

  if (chainId === undefined) return null

  return (
    <Typography style={styles.display}>
      <Paragraph style={styles.statusText}>
        Test ETH Balance:
        <span style={styles.statusValue}>
          {balance
            ? `
          Ξ ${parseBigNumberToFloat(balance).toFixed(4)}`
            : 0}
        </span>
        <br /><br />
        <Button href="https://faucet.triangleplatform.com/arbitrum/goerli" target="_blank">Click Here to get test ETH</Button>
        <br /><br />
        <Button href="http://ec2-3-9-174-158.eu-west-2.compute.amazonaws.com:8080/" target="_blank">Click Here to set your Credit Score 👀</Button>
      </Paragraph>
    </Typography>
  );
};

export default Infos;
