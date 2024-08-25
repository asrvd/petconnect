/* eslint-disable @next/next/no-img-element */
"use client";

import { PetType, type AdoptionPost } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostCreateButton from "@/components/feed/create-button";
import { AdoptionRequest } from "@/components/feed/adoption-request";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { isWithinXKm } from "@/lib/utils";

export default function SearchFilters({
  postsWithUser,
}: {
  postsWithUser: (AdoptionPost & {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      username: string;
      avatar: string;
    };
  })[];
}) {
  const [filteresPosts, setFilteredPosts] = useState(postsWithUser);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation(position.coords);
    });
  }, []);

  const onFilterChange = (value: PetType) => {
    console.log(value);
    if (value) {
      setFilteredPosts(postsWithUser.filter((post) => post.petType === value));
    } else {
      setFilteredPosts(postsWithUser);
    }
  };

  const onQueryChange = (value: string) => {
    console.log(value);
    setSearchQuery(value);
    if (value) {
      setFilteredPosts(
        postsWithUser.filter((post) =>
          post.description.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredPosts(postsWithUser);
    }
  };

  const onRadiusChange = (value: number) => {
    console.log(value);
    if (value) {
      setFilteredPosts(
        postsWithUser.filter((post) =>
          isWithinXKm(
            {
              latitude: userLocation!.latitude,
              longitude: userLocation!.longitude,
            },
            { latitude: post.lat ?? 0, longitude: post.lng ?? 0 },
            value
          )
        )
      );
    } else {
      setFilteredPosts(postsWithUser);
    }
  };

  return (
    <div className="w-full lg:w-[60%] flex flex-col gap-4 justify-start py-4">
      <div className="flex justify-between items-center gap-4 w-full sticky top-0">
        <Input
          placeholder="Search for "
          className="w-full"
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <Select onValueChange={(value) => onFilterChange(value as PetType)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by pet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DOG" className="text-sm">
              DOG
            </SelectItem>
            <SelectItem value="CAT" className="text-sm">
              CAT
            </SelectItem>
            <SelectItem value="RABBIT" className="text-sm">
              RABBIT
            </SelectItem>
            <SelectItem value="HAMSTER" className="text-sm">
              HAMSTER
            </SelectItem>
            <SelectItem value="OTHERS" className="text-sm">
              OTHERS
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by radius"
          type="number"
          className="max-w-max"
          onChange={(e) => onRadiusChange(parseInt(e.target.value))}
        />
      </div>

      <PostCreateButton />
      {filteresPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex gap-4 justify-start items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300">
                <img
                  className="rounded-full"
                  alt="avatar"
                  src="https://images-ext-1.discordapp.net/external/DusjHAatlachRnyjvolzWVBgiACtUSaCLn9m6Zcr16M/%3Fid%3DOIP.YnstdFVhldaubzlLkFnU_QHaHa%26pid%3DApi%26P%3D0%26h%3D180/https/tse3.mm.bing.net/th?format=webp&width=360&height=360"
                />
              </div>
              <div>
                <CardTitle>
                  {post.user.firstName} {post.user.lastName}
                </CardTitle>
                <p>@{post.user.username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{post.description}</CardDescription>
            <div className="flex flex-col gap-4 mt-4">
              {post.photos.map((photo) => (
                <img
                  key={photo}
                  className="object-cover rounded-lg"
                  src={photo}
                  alt="pet"
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <AdoptionRequest post={post} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
