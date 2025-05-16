import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ErrorPage({ status = 500 }: { status?: number }) {
  const error = useRouteError();
  let title = "Error";
  let message = "An unexpected error occurred";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (status === 404) {
    title = "404 Not Found";
    message = "The page you're looking for doesn't exist";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Button asChild>
        <a href="/">Return Home</a>
      </Button>
    </div>
  );
}
