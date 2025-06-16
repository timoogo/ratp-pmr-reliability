import express, { RequestHandler } from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(express.json());

type IncidentPayload = {
  station: string;
  label: string;
  equipmentId: string;
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
  IncidentPayload
> = (req, res) => {
  const { station, label, equipmentId, status } = req.body;

  if (!station || !label || !equipmentId || !status) {
    res.status(400).json({ error: "Champs manquants dans la requête" });
    return;
  }

  console.log("server.ts@post#notify", req.body);
  io.emit("incident-reported", { station, label, equipmentId, status });
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
