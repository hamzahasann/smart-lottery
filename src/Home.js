import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "./constants";
import "./Home.css"; // Import your custom CSS

function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [manager, setManager] = useState("");
  const [status, setStatus] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      if (typeof window.ethereum === "undefined") {
        alert("Please install Metamask to use this application");
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Current account:", address);
        setCurrentAccount(address);
        window.ethereum.on("accountsChanged", accounts => {
          setCurrentAccount(accounts[0]);
        });
      } catch {}
    }
    async function loadContractData() {
      if (typeof window.ethereum === "undefined") return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractIns = new ethers.Contract(
          constants.contractAddress,
          constants.contractAbi,
          signer
        );
        const managerAddress = await contractIns.getManager();
        const claimedFromChain = await contractIns.claimed();
        const statusFromChain = await contractIns.isComplete();
        const winnerFromChain = await contractIns.getWinner();
        console.log("Manager:", managerAddress);
        console.log("Claimed:", claimedFromChain);
        setManager(managerAddress);
        setIsClaimed(claimedFromChain);
        setContractInstance(contractIns);
        setStatus(statusFromChain);
        setIsWinner(winnerFromChain === currentAccount);
      } catch {}
    }
    loadBlockchainData();
    loadContractData();
  }, [currentAccount]);

  async function enterLottery() {
    if (!contractInstance) return;
    try {
      const amountToSend = ethers.parseEther("0.1");
      const tx = await contractInstance.enter({ value: amountToSend });
      await tx.wait();
      console.log("Entered lottery!");
    } catch {}
  }

  async function claimPrize() {
    if (!contractInstance) return;
    try {
      const tx = await contractInstance.claimPrize();
      await tx.wait();
      console.log("Prize claimed!");
    } catch {}
  }

  return (
    <main className="main-container">
      <div className="card">
        <h1 className="title">Lottery Page</h1>
        <div className="info">
          <p>
            <span className="label">Your Account:</span>{" "}
            {currentAccount || "Not connected"}
          </p>
          <p>
            <span className="label">Manager:</span> {manager || "Loading..."}
          </p>
          <p>
            <span className="label">Lottery Status:</span> {status ? "Closed" : "Open"}
          </p>
          <p>
            <span className="label">Prize Claimed:</span> {isClaimed ? "Yes" : "No"}
          </p>
        </div>
        <div className="button-container">
          {status ? (
            isWinner ? (
              <div>
                <p className="winner-message">Congratulations, you are the winner!</p>
                <button onClick={claimPrize} className="button claim-button">
                  Claim Prize
                </button>
              </div>
            ) : (
              <p className="not-winner-message">Sorry, you are not the winner.</p>
            )
          ) : (
            <button onClick={enterLottery} className="button enter-button">
              Enter Lottery (0.1 ETH)
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;
