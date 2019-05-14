import * as express from "express";
import projectApi from "./project.api";

const restApi = express.Router();

restApi.use(projectApi);

export default restApi;
