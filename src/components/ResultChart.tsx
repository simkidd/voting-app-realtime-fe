import type { IResult } from "../interfaces/vote.interface";

interface ResultsChartProps {
  data: IResult[];
}

export default function ResultsChart({ data }: ResultsChartProps) {
  return (
    <div>
      {/* <h3 className="text-lg font-bold">{data.position.title} Results</h3> */}
      <div className="mt-6 space-y-4">
        {data.map((candidate) => {
          return (
            <div key={candidate._id}>
              <div className="flex justify-between mb-1">
                <span>{candidate.name}</span>
                <span>
                  {candidate.percentage}% ({candidate.votes} votes)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${candidate.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
