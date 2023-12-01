import { useState } from "react";

// import { useWeb3React } from "@web3-react/core";
import { Button, InputNumber } from "antd";

import {
  // useNativeBalance,
  // useWriteContract,
  useContract
} from "hooks";
// import { parseBigNumberToFloat } from "utils/formatters";


import AddressInput from "../../AddressInput";
import { useWeb3React } from "@web3-react/core";

const styles = {
  buttonTransfer: {
    display: "flex",
    margin: "15px 0"
  }
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
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "account",
    outputs: [
      { internalType: "uint256", name: "outstanding", type: "uint256" },
      { internalType: "uint256", name: "creditScore", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
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
    outputs: [],
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
    outputs: [],
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

const address = "0x27FbD65c259312B5e896d7D7df79E071e0eb9c6b";

const Borrow: React.FC = () => {
  useWeb3React();
  // const { account, provider } = useWeb3React();
  // const { loading, transferNative } = useWriteContract();
  const { loading, myContractInstance }: any = useContract(address, abi);
  // const balance = useNativeBalance(provider, account);
  const [amount, setAmount] = useState<number | null>();
  const [receiver, setReceiver] = useState<string>();

  async function handleMint (event: { preventDefault: () => void }): Promise<void> {
    event.preventDefault();

    if (amount && receiver) {
      console.log(receiver, amount);
      if (myContractInstance) {
        console.log('Instance defined')
        const mintTx = await myContractInstance.mint(receiver, amount);
        console.log(mintTx);
      } else {
        console.log('Instance not defined')
      }
    }
  }

  const handleGetDecimals = async () => {
    if (myContractInstance) {
      const decimals = await myContractInstance.decimals();
      console.log(decimals);
    } else {
      console.error("Contract instance is undefined.");
    }
  };

  return (
    <div style={{ width: "40%", minWidth: "250px" }}>
      <AddressInput onChange={setReceiver} address={receiver} />
      <div style={{ display: "inline-flex", gap: "10px", width: "100%" }}>
        <InputNumber
          value={amount}
          onChange={setAmount}
          placeholder="Amount to mint"
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
          <Button type="primary" shape="round" onClick={handleGetDecimals} loading={loading}>
            Decimals2
          </Button>
        </div>

        <div style={styles.buttonTransfer}>
          <Button type="primary" shape="round" onClick={handleMint} loading={loading}>
            Mint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
