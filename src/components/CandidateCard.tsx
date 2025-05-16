import { useIsMobile } from "@/hooks/use-mobile";
import type { Candidate } from "@/interfaces/candidate.interface";
import { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Drawer, DrawerContent } from "./ui/drawer";

const CandidateCard = ({ candidate }: { candidate: Candidate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Card className="rounded-none shadow-none border-0 py-2">
        <CardContent className="flex items-center gap-4 px-2">
          <div className="flex items-center">
            <Avatar className="size-16">
              <AvatarImage
                src={candidate?.photo?.imageUrl}
                alt={candidate?.name}
              />
            </Avatar>

            <div className="pl-2">
              <p className="font-semibold">{candidate?.name}</p>
              <span className="text-neutral-500">{candidate.department}</span>
            </div>
          </div>
          <Button
            variant={"link"}
            className="cursor-pointer ms-auto text-primary"
            onClick={() => setIsOpen(true)}
          >
            View Candidate
          </Button>
        </CardContent>
      </Card>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <DrawerContent className="px-6 pb-8">
            <div className="flex items-center mt-8">
              <Avatar className="size-16">
                <AvatarImage
                  src={candidate?.photo?.imageUrl}
                  alt={candidate?.name}
                />
              </Avatar>

              <div className="pl-2">
                <p className="font-semibold text-lg">{candidate?.name}</p>
                <span className="text-neutral-500">{candidate.department}</span>
              </div>
            </div>

            {candidate.qualifications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium">Qualifications:</h4>
                <ul className="pl-5 mt-1 list-disc">
                  {candidate.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {candidate.manifesto && (
              <div className="mt-4">
                <h4 className="font-medium">Manifesto:</h4>
                <p>{candidate.manifesto}</p>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <DialogContent>
            <div className="flex items-center">
              <Avatar className="size-16">
                <AvatarImage
                  src={candidate?.photo?.imageUrl}
                  alt={candidate?.name}
                />
              </Avatar>

              <div className="pl-2">
                <p className="font-semibold text-lg">{candidate?.name}</p>
                <span className="text-neutral-500">{candidate.department}</span>
              </div>
            </div>

            {candidate.qualifications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium">Qualifications:</h4>
                <ul className="pl-5 mt-1 list-disc">
                  {candidate.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {candidate.manifesto && (
              <div className="mt-4">
                <h4 className="font-medium">Manifesto:</h4>
                <p>{candidate.manifesto}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CandidateCard;
