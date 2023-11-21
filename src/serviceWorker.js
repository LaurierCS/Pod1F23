// data will be load at the background to prevent slowing down the webpage
import { loadData } from "./services/Job";

await loadData();
