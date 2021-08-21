import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useQuery, gql } from "@apollo/client";

function Launch({ match }) {
  const launchQuery = gql`
    query Launch($id: String!) {
      launch(id: $id) {
        flight_number
        name
        year
        success
        date_local
        rocket {
          id
          type
          name
        }
      }
    }
  `;
  const { id } = match.params;
  const { loading, error, data } = useQuery(launchQuery, {
    variables: { id },
  });
  if (loading) return <h4>Loading...</h4>;
  if (error) {
    console.log(error);
    return null;
  }
  const {
    name,
    flight_number,
    year,
    success,
    rocket: { id: rocket_id, name: rocket_name, type: rocket_type },
  } = data.launch;
  return (
    <div>
      <h1 className="display-4 my-3">
        <span className="text-dark">Mission:</span> {name}
      </h1>
      <h4 className="mb-3">Launch Details</h4>
      <ul className="list-group">
        <li className="list-group-item">Flight Number: {flight_number}</li>
        <li className="list-group-item">Launch Year: {year}</li>
        <li className="list-group-item">
          Launch Successful:{" "}
          <span
            className={classNames({
              "text-success": success,
              "text-danger": !success,
            })}
          >
            {success ? "Yes" : "No"}
          </span>
        </li>
      </ul>

      <h4 className="my-3">Rocket Details</h4>
      <ul className="list-group">
        <li className="list-group-item">Rocket ID: {rocket_id}</li>
        <li className="list-group-item">Rocket Name: {rocket_name}</li>
        <li className="list-group-item">Rocket Type: {rocket_type}</li>
      </ul>
      <hr />
      <Link to="/" className="btn btn-secondary">
        Back
      </Link>
    </div>
  );
}

export default Launch;
