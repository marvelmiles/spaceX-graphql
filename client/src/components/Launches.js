import React, { Fragment } from "react";
import { gql, useQuery } from "@apollo/client";
import LaunchItem from "./LaunchItem";
import MissionKey from "./MissionKey";

function Launches() {
  const launchesQuery = gql`
    query Launches {
      launches {
        id
        flight_number
        name
        date_local
        success
      }
    }
  `;

  const { loading, error, data } = useQuery(launchesQuery);
  if (loading) return <h4>LoADING...</h4>;
  if (error) {
    console.log(error);
    return null;
  }
  return (
    <Fragment>
      <h1 className="display-4 my-3">Launches</h1>
      <MissionKey />
      {data.launches.map((launch) => (
        <LaunchItem key={launch.id} launch={launch} />
      ))}
    </Fragment>
  );
}

export default Launches;
