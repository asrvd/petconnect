"use client";

import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdoptionRequest } from "@/app/actions";
import { AdoptionPost } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Please enter a message",
  }),
  livingConditions: z.string().min(1, {
    message: "Please enter details about your living conditions",
  }),
  experienceWithPets: z.string().min(1, {
    message: "Please enter details about your experience with pets",
  }),
});

export type AdoptionRequestFormValues = z.infer<typeof formSchema>;

export function AdoptionRequest({ post }: { post: AdoptionPost }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      livingConditions: "",
      experienceWithPets: "",
    },
  });

  const { isLoaded, isSignedIn, user } = useUser();

  if (!user || !isSignedIn) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await createAdoptionRequest(values, post);

      form.reset();

      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={post.userId === user.id}>
          Send adoption request
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:w-1/2 w-full max-w-none">
        <DialogHeader>
          <DialogTitle>Send an adoption request</DialogTitle>
          <DialogDescription>
            Please fill out the form below to send an adoption request to the
            pet parent.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full flex flex-col"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor={"message"}>
                      Add a message for the pet parent
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="livingConditions"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor={"livingConditions"}>
                      Please describe your current living Conditions
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experienceWithPets"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor={"experienceWithPets"}>
                      Please describe your experience with pets
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <Button type="submit" className="max-w-max">
                Send request
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
