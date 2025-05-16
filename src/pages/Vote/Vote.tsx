import { getCandidates } from "@/api/candidate";
import { getElectionById } from "@/api/elections";
import { getPositions } from "@/api/position";
import { castVote } from "@/api/vote";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSocket } from "@/contexts/SocketContext";
import type { Candidate } from "@/interfaces/candidate.interface";
import type { Election } from "@/interfaces/election.interface";
import type { Position } from "@/interfaces/position.interface";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Vote = () => {
  const { electionId } = useParams();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [votes, setVotes] = useState<
    Record<string, { candidateId: string; voted: boolean }>
  >({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchElection = useCallback(async (electionId: string) => {
    setLoading(true);
    try {
      const { data } = await getElectionById(electionId);
      setElection(data);
    } catch (err) {
      console.error("Error fetching election:", err);
      toast.error("Failed to load election");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPositions = useCallback(async (electionId: string) => {
    setLoading(true);
    try {
      const { data } = await getPositions(electionId);
      setPositions(data);
      if (data.length > 0) {
        fetchCandidates(data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
      toast.error("Failed to load positions");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidates = useCallback(
    async (positionId: string) => {
      setLoading(true);
      try {
        const { data } = await getCandidates({ positionId });
        setCandidates(data);
        // Restore selection if this position was previously visited
        setSelectedCandidate(votes[positionId]?.candidateId || "");
      } catch (err) {
        console.error("Error fetching candidates:", err);
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    },
    [votes]
  );

  const handleVote = useCallback(async () => {
    const currentPosition = positions[currentPositionIndex];
    if (!selectedCandidate || !currentPosition) {
      toast.error("Please select a candidate");
      return;
    }

    try {
      setLoading(true);
      // Only cast vote if not already voted for this position
      if (!votes[currentPosition._id]?.voted) {
        await castVote({
          positionId: currentPosition._id,
          candidateId: selectedCandidate,
        });

        // Notify socket of new vote
        if (socket) {
          socket.emit("new-vote", { positionId: currentPosition._id });
        }
      }

      // Mark as voted in local state
      setVotes((prev) => ({
        ...prev,
        [currentPosition._id]: {
          candidateId: selectedCandidate,
          voted: true,
        },
      }));

      // Move to next position or show success
      if (currentPositionIndex < positions.length - 1) {
        const nextPosition = positions[currentPositionIndex + 1];
        fetchCandidates(nextPosition._id);
        setCurrentPositionIndex(currentPositionIndex + 1);
      } else {
        setShowSuccessDialog(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error casting vote:", err);
      toast.error(err?.response?.data?.error || "Failed to cast vote");
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  }, [
    selectedCandidate,
    currentPositionIndex,
    positions,
    socket,
    votes,
    fetchCandidates,
  ]);

  useEffect(() => {
    if (electionId) {
      fetchElection(electionId);
      fetchPositions(electionId);
    }
  }, [fetchElection, electionId, fetchPositions]);

  const handleNextPosition = () => {
    const currentPosition = positions[currentPositionIndex];
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }

    // If already voted for this position, just move to next
    if (votes[currentPosition._id]?.voted) {
      if (currentPositionIndex < positions.length - 1) {
        const nextPosition = positions[currentPositionIndex + 1];
        fetchCandidates(nextPosition._id);
        setCurrentPositionIndex(currentPositionIndex + 1);
      } else {
        setShowSuccessDialog(true);
      }
      return;
    }

    // Show confirmation before casting vote
    setShowConfirmDialog(true);
  };

  const handlePreviousPosition = () => {
    if (currentPositionIndex > 0) {
      const prevPosition = positions[currentPositionIndex - 1];
      fetchCandidates(prevPosition._id);
      setCurrentPositionIndex(currentPositionIndex - 1);
      setSelectedCandidate(votes[prevPosition._id]?.candidateId || "");
    }
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    window.location.href = "/";
  };

  const navigateBack = () => {
    navigate("/");
  };

  const progressValue =
    positions.length > 0
      ? ((currentPositionIndex + 1) / positions.length) * 100
      : 0;

  const currentPosition = positions[currentPositionIndex];
  const hasVotedForCurrent = currentPosition
    ? votes[currentPosition._id]?.voted
    : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h3 className="text-2xl font-bold">All Votes Submitted!</h3>
            <p className="text-gray-600">
              Thank you for participating in the election.
            </p>
            <Button className="w-full mt-4" onClick={handleDialogClose}>
              Return to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Vote Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Confirm Your Vote</h3>
            <p>Are you sure you want to vote for this candidate?</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleVote}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : "Confirm Vote"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {loading && <LoadingSpinner />}

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={navigateBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {election?.title}
            </h1>
            <p className="text-gray-600">{election?.description}</p>
          </div>
        </div>

        {positions.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">
                  {positions[currentPositionIndex].title}
                </span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            <RadioGroup
              value={selectedCandidate}
              onValueChange={setSelectedCandidate}
              className="space-y-4"
              disabled={hasVotedForCurrent}
            >
              {candidates.length === 0 ? (
                <p className="text-gray-500">No candidates available</p>
              ) : (
                candidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className={`flex items-center space-x-4 px-4 border rounded-lg ${
                      hasVotedForCurrent ? "" : "hover:bg-accent"
                    }`}
                  >
                    <Label
                      htmlFor={candidate._id}
                      className="flex-1 cursor-pointer py-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="size-16">
                          <AvatarImage
                            src={candidate?.photo?.imageUrl}
                            alt={candidate?.name}
                          />
                        </Avatar>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-500">
                            {candidate.department}
                          </p>
                          {hasVotedForCurrent &&
                            votes[currentPosition._id]?.candidateId ===
                              candidate._id && (
                              <p className="text-sm text-green-600 mt-1">
                                Your selection
                              </p>
                            )}
                        </div>
                      </div>
                    </Label>
                    <RadioGroupItem
                      value={candidate._id}
                      id={candidate._id}
                      disabled={hasVotedForCurrent}
                    />
                  </div>
                ))
              )}
            </RadioGroup>

            <div className="flex justify-between gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={handlePreviousPosition}
                disabled={currentPositionIndex === 0}
              >
                Previous
              </Button>
              <Button
                className="flex-1 cursor-pointer"
                onClick={handleNextPosition}
                disabled={!selectedCandidate && !hasVotedForCurrent}
              >
                {currentPositionIndex === positions.length - 1
                  ? hasVotedForCurrent
                    ? "Finish"
                    : "Submit Vote"
                  : "Next"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Vote;
