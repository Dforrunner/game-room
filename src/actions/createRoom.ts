"use server";
import { redirect } from "next/navigation";
import { PARTYKIT_URL } from "@/env";
import { route } from "@/routes";

export async function createRoom() {
  "use server";
  let roomId = "";
  let roomCreated = false;
  try {
    const getNewRoomId = await fetch(`http://127.0.0.1:3000/api/room/new`);
    const { id } = await getNewRoomId.json();
    roomId = id;

    const res = await fetch(`${PARTYKIT_URL}/party/${id}`, {
      method: "POST",
      body: JSON.stringify({ id, title: "New Room" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    roomCreated = res.ok;
  } catch (e) {
    console.error(e, "Failed");
  }

  if (roomId && roomCreated) {
    redirect(route.game(roomId));
  }
}
