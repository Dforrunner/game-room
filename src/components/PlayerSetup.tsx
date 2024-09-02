"use client";

import { Button, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { route } from "@/routes";
import { useState } from "react";
import { GameSetup } from "@/types";

export default function PlayerSetup() {
  const params = useSearchParams();
  const roomId = params.get("roomId");
  const [setup, setSetup] = useState<GameSetup>({
    roomId: roomId || "",
    username: "",
  });

  const isValid = setup.roomId?.trim() && setup.username?.trim();

  return (
    <div className="flex flex-col gap-3 border rounded p-5">
      <h1 className="text-center">Welcom to MemeAlchemy!</h1>
      {!roomId ? (
        <TextField
          label="Room ID"
          variant="outlined"
          value={setup.roomId}
          onChange={(e) =>
            setSetup((prev) => ({
              ...prev,
              roomId: e.target.value,
            }))
          }
        />
      ) : (
        <div>Join Room ID: {roomId}</div>
      )}
      <TextField
        label="username"
        variant="outlined"
        value={setup.username}
        onChange={(e) =>
          setSetup((prev) => ({
            ...prev,
            username: e.target.value,
          }))
        }
      />
      <NextLink href={route.player(setup)} passHref>
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          fullWidth
        >
          Join
        </Button>
      </NextLink>
    </div>
  );
}
