import Cloudy from "./Cloudy";
import Database from "./Database";

Database.connect().then(() => Cloudy.start());