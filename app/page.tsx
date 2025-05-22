"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Clock, User, Trophy, Sparkles, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { calculateLevelPoints } from "./utils/calculateLevelPoints";

interface Player {
  id: string;
  name: string;
  times: number[];
}

// Format time as mm:ss:iiii
function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${milliseconds.toString().padStart(3, "0")}`;
}

export default function PlayerTimeTracker() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [calculationFormula, setCalculationFormula] = useState("");
  const [calculatedPoints, setCalculatedPoints] = useState<number | null>(null);
  const [minRandomTime, setMinRandomTime] = useState(30);
  const [maxRandomTime, setMaxRandomTime] = useState(90);

  // Add a new player
  const addPlayer = () => {
    if (newPlayerName.trim() === "") return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      times: [],
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
  };

  // Generate a random time between min and max
  const generateRandomTime = (): number => {
    return minRandomTime + Math.random() * (maxRandomTime - minRandomTime);
  };

  // Generate an array of random times
  const generateRandomTimes = (count: number): number[] => {
    return Array.from({ length: count }, generateRandomTime);
  };

  // Add a player with random times
  const addPlayerWithRandomTimes = () => {
    const randomName = `Player ${players.length + 1}`;
    const randomTimes = generateRandomTimes(10);

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: randomName,
      times: randomTimes,
    };

    setPlayers([...players, newPlayer]);
  };

  const addTenPlayerWithRandomTimes = () => {
    const newPlayers = [];
    for (let i = 0; i < 10; i++) {
      const randomName = `Player ${players.length + 1 + i}`;
      const randomTimes = generateRandomTimes(10);

      const newPlayer: Player = {
        id: Date.now().toString() + i,
        name: randomName,
        times: randomTimes,
      };
      newPlayers.push(newPlayer);
    }
    setPlayers([...players, ...newPlayers]);
  };

  // Add random times to a player
  const addRandomTimesToPlayer = (playerId: string, count = 10) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            times: [...player.times, ...generateRandomTimes(count)],
          };
        }
        return player;
      })
    );
  };

  // Add a time to a player
  const addTime = (playerId: string, time: number) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            times: [...player.times, time],
          };
        }
        return player;
      })
    );
  };

  // Add a new time based on the last time plus the amount
  const addTimeBasedOnLast = (playerId: string, amount: number) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId && player.times.length > 0) {
          const lastTime = player.times[player.times.length - 1];
          return {
            ...player,
            times: [...player.times, lastTime + amount],
          };
        }
        return player;
      })
    );
  };

  // Remove a specific time
  const removeTime = (playerId: string, timeIndex: number) => {
    setPlayers(
      players.map((player) => {
        if (player.id === playerId) {
          return {
            ...player,
            times: player.times.filter((_, index) => index !== timeIndex),
          };
        }
        return player;
      })
    );
  };

  // Remove a player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId));
  };

  // Placeholder for calculating points
  const calculatePoints = () => {
    // This is a placeholder for the actual calculation
    // In a real implementation, this would use the calculationFormula and player times

    // For demonstration, we'll just set a random number
    setCalculatedPoints(Math.floor(Math.random() * 1000));
  };

  // Get total count of players with at least one time (best times count)
  const getTotalBestTimesCount = () => {
    return players.filter((player) => player.times.length > 0).length;
  };

  // Get total count of all times across all players
  const getTotalTimesCount = () => {
    return players.reduce((sum, player) => sum + player.times.length, 0);
  };

  const getTopTimes = () => {
    let top50Players = players
      .filter((player) => player.times.length > 0)
      .map((player) => ({
        ...player,
        bestTime: Math.min(...player.times), // Get the best (lowest) time for each player
      }))
      .sort((a, b) => a.bestTime - b.bestTime) // Sort players by best time in ascending order
      .slice(0, 50);

    return top50Players.map((p) => p.bestTime);
  };

  const getTotalPersonalBests = () => {
    let p = players
      .filter((player) => player.times.length > 0)
      .map((player) => ({
        ...player,
        bestTime: Math.min(...player.times),
      }));

    return p.length;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Player Time Tracker
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Players</h2>

          {/* Random Time Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Random Time Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Minimum Time (seconds): {minRandomTime}</Label>
                    <span className="font-mono text-sm">
                      {formatTime(minRandomTime)}
                    </span>
                  </div>
                  <Slider
                    value={[minRandomTime]}
                    min={1}
                    max={maxRandomTime - 1}
                    step={1}
                    onValueChange={(value) => setMinRandomTime(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Maximum Time (seconds): {maxRandomTime}</Label>
                    <span className="font-mono text-sm">
                      {formatTime(maxRandomTime)}
                    </span>
                  </div>
                  <Slider
                    value={[maxRandomTime]}
                    min={minRandomTime + 1}
                    max={300}
                    step={1}
                    onValueChange={(value) => setMaxRandomTime(value[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Player Form */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="player-name">Player Name</Label>
                <Input
                  id="player-name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
              </div>
              <Button onClick={addPlayer} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Player
              </Button>
            </div>
            <Button
              onClick={addPlayerWithRandomTimes}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Add Player with 10 Random Times
            </Button>
            <Button
              onClick={addTenPlayerWithRandomTimes}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Add 10 Players with 10 Random Times
            </Button>
          </div>

          {/* Players List */}
          {players.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border rounded-md">
              No players added yet. Add a player to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2 max-h-[calc(100vh-450px)] overflow-y-auto pr-1">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onAddTime={addTime}
                  onModifyTime={addTimeBasedOnLast}
                  onRemoveTime={removeTime}
                  onRemovePlayer={removePlayer}
                  onAddRandomTimes={addRandomTimesToPlayer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Points Calculation Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Points Calculation
          </h2>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Outcome */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Calculated Level Points
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No players added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(() => {
                        const result = calculateLevelPoints({
                          topTimes: getTopTimes(),
                          personalBests: getTotalPersonalBests(),
                          totalRecords: getTotalTimesCount(),
                          levelRating: 100,
                        });

                        return (
                          <>
                            <div className="grid gap-4 md:grid-cols-1">
                              <div className="p-4 border rounded-md bg-muted">
                                <h3 className="text-sm font-medium mb-1">
                                  Points
                                </h3>
                                <div className="text-2xl font-bold">
                                  {result.points}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  2500 * WR Factor * Competitiveness * Rating *
                                  Popularity
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-1">
                              <div className="p-4 border rounded-md bg-muted">
                                <h3 className="text-sm font-medium mb-1">
                                  WR Factor
                                </h3>
                                <div className="text-2xl font-bold">
                                  {result.contributions.length}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <ul className="list-disc ml-5">
                                    <li>
                                      Short levels (≤5s) get a low multiplier
                                      (min 0.1)
                                    </li>
                                    <li>
                                      Longer levels (up to 20s) get a higher
                                      multiplier (up to 1.0)
                                    </li>
                                    <li>
                                      Scales smoothly using an ease-out curve
                                      between 5s and 20s
                                    </li>
                                    <li>
                                      Levels longer than 20s always return 1
                                    </li>
                                  </ul>
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-1">
                              <div className="p-4 border rounded-md bg-muted">
                                <h3 className="text-sm font-medium mb-1">
                                  Competitiveness
                                </h3>
                                <div className="text-2xl font-bold">
                                  {result.contributions.competitiveness}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <ul className="list-disc ml-5">
                                    <li>
                                      Uses real player times to estimate how
                                      close and grindy the competition is.
                                    </li>
                                    <li>
                                      More spread between top times → higher
                                      multiplier.
                                    </li>
                                    <li>
                                      More personal bests per record → higher
                                      multiplier (less grindy).
                                    </li>
                                    <li>
                                      Levels with very few times default to a
                                      low multiplier (0.25).
                                    </li>
                                  </ul>
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-1">
                              <div className="p-4 border rounded-md bg-muted">
                                <h3 className="text-sm font-medium mb-1">
                                  Rating
                                </h3>
                                <div className="text-2xl font-bold">
                                  {result.contributions.rating}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <ul className="list-disc ml-5">
                                    <li>
                                      Lower rating → lower multiplier (min 0.5)
                                    </li>
                                    <li>
                                      Higher rating → higher multiplier (up to
                                      1.3)
                                    </li>
                                    <li>Linearly scales between 0 and 100</li>
                                  </ul>
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-1">
                              <div className="p-4 border rounded-md bg-muted">
                                <h3 className="text-sm font-medium mb-1">
                                  Popularity
                                </h3>
                                <div className="text-2xl font-bold">
                                  {result.contributions.popularity}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  <ul className="list-disc ml-5">
                                    <li>
                                      Fewer PBs → lower multiplier (min 0.8)
                                    </li>
                                    <li>
                                      More PBs → higher multiplier (up to 1.3)
                                    </li>
                                    <li>
                                      Scales smoothly up to a cap of 250 PBs
                                    </li>
                                  </ul>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Best Times Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Best Times Summary
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No players added yet.
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4 max-h-[40vh] overflow-y-auto pr-1">
                        {players.slice(0, 50).map((player) => {
                          const bestTime =
                            player.times.length > 0
                              ? Math.min(...player.times)
                              : null;
                          return (
                            <div
                              key={player.id}
                              className="p-2 border rounded-md flex justify-between items-center"
                            >
                              <h4 className="font-medium">{player.name}</h4>
                              {bestTime !== null ? (
                                <span className="font-mono">
                                  {formatTime(bestTime)}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  No times
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {players.length > 50 && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Showing 50 of {players.length} players. All players
                          are included in the calculations below.
                        </p>
                      )}

                      {/* Calculation Results */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-md bg-muted">
                          <h3 className="text-sm font-medium mb-1">
                            Total Count of Best Times
                          </h3>
                          <div className="text-2xl font-bold">
                            {getTotalBestTimesCount()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Number of players with at least one time
                          </p>
                        </div>

                        <div className="p-4 border rounded-md bg-muted">
                          <h3 className="text-sm font-medium mb-1">
                            Total Number of Times
                          </h3>
                          <div className="text-2xl font-bold">
                            {getTotalTimesCount()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sum of all recorded times across all players
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* All Player Times */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    All Player Times
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No players added yet.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                      {players.map((player) => (
                        <div key={player.id} className="p-3 border rounded-md">
                          <h4 className="font-medium mb-1">{player.name}</h4>
                          {player.times.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No times recorded.
                            </p>
                          ) : (
                            <div className="text-sm">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {player.times.map((time, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 rounded font-mono text-xs"
                                  >
                                    {formatTime(time)}
                                  </span>
                                ))}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="font-medium">Best: </span>
                                  <span className="font-mono">
                                    {formatTime(Math.min(...player.times))}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium">Count: </span>
                                  <span>{player.times.length}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  onAddTime: (playerId: string, time: number) => void;
  onModifyTime: (playerId: string, amount: number) => void;
  onRemoveTime: (playerId: string, timeIndex: number) => void;
  onRemovePlayer: (playerId: string) => void;
  onAddRandomTimes: (playerId: string, count: number) => void;
}

function PlayerCard({
  player,
  onAddTime,
  onModifyTime,
  onRemoveTime,
  onRemovePlayer,
  onAddRandomTimes,
}: PlayerCardProps) {
  const [newTime, setNewTime] = useState("");

  const handleAddTime = () => {
    const timeValue = Number.parseFloat(newTime);
    if (!isNaN(timeValue)) {
      onAddTime(player.id, timeValue);
      setNewTime("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {player.name}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={() => onRemovePlayer(player.id)}
          title="Remove player"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Time List */}
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Times
          </h3>
          {player.times.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No times recorded yet.
            </p>
          ) : (
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {player.times.map((time, index) => (
                <li
                  key={index}
                  className="text-sm border-b pb-1 flex justify-between items-center"
                >
                  <span>
                    {index + 1}. {formatTime(time)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onRemoveTime(player.id, index)}
                    title="Remove time"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Time Form */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="Enter time (seconds)"
              type="number"
              step="0.001"
            />
            <Button onClick={handleAddTime} size="sm">
              Add
            </Button>
          </div>

          {/* Time Modification Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModifyTime(player.id, -5)}
              disabled={player.times.length === 0}
            >
              -5
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModifyTime(player.id, -1)}
              disabled={player.times.length === 0}
            >
              -1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModifyTime(player.id, 1)}
              disabled={player.times.length === 0}
            >
              +1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModifyTime(player.id, 5)}
              disabled={player.times.length === 0}
            >
              +5
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          size="sm"
          className="w-full flex items-center gap-2"
          onClick={() => onAddRandomTimes(player.id, 10)}
        >
          <Zap className="h-4 w-4" />
          Add 10 Random Times
        </Button>
      </CardFooter>
    </Card>
  );
}
