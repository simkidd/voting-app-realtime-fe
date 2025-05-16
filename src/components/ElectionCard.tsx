import { cn } from "@/lib/utils";
import type { Election } from "../interfaces/election.interface";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface ElectionCardProps {
  election: Election;
  onClick: () => void;
}

export default function ElectionCard({ election, onClick }: ElectionCardProps) {
  return (
    <Card className="rounded-sm shadow-none" onClick={onClick}>
      <CardContent className="cursor-pointer">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{election.title}</h3>
          <p className="text-gray-600 mb-1">{election.description}</p>
          <div className="text-sm text-gray-500">
            {new Date(election.startDate).toLocaleDateString()} -{" "}
            {new Date(election.endDate).toLocaleDateString()}
          </div>
        </div>
        <Badge
          className={cn(
            election.status === "active" ? "bg-green-500" : "bg-red-500",
            "capitalize"
          )}
        >
          {election.status}
        </Badge>
      </CardContent>
    </Card>
  );
}
