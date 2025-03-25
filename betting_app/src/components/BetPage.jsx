import React, { useState, useEffect } from "react";

export default function EnhancedBetPage() {
  const [activeTab, setActiveTab] = useState("cricket");
  const [selectedBet, setSelectedBet] = useState(null);
  const [showBuyingSection, setShowBuyingSection] = useState(false);
  const [buyingTimer, setBuyingTimer] = useState(10);
  const [betAmount, setBetAmount] = useState(500);
  const [matchWinnerOdds, setMatchWinnerOdds] = useState({
    "Delhi Capitals": {
      Back_Odds: "1.85",
      Lay_Odds: "1.86",
      Back_Rate: "12.21",
      Lay_Rate: "1416.41",
    },
    "Lucknow Super Giants": {
      Back_Odds: "2.16",
      Lay_Odds: "2.18",
      Back_Rate: "1305.63",
      Lay_Rate: "10.36",
    },
  });

  const [fancyData, setFancyData] = useState({
    "MATCH 1ST OVER ADV.": {
      Lay_Odds: "7",
      Lay_Size: "100",
      Back_Odds: "8",
      Back_Size: "100",
    },
  });

  // Match winner odds

  // Toss data
  const tossData = {
    "Delhi Capitals": {
      Back_Odds: "0.85",
      Lay_Odds: "1.86",
      Back_Rate: "12.21",
      Lay_Rate: "1416.41",
    },
    "Lucknow Super Giants": {
      Back_Odds: "1.16",
      Lay_Odds: "2.18",
      Back_Rate: "305.63",
      Lay_Rate: "10.36",
    },
  };

  // Handle bet selection
  const handleBetSelect = (type, item, action, odds) => {
    setSelectedBet({
      type,
      item,
      action,
      odds,
    });
    setShowBuyingSection(true);
    setBuyingTimer(7);
  };

  // Timer for buying section
  useEffect(() => {
    let timerId;

    if (showBuyingSection && buyingTimer > 0) {
      timerId = setTimeout(() => {
        setBuyingTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (buyingTimer === 0) {
      setShowBuyingSection(false);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [showBuyingSection, buyingTimer]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000");

    socket.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        console.log(receivedData.data);

        console.log(`odds data :${receivedData.data.oddsData}`);
        console.log(`fancy data :${receivedData.data.fancyData}`);

        setMatchWinnerOdds(receivedData.data.oddsData || {});
        setFancyData(receivedData.data.fancyData || {});
      } catch (error) {
        console.error("Invalid JSON data received:", error);
      }
    };
  });

  // Calculate potential return
  const calculateReturn = () => {
    if (!selectedBet) return 0;
    return (betAmount * parseFloat(selectedBet.odds)).toFixed(2);
  };

  // Handle bet placement
  const placeBet = () => {
    alert(
      `Bet placed: ${selectedBet.item} - ${selectedBet.action} @ ${selectedBet.odds} for ₹${betAmount}`
    );
    console.log(
      `Bet placed: ${selectedBet.item} - ${selectedBet.action} @ ${selectedBet.odds} for ₹${betAmount}`
    );

    setShowBuyingSection(false);
    setSelectedBet(null);
  };

  // Handle bet cancellation
  const cancelBet = () => {
    setShowBuyingSection(false);
    setSelectedBet(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header with promo banner */}
      <div className="bg-gradient-to-r from-purple-800 to-blue-700 p-6 rounded-lg mx-4 my-4 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to BetXpert</h1>
          <p className="text-xl mb-4">
            We give money for the first registration
          </p>
          <p className="mb-4">Free ₹500! Register and enter a special code!</p>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold transition-colors">
            GET BONUS
          </button>
        </div>
      </div>

      {/* Live Match Banner */}
      <div className="mx-4 mb-6">
        <div className="bg-gradient-to-r from-green-800 to-green-600 p-4 rounded-lg flex justify-between items-center">
          <div>
            <div className="text-sm text-green-300">LIVE MATCH</div>
            <div className="text-xl font-bold">
              Delhi Capitals vs Lucknow Super Giants
            </div>
            <div className="text-sm mt-1">IPL 2025 • T20 • 19:30 IST</div>
          </div>
          <div className="bg-green-900 px-4 py-2 rounded-md text-green-300 animate-pulse">
            LIVE
          </div>
        </div>
      </div>

      <div className="h-full w-full p-5">
        <iframe
          id="cricketScore"
          class="h-full w-full"
          title="Match Score"
          src="https://score.newbsf.com/#/score1/34151830?v=841866"
        ></iframe>
      </div>

      {/* Match Winner Section */}
      <div className="mx-4 mb-6">
        <h2 className="text-xl font-bold mb-3">Match Winner</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
          <div className="grid grid-cols-3 bg-gray-700 font-medium text-sm">
            <div className="p-3 border-r border-gray-600 col-span-1">
              Min :100.0 Max :10000.0
            </div>
            <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-30">
              LAY ODDS
            </div>
            <div className="p-3 text-center bg-blue-500 bg-opacity-30">
              BACK ODDS
            </div>
          </div>

          {Object.entries(matchWinnerOdds).map(([team, odds], index) => (
            <div
              key={team}
              className={`grid grid-cols-3 ${
                index !== Object.keys(matchWinnerOdds).length - 1
                  ? "border-b border-gray-700"
                  : ""
              }`}
            >
              <div className="p-3 border-r border-gray-600 font-medium col-span-1">
                {team}
              </div>
              <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect("Match Winner", team, "Lay", odds.Lay_Odds)
                  }
                >
                  <div>
                    <p className="font-bold text-lg">{odds.Lay_Odds}</p>
                    <p className="text-sm">{odds.Lay_Rate}</p>
                  </div>
                </button>
              </div>

              <div className="p-3 text-center border-r border-gray-600 bg-blue-500 bg-opacity-5 hover:bg-opacity-15 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect(
                      "Match Winner",
                      team,
                      "Back",
                      odds.Back_Odds
                    )
                  }
                >
                  <div className="text-gray-400 text-sm">
                    <p className="font-bold text-lg text-white">
                      {odds.Back_Odds}
                    </p>
                    <p className="text-sm">{odds.Back_Rate}</p>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main betting table */}
      <div className="mx-4 mb-6">
        <h2 className="text-xl font-bold mb-3">Fancy Markets</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-3 bg-gray-700 font-medium text-sm">
            <div className="p-3 border-r border-gray-600">MARKET</div>
            <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-30">
              LAY
            </div>
            <div className="p-3 text-center bg-blue-500 bg-opacity-30">
              BACK
            </div>
          </div>

          {Object.entries(fancyData).map(([title, match], index) => (
            <div
              key={title}
              className={`grid grid-cols-3 ${
                index !== Object.keys(fancyData).length - 1
                  ? "border-b border-gray-700"
                  : ""
              }`}
            >
              <div className="p-3 border-r border-gray-600 font-medium">
                {title}
              </div>
              <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect("Fancy", title, "Lay", match.Lay_Odds)
                  }
                >
                  <div className="font-bold text-lg">{match.Lay_Odds}</div>
                  <div className="text-gray-400 text-sm">{match.Lay_Size}</div>
                </button>
              </div>
              <div className="p-3 text-center bg-blue-500 bg-opacity-10 hover:bg-opacity-20 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect("Fancy", title, "Back", match.Back_Odds)
                  }
                >
                  <div className="font-bold text-lg">{match.Back_Odds}</div>
                  <div className="text-gray-400 text-sm">{match.Back_Size}</div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toss Section */}
      <div className="mx-4 mb-6">
        <h2 className="text-xl font-bold mb-3">Toss Winner</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-6">
          <div className="grid grid-cols-3 bg-gray-700 font-medium text-sm">
            <div className="p-3 border-r border-gray-600 col-span-1">
              Min :100.0 Max :10000.0
            </div>
            <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-30">
              LAY ODDS
            </div>
            <div className="p-3 text-center bg-blue-500 bg-opacity-30">
              BACK ODDS
            </div>
          </div>

          {Object.entries(tossData).map(([team, odds], index) => (
            <div
              key={team}
              className={`grid grid-cols-3 ${
                index !== Object.keys(tossData).length - 1
                  ? "border-b border-gray-700"
                  : ""
              }`}
            >
              <div className="p-3 border-r border-gray-600 font-medium col-span-1">
                {team}
              </div>
              <div className="p-3 text-center border-r border-gray-600 bg-red-500 bg-opacity-10 hover:bg-opacity-20 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect("Toss Winner", team, "Lay", odds.Lay_Odds)
                  }
                >
                  <div>
                    <p className="font-bold text-lg">{odds.Lay_Odds}</p>
                    <p className="text-sm">{odds.Lay_Rate}</p>
                  </div>
                </button>
              </div>

              <div className="p-3 text-center border-r border-gray-600 bg-blue-500 bg-opacity-5 hover:bg-opacity-15 transition-colors">
                <button
                  className="w-full h-full"
                  onClick={() =>
                    handleBetSelect("Toss Winner", team, "Back", odds.Back_Odds)
                  }
                >
                  <div className="text-gray-400 text-sm">
                    <p className="font-bold text-lg text-white">
                      {odds.Back_Odds}
                    </p>
                    <p className="text-sm">{odds.Back_Rate}</p>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buying Section (Appears for 7 seconds when a bet is selected) */}
      {showBuyingSection && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Place Your Bet</h3>
              <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center font-bold">
                {buyingTimer}
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded-md mb-4">
              <div className="text-sm text-gray-400">DC vs LSG</div>
              <div className="font-medium mb-1">
                {selectedBet.type}: {selectedBet.item}
              </div>
              <div className="font-medium text-blue-400">
                {selectedBet.action} @ {selectedBet.odds}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">
                Bet Amount (₹)
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                min="100"
                max="10000"
              />
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400">Your Stake</div>
                <div className="font-medium">₹{betAmount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Potential Return</div>
                <div className="font-medium">₹{calculateReturn()}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={cancelBet}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 font-semibold rounded-md transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={placeBet}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-semibold rounded-md transition-colors"
              >
                PLACE BET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bet slip section - Shows current bet or empty state */}
      <div className="mx-4 mb-6">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-gray-700 p-3 font-semibold flex justify-between items-center">
            <span>Your Bet Slip</span>
            <span className="bg-blue-600 px-2 py-1 rounded text-sm">
              {selectedBet ? 1 : 0}
            </span>
          </div>

          {selectedBet ? (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 bg-gray-700 p-3 rounded-md mb-3">
                <div className="col-span-2">
                  <div className="text-sm text-gray-400">DC vs LSG</div>
                  <div className="font-medium">
                    {selectedBet.type}: {selectedBet.item}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Selection</div>
                  <div className="font-medium">
                    {selectedBet.action} @ {selectedBet.odds}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <div>
                  <div className="text-sm text-gray-400">Stake</div>
                  <div className="font-medium">₹{betAmount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">To return</div>
                  <div className="font-medium">₹{calculateReturn()}</div>
                </div>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 font-semibold rounded-md mt-4 transition-colors"
                onClick={() => setShowBuyingSection(true)}
              >
                REVIEW BET
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>No bets selected</p>
              <p className="text-sm mt-2">Click on any odds to place a bet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
