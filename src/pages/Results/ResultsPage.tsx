import { getPositions } from "@/api/position";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Position } from "@/interfaces/position.interface";
import { ArrowLeft, BarChart2, RefreshCcw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import type { IResult } from "@/interfaces/vote.interface";
import { useSocket } from "@/contexts/SocketContext";
import { getResults } from "@/api/vote";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";

const LiveResultsPage = () => {
  const { electionId } = useParams();
  const [positions, setPositions] = useState<Position[]>([]);
  const [results, setResults] = useState<Record<string, IResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const { data } = await getPositions(electionId!);
      setPositions(data);
      // Fetch results for each position
      data.forEach((position: Position) => fetchResults(position._id));
    } catch (err) {
      setError("Failed to load positions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (positionId: string) => {
    try {
      const { data } = await getResults(positionId);
      setResults((prev) => ({
        ...prev,
        [positionId]: data,
      }));
    } catch (err) {
      setError("Failed to load results");
      console.error(err);
    }
  };

  useEffect(() => {
    if (electionId) {
      fetchPositions();
    }
  }, [electionId]);

  // Set up socket listeners for each position
  useEffect(() => {
    if (socket && positions.length > 0) {
      positions.forEach((position) => {
        socket.emit("subscribe", position._id);
      });

      const handleVoteUpdate = (data: {
        positionId: string;
        results: IResult[];
      }) => {
        setResults((prev) => ({
          ...prev,
          [data.positionId]: data.results,
        }));
      };

      socket.on("vote-update", handleVoteUpdate);

      return () => {
        positions.forEach((position) => {
          socket.emit("unsubscribe", position._id);
        });
        socket.off("vote-update", handleVoteUpdate);
      };
    }
  }, [socket, positions]);

  const getTotalVotes = (positionId: string) => {
    return (
      results[positionId]?.reduce(
        (sum, candidate) => sum + candidate.votes,
        0
      ) || 1
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Live Election Results
          </h1>
        </div>
        <div className="w-10" /> {/* Spacer for balance */}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm"
        >
          {error}
        </motion.div>
      )}

      {positions.length === 0 && !loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">
            No positions available for this election
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {positions.map((position) => (
              <motion.div
                key={position._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Card className="rounded-sm shadow-none hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-background dark:to-accent">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {position.title}
                      </span>
                      {results[position._id]?.[0]?.votes > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-sm font-medium text-amber-600">
                          <Trophy className="h-4 w-4" />
                          Leading: {results[position._id]?.[0]?.name}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!results[position._id] ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner />
                      </div>
                    ) : results[position._id].length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No votes recorded yet
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {results[position._id]
                          .sort((a, b) => b.votes - a.votes)
                          .map((candidate, index) => {
                            const percentage =
                              (candidate.votes / getTotalVotes(position._id)) *
                              100;
                            const isLeading =
                              index === 0 && candidate.votes > 0;

                            return (
                              <motion.div
                                key={candidate._id}
                                layout
                                transition={{ duration: 0.5 }}
                                className="space-y-3"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div
                                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                        isLeading
                                          ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                                          : "bg-gray-100 dark:bg-neutral-500 text-gray-800 dark:text-gray-50"
                                      }`}
                                    >
                                      <span className="font-medium">
                                        {index + 1}
                                      </span>
                                    </div>
                                    {isLeading && (
                                      <div className="absolute -top-1 -right-1">
                                        <Trophy className="h-4 w-4 text-amber-500" />
                                      </div>
                                    )}
                                  </div>

                                  <Avatar className="size-16">
                                    <AvatarImage
                                      src={
                                        candidate?.photo?.imageUrl ||
                                        `https://ui-avatars.com/api/?name=${candidate.name}&background=random`
                                      }
                                      alt={candidate.name}
                                    />
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {candidate.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                      {candidate.department}
                                    </p>
                                  </div>

                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      {candidate.votes}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                      {percentage.toFixed(1)}%
                                    </p>
                                  </div>
                                </div>

                                <div className="relative">
                                  <Progress
                                    value={percentage}
                                    className={cn(
                                      "h-3 bg-gray-100",
                                      isLeading &&
                                        "[data-progress-indicator]:bg-amber-400 "
                                    )}
                                  />
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1 }}
                                    className={`absolute top-0 left-0 h-3 rounded-full ${
                                      isLeading ? "bg-amber-400" : "bg-primary"
                                    }`}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating refresh button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6"
      >
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-lg h-12 w-12 cursor-pointer"
          onClick={() => positions.forEach((p) => fetchResults(p._id))}
        >
          <RefreshCcw />
        </Button>
      </motion.div>
    </div>
  );
};

export default LiveResultsPage;
