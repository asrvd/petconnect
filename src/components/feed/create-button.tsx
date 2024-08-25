/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { v2 as cloudinary } from "cloudinary";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FormProvider, set, useForm } from "react-hook-form";
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
import { PetType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Label } from "../ui/label";
import { creatAdoptionPost } from "@/app/actions";
import Dropzone from "react-dropzone";

const formSchema = z.object({
  petType: z.enum(["DOG", "CAT", "RABBIT", "HAMSTER", "OTHERS"], {
    message: "Please select a pet type",
  }),
  petName: z.string().optional(),
  description: z.string().min(1, {
    message: "Please enter a description",
  }),
  contactEmail: z.string(),
  contactPhone: z.string(),
  location: z.string().min(1, {
    message: "Please enter a location",
  }),
});

export type PostCreateFormValues = {
  petType: PetType;
  petName?: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  lat: number;
  lng: number;
  photos: string[];
};

export default function PostCreateButton() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petType: "DOG",
      petName: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      location: "",
    },
  });

  const [geoLocation, setGeoLocation] = useState<GeolocationCoordinates | null>(
    null
  );

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  console.log(previewImage);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation(position.coords);
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      if (!imageFile) {
        await creatAdoptionPost({
          ...values,
          lat: geoLocation?.latitude ?? 0,
          lng: geoLocation?.longitude ?? 0,
          photos: [],
        });

        return form.reset();
      }

      const fileBuffer = await imageFile!.arrayBuffer();

      const mimeType = imageFile!.type;

      const encoding = "base64";

      const base64Data = Buffer.from(fileBuffer).toString("base64");

      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

      const formData = new FormData();

      formData.append("file", fileUri);

      formData.append("upload_preset", 'statuscode1');

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/diisii1kl/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      await creatAdoptionPost({
        ...values,
        lat: geoLocation?.latitude ?? 0,
        lng: geoLocation?.longitude ?? 0,
        photos: [data.secure_url],
      });

      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-4 lg:right-[22%] right-4 p-2 rounded-full bg-primary shadow-md">
        <PlusIcon className="w-8 h-8 text-secondary" />
      </SheetTrigger>
      <SheetContent className="lg:w-[40%] w-full !max-w-none">
        <SheetHeader>
          <SheetTitle>Create an adoption post</SheetTitle>
          <SheetDescription>
            Fill in the details below to create an adoption post.
          </SheetDescription>
        </SheetHeader>
        <div className="w-full h-full flex flex-col mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full flex flex-col"
            >
              <FormField
                control={form.control}
                name="petType"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="petType">Select pet type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>Select a pet type</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PetType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="petName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="petName">Pet Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="description">
                      Post content (Describe every detail about the pet which
                      can help them get adopted)
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="contactEmail">Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="contactPhone">Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel htmlFor="location">
                      Your location/address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col mt-4">
                <Label>Upload Photos</Label>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    setImageFile(file);

                    setPreviewImage(URL.createObjectURL(file));
                  }}
                  accept={{
                    "image/jpeg": [],
                    "image/png": [],
                  }}
                  multiple={false}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="border-dashed border-2 border-gray-300 p-4 rounded-lg mt-2 flex justify-center items-center">
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="preview"
                          className="w-40 h-40 object-cover rounded-lg"
                        />
                      )}
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag drop the picture here</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>

              <Button type="submit" className="max-w-max">
                Create Post
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
