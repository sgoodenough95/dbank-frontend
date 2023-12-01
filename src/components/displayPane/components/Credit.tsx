import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Button, InputNumber, Typography } from "antd";
const { Paragraph } = Typography;
import { message } from "antd";
import { BigNumber, ethers } from "ethers";

import { useContract } from "hooks";
import { parseBigNumberToFloat } from "utils/formatters";

import AddressInput from "../../AddressInput";

const styles = {
  buttonTransfer: {
    display: "flex",
    margin: "15px 0"
  },
  statusText: {
    fontSize: "17px"
  },
} as const;

const abi = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
      { internalType: "uint8", name: "decimals_", type: "uint8" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "borrow",
    outputs: [{ internalType: "uint256", name: "newOutstanding", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" }
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "enquireApr",
    outputs: [{ internalType: "uint256", name: "apr", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "enquireDeadline",
    outputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "enquireMaxBorrow",
    outputs: [{ internalType: "uint256", name: "maxBorrow", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getCreditScore",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getDeadline",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getLoanTerms",
    outputs: [
      { internalType: "uint256", name: "maxBorrow", type: "uint256" },
      { internalType: "uint256", name: "apr", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getOutstanding",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" }
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "repay",
    outputs: [{ internalType: "uint256", name: "newOutstanding", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_account", type: "address" },
      { internalType: "uint256", name: "_creditScore", type: "uint256" }
    ],
    name: "setCreditScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "simulateOneYearElapsed",
    outputs: [{ internalType: "uint256", name: "newOutstanding", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const address = "0x024A308B726cCACa440EC66ab4aABdFA3F9D71A7";

const Credit: React.FC = () => {
  const { account } = useWeb3React();
  // const { loading, transferNative } = useWriteContract();
  const myContractInstance: any = useContract(address, abi);
  // const balance = useNativeBalance(provider, account);
  const [amount, setAmount] = useState<number | null>();
  const [receiver, setReceiver] = useState<string>();
  const [mintLoading, setMintLoading] = useState<boolean>(false);
  const [creditScore, setCreditScore] = useState<BigNumber | null>();
  const [maxBorrow, setMaxBorrow] = useState<BigNumber | null>();
  const [deadline, setDeadline] = useState<Date | null>();
  const [apr, setApr] = useState<number | null>();

  // function handleTransfer(event: { preventDefault: () => void }): void {
  //   event.preventDefault();

  //   if (amount && receiver) {
  //     transferNative(receiver, amount);
  //   }
  // }

  // const handleGetDecimals = async () => {
  //   if (myContractInstance) {
  //     const decimals = await myContractInstance.decimals();
  //     console.log(decimals);
  //   } else {
  //     console.error("Contract instance is undefined.");
  //   }
  // };

  const handleMint = async (event: { preventDefault: () => void }): Promise<void> => {
    event.preventDefault();

    if (amount) {
      setMintLoading(true);
      try {
        if (!ethers.utils.isAddress(receiver!)) {
          throw new Error("Invalid address");
        }
        if (!amount || amount <= 0) {
          throw new Error("Invalid amount");
        }

        const value = ethers.utils.parseEther(amount.toString());
        const tx = await myContractInstance?.mint(receiver, value);
        const receipt = await tx?.wait(2);
        message.info(`Success!\n\nTx Hash: ${receipt?.transactionHash}`);
      } catch (error: any) {
        const message = error.reason ?? error.message ?? error;
        message.error(`An error occured: ${message}`);
      } finally {
        setMintLoading(false);
      }
    }
  };

  const handleGetAccount = () => {
    handleGetCreditScore();
    handleGetMaxBorrow();
    handleGetAPR();
    handleGetDeadline();
  };

  const handleGetCreditScore = async () => {
    const res: BigNumber = await myContractInstance?.getCreditScore(account);
    console.log(res);
    setCreditScore(res);
  };

  // const handleGetDebt = async () => {
  //   const res: BigNumber = await myContractInstance?.getOutstanding(account);
  //   console.log(res);
  //   setDebt(res);
  // };

  const handleGetDeadline = async () => {
    const res: number = await myContractInstance?.enquireDeadline(account);
    console.log(res);
    const date = new Date(res * 1000);
    console.log(date.toLocaleDateString("en-GB"));
    setDeadline(date);
  };

  const handleGetMaxBorrow = async () => {
    const res: BigNumber = await myContractInstance?.enquireMaxBorrow(account);
    console.log(res);
    setMaxBorrow(res);
  }

  const handleGetAPR = async () => {
    const res: number = await myContractInstance?.enquireApr(account);
    console.log(res);
    setApr(res / 100);
  }

  return (
    <div style={{ width: "40%", minWidth: "250px" }}>
      <div style={styles.buttonTransfer}>
        <Button type="primary" shape="round" onClick={handleGetAccount}>
          View or Refresh Credit Information
        </Button>
      </div>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%", textAlign: "left" }}>
        <Typography>
          <Paragraph style={styles.statusText}>
            Credit Score:
            {creditScore
              ?
            ` ${creditScore}`
              : ' -'}
            <br />
            Borrowing Power:
            {maxBorrow
              ?
            ` d$${parseBigNumberToFloat(maxBorrow).toFixed(2)}`
              : ' -'}
            <br />
            APR:
            {apr
              ? `
            ${apr}%`
              : ' -'}
            <br />
            To be paid back by:
            {deadline
              ?
            ` ${deadline}`
              : ' -'}
          </Paragraph>
        </Typography>
      </div>
      <AddressInput onChange={setReceiver} address={receiver} />
      <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
        <InputNumber
          value={amount}
          onChange={setAmount}
          placeholder="Amount to mint (testing)"
          min={0}
          // max={balance ? parseBigNumberToFloat(balance) : 0}
          style={{ width: "100%", height: "80%", marginBlock: "auto" }}
        />

        {/* <div style={styles.buttonTransfer}>
          <Button type="primary" shape="round" onClick={handleTransfer} loading={loading}>
            Transfer
          </Button>
        </div> */}

        <div style={styles.buttonTransfer}>
          <Button type="primary" shape="round" onClick={handleMint} loading={mintLoading}>
            Mint dUSD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Credit;
