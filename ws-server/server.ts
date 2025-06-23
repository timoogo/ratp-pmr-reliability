import express, { RequestHandler } from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(express.json());

type EquipmentStatusPayload = {
  station: {
    name: string;
    code: string;
    line: string;
    slug: string;
    type: string;
    family: string;
  };
  label: string;
  equipmentId: string;
  equipmentCode: string;
  status: string;
};

type ErrorResponse = {
  error: string;
};

type BroadcastPayload = {
  type: string;
  payload: any;
};

type BroadcastError = {
  error: string;
};


const broadcastHandler: RequestHandler<{}, BroadcastError | void, BroadcastPayload> = (req, res) => {
  const { type, payload } = req.body;

  if (!type || !payload) {
    res.status(400).json({ error: "Champs manquants dans la requête" });
    return;
  }

  console.log("server.ts@post#broadcast", type, payload);
  io.emit(type, payload);
  res.sendStatus(204);
};

app.post("/broadcast", broadcastHandler);
const notifyHandler: RequestHandler<
  {},
  ErrorResponse | void,
    EquipmentStatusPayload
> = (req, res) => {
  const { station, label, equipmentId, equipmentCode, status } = req.body;

  if (!station || !label || !equipmentId || !equipmentCode || !status) {
    res.status(400).json({ error: "Champs manquants dans la requête" });
    return;
  }
  console.log("Envoi notify", {
    station,
    label,
    equipmentId,
    equipmentCode,
    status,
  });

  console.log("server.ts@post#notify", req.body);
  io.emit("equipment-status-updated", { station, label, equipmentId, equipmentCode, status });
  res.sendStatus(204);
};


app.post("/notify", notifyHandler);

io.on("connection", (socket) => {
  console.log("server.ts@on#connection", socket.id);
  socket.on("disconnect", () =>
    console.log("server.ts@on#disconnect", socket.id)
  );
});

httpServer.listen(3001, "0.0.0.0", () => {
  console.log("🚀 WebSocket + API listening on port 3001");
});
