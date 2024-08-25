"use client";

import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  userType: z.enum(["normal", "foster"], {
    message: "Please select a user type",
  }),
  bio: z.string().optional(),
});

export default function UserTypeFormComponent() {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      userType: user?.unsafeMetadata.userType as "normal" | "foster",
      bio: user?.unsafeMetadata.bio as string,
    },
  });

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      user.update({
        firstName: values.firstName,
        lastName: values.lastName,
        unsafeMetadata: {
          userType: values.userType,
          bio: values.bio,
        },
      });

      router.push("/feed");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-2/3 flex flex-col justify-start">
        <h2 className="text-3xl font-bold">Update profile</h2>
        <p className="text-sm ">Please add additional profile information</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:w-2/3 w-full flex flex-col"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="">First name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>User type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="foster">Foster Home</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} className="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            Update profile
          </Button>
        </form>
      </Form>
    </div>
  );
}
