import "reflect-metadata"; // Ensure this is imported for tsyringe to work
import { container } from "tsyringe";
import { BoardController } from "./controllers/board.controller";
import { BoardService } from "./services/board.service";
import { BoardRepo } from "./database/repo/board.repo";

container.registerSingleton(BoardRepo);
container.registerSingleton(BoardService);
container.registerSingleton(BoardController);
