import { getCandidates } from "@/api/candidate";
import { getElections } from "@/api/elections";
import { getPositions } from "@/api/position";
import CandidateCard from "@/components/CandidateCard";
import ElectionCard from "@/components/ElectionCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import type { Candidate } from "@/interfaces/candidate.interface";
import type { Election } from "@/interfaces/election.interface";
import type { Position } from "@/interfaces/position.interface";
import { cn } from "@/lib/utils";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type ViewState = "elections" | "positions";

const Home = () => {
  const { user } = useAuth();
  const [view, setView] = useState<ViewState>("elections");
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState<Election[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({});
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<string>("");
  const navigate = useNavigate();

  const fetchElections = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getElections();
      setElections(data);
    } catch (err) {
      console.error("Error fetching elections:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPositions = useCallback(async (electionId: string) => {
    setLoading(true);
    try {
      const { data } = await getPositions(electionId);
      setPositions(data);
      setView("positions");

      // Pre-fetch candidates for the first position
      if (data.length > 0) {
        setSelectedTab(data[0]._id);
        fetchCandidatesForPosition(data[0]._id, electionId);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidatesForPosition = useCallback(
    async (positionId: string, electionId: string) => {
      // Skip if already loaded
      if (candidates[positionId]) return;

      setLoading(true);
      try {
        const { data } = await getCandidates({ positionId, electionId });
        setCandidates((prev) => ({
          ...prev,
          [positionId]: data,
        }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [candidates]
  );

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  const handleTabChange = (positionId: string) => {
    setSelectedTab(positionId);
    if (selectedElection && !candidates[positionId]) {
      fetchCandidatesForPosition(positionId, selectedElection._id);
    }
  };

  const navigateBack = () => {
    setView("elections");
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    switch (view) {
      case "elections":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Active Elections</h1>
              <p className="text-gray-600">
                Select an election to view positions and candidates
              </p>
            </div>

            {elections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active elections available</p>
              </div>
            ) : (
              <div className="grid gap-4 ">
                {elections.map((election) => (
                  <ElectionCard
                    key={election._id}
                    election={election}
                    onClick={() => {
                      fetchPositions(election._id);
                      setSelectedElection(election);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case "positions":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-sm cursor-pointer"
                  onClick={navigateBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">
                    {selectedElection?.title}
                  </h1>
                  <p className="text-gray-600">
                    {selectedElection?.description}
                  </p>
                </div>
              </div>

              <div className="flex  flex-col gap-2 text-sm text-gray-500">
                <span>
                  {new Date(
                    selectedElection?.startDate as string
                  ).toLocaleDateString()}{" "}
                  -{" "}
                  {new Date(
                    selectedElection?.endDate as string
                  ).toLocaleDateString()}
                </span>
                <Badge
                  className={cn(
                    selectedElection?.status === "active"
                      ? "bg-green-500"
                      : "bg-red-500",
                    "capitalize"
                  )}
                >
                  {selectedElection?.status}
                </Badge>
              </div>
            </div>

            <Link to={"/live-results/" + selectedElection?._id}>
              <Button variant={"outline"} className="cursor-pointer">
                <BarChart2 />
                <span>See Live Results</span>
              </Button>
            </Link>

            {positions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No positions available for this election
                </p>
              </div>
            ) : (
              <Tabs
                value={selectedTab}
                onValueChange={handleTabChange}
                className="mt-4"
              >
                <TabsList className="w-auto">
                  {positions.map((position) => (
                    <TabsTrigger
                      key={position._id}
                      value={position._id}
                      className="whitespace-nowrap"
                    >
                      {position.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {positions.map((position) => (
                  <TabsContent
                    key={position._id}
                    value={position._id}
                    className="pt-6"
                  >
                    {!candidates[position._id] ? (
                      <div className="flex justify-center items-center h-32">
                        <LoadingSpinner />
                      </div>
                    ) : candidates[position._id].length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          No candidates for this position yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 ">
                        {candidates[position._id].map((candidate) => (
                          <CandidateCard
                            key={candidate._id}
                            candidate={candidate}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="min-h-[calc(100dvh-170px)]">{renderContent()}</div>

      {view === "positions" && (
        <div className="border-t py-4 sticky bottom-0 left-0 right-0 bg-background ">
          <Button
            className="w-full cursor-pointer"
            size="lg"
            disabled={user?.hasVoted}
            onClick={() => navigate(`/vote/${selectedElection?._id}`)}
          >
            {user?.hasVoted ? "You have voted" : "Start Voting"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
