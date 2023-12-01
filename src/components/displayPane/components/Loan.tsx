import { useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Button, InputNumber, Typography } from "antd";
const { Paragraph } = Typography;
import { message } from "antd";
import { BigNumber, ethers } from "ethers";

import { useContract } from "hooks";
import { parseBigNumberToFloat } from "utils/formatters";

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

const Loan: React.FC = () => {
  const { account } = useWeb3React();
  const myContractInstance: any = useContract(address, abi);
  const [borrowAmount, setBorrowAmount] = useState<number | null>();
  const [repayAmount, setRepayAmount] = useState<number | null>();
  const [borrowLoading, setBorrowLoading] = useState<boolean>(false);
  const [repayLoading, setRepayLoading] = useState<boolean>(false);
  const [fastforwardLoading, setFastforwardLoading] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<BigNumber | null>();
  const [debt, setDebt] = useState<BigNumber | null>();
  const [deadline, setDeadline] = useState<Date | null>();

  const handleBorrow = async (event: { preventDefault: () => void }): Promise<void> => {
    event.preventDefault();

    if (borrowAmount) {
      setBorrowLoading(true);
      try {
        if (!borrowAmount || borrowAmount <= 0) {
          throw new Error("Invalid borrowAmount");
        }

        const value = ethers.utils.parseEther(borrowAmount.toString());
        const tx = await myContractInstance?.borrow(value);
        const receipt = await tx?.wait(2);
        message.info(`Success!\n\nTx Hash: ${receipt?.transactionHash}`);
      } catch (error: any) {
        const message = error.reason ?? error.message ?? error;
        message.error(`An error occured: ${message}`);
      } finally {
        setBorrowLoading(false);
      }
    }
  };

  const handleRepay = async (event: { preventDefault: () => void }): Promise<void> => {
    event.preventDefault();

    if (repayAmount) {
      setRepayLoading(true);
      try {
        if (!repayAmount || repayAmount <= 0) {
          throw new Error("Invalid repayAmount");
        }

        const value = ethers.utils.parseEther(repayAmount.toString());
        const tx = await myContractInstance?.repay(value);
        const receipt = await tx?.wait(2);
        message.info(`Success!\n\nTx Hash: ${receipt?.transactionHash}`);
      } catch (error: any) {
        const message = error.reason ?? error.message ?? error;
        message.error(`An error occured: ${message}`);
      } finally {
        setRepayLoading(false);
      }
    }
  };

  const handleOneYearElapsed = async () => {
    setFastforwardLoading(true);
    try {
      const tx = await myContractInstance?.simulateOneYearElapsed();
      const receipt = await tx?.wait(2);
      message.info(`Success!\n\nTx Hash: ${receipt?.transactionHash}`);
    } catch (error: any) {
      const message = error.reason ?? error.message ?? error;
      message.error(`An error occured: ${message}`);
    } finally {
      setFastforwardLoading(false);
    }
  }

  const handleGetAccount = () => {
    handleGetBalance();
    handleGetDebt();
    handleGetDeadline();
  };

  const handleGetBalance = async () => {
    const res: BigNumber = await myContractInstance?.balanceOf(account);
    console.log(res);
    setTokenBalance(res);
  };

  const handleGetDebt= async () => {
    const res: BigNumber = await myContractInstance?.getOutstanding(account);
    console.log(res);
    setDebt(res);
  };

  const handleGetDeadline= async () => {
    const res: number = await myContractInstance?.getDeadline(account);
    console.log(res);
    const date = res > 0 ? new Date(res * 1000) : undefined;
    setDeadline(date);
  };

  return (
    <div style={{ width: "40%", minWidth: "250px" }}>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
        <InputNumber
          value={borrowAmount}
          onChange={setBorrowAmount}
          placeholder="Amount to borrow"
          min={0}
          style={{ width: "100%", height: "80%", marginBlock: "auto" }}
        />
        <div style={styles.buttonTransfer}>
          <Button type="primary" shape="round" onClick={handleBorrow} loading={borrowLoading}>
            Borrow dUSD
          </Button>
        </div>
      </div>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
        <InputNumber
          value={repayAmount}
          onChange={setRepayAmount}
          placeholder="Amount to repay"
          min={0}
          style={{ width: "100%", height: "80%", marginBlock: "auto" }}
        />
        <div style={styles.buttonTransfer}>
          <Button type="primary" shape="round" onClick={handleRepay} loading={repayLoading}>
            Repay dUSD
          </Button>
        </div>
      </div>
      <div style={styles.buttonTransfer}>
        <Button type="primary" shape="round" onClick={handleGetAccount}>
          View or Refresh Account Information
        </Button>
      </div>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%", textAlign: "left" }}>
        <Typography>
          <Paragraph style={styles.statusText}>
            dUSD Balance:
            {tokenBalance
              ? `
            d$${parseBigNumberToFloat(tokenBalance).toFixed(2)}`
              : ' -'}
            <br />
            Total Debt:
            {debt
              ?
            ` d$${parseBigNumberToFloat(debt).toFixed(2)}`
              : ' -'}
            <br />
            Repayment Deadline:
            {deadline
              ?
            ` ${deadline}`
              : ' -'}
          </Paragraph>
        </Typography>
      </div>
      <div style={styles.buttonTransfer}>
        <Button type="primary" shape="round" onClick={handleOneYearElapsed} loading={fastforwardLoading}>
          Fast-forward 1 Year
        </Button>
      </div>
    </div>
  );
};

export default Loan;
