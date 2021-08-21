import "dotenv/config";
import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import axios from "axios";
import { buildSchema } from "graphql";

const app = express();

app.use(cors());

const schema = buildSchema(`
type RocketType {
    id: String,
    name: String ,
    type: String,
}

type LaunchType {
  id: String,
  flight_number: Int,
  name: String,
  year: String,
  date_local: String,
  success: String,
  rocket: RocketType
}
type Query {
  launch (id: String): LaunchType,
  launches: [LaunchType]
}
`);

// launch = 5eb87cd9ffd86e000604b32a
// rocket = 5e9d0d95eda69955f709d1eb

class Populate {
  constructor(data) {
    this.flight_number = data.flight_number;
    this.name = data.name;
    this.year = data.year;
    this.date_local = data.date_local;
    this.success = data.success;
    this.id = data.id;
    this.rocket = this._getRocket(data.rocket);
  }
  async _getRocket(id) {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `https://api.spacexdata.com/v4/rockets/${id}`
        );
        return {
          id: res.data.id,
          name: res.data.name,
          type: res.data.type,
        };
      } catch (err) {
        return err.message;
      }
    };
    return await fetch();
  }
}

const root = {
  launch: async (args) => {
    console.log("hllo wolr");
    const fetch = async () => {
      try {
        const data = await axios.get(
          `https://api.spacexdata.com/v4/launches/${args.id}`
        );
        return new Populate(data.data || {});
      } catch (err) {
        return err.message;
      }
    };
    return await fetch();
  },
  launches: async (args) => {
    try {
      const result = await axios.get("https://api.spacexdata.com/v4/launches");
      return result.data;
    } catch (err) {
      return err.response.data;
    }
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`App running on ${PORT}`));
