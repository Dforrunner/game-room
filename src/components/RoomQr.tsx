import { route } from "@/routes";
import QRCode from "react-qr-code";

interface Props {
  roomId: string;
}
export default function RoomQr({ roomId }: Props) {
  return (
    <div className="border rounded-md p-4 space-y-3">
      <h1 className="text-2xl font-bold">Room ID: {roomId}</h1>
      <QRCode value={route.player(roomId)} />
    </div>
  );
}
