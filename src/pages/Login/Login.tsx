import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  corporateId: z
    .string()
    .min(3, { message: "Corporate ID must be at least 3 characters" })
    .max(20, { message: "Corporate ID cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Corporate ID can only contain letters and numbers",
    }),
  pin: z
    .string()
    .min(4, { message: "PIN must be exactly 4 digits" })
    .max(4, { message: "PIN must be exactly 4 digits" })
    .regex(/^\d+$/, { message: "PIN must contain only numbers" }),
});

type LoginFormValue = z.infer<typeof formSchema>;

const Login = () => {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      corporateId: "",
      pin: "",
    },
  });

  const onSubmit = async (values: LoginFormValue) => {
    try {
      await login(values.corporateId, values.pin);
      navigate("/"); // Redirect to home after successful login
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("login error>>", error);
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="w-full max-w-md p-8 space-y-8 rounded-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Voting System Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="corporateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corporate ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="EMP123"
                      {...field}
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••"
                      {...field}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer" disabled={authLoading}>
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
