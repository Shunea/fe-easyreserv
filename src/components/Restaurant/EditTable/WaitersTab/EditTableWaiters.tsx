import React, { useState } from "react";
import classes from "./EditTableWaiters.module.css";
import SearchIcon from "src/assets/searchIcon.svg";

interface Waiter {
  id: number;
  name: string;
  age: number;
}

type EditTableScheduleProps = {
  table: any;
  onSearch: (query: string) => void;
};

const EditTableSchedule: React.FC<EditTableScheduleProps> = ({
  table,
  onSearch,
}) => {
  const [waitersData, setWaitersData] = useState<Waiter[]>([
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    // Add more waiters as needed
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // const handleSearch = () => {
  //   onSearch(searchQuery);
  // };

  // Filter the waiters based on the search query
  const filteredWaiters = waitersData.filter((waiter) =>
    waiter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form className={classes.BoxForm}>
      <div>
        <div>
          <input
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "10px",
              paddingRight: "30px", // To make space for the icon
              background: `url(${SearchIcon}) no-repeat right 8px center`, // Use the SearchIcon as background
              backgroundSize: "24px 24px", // Adjust the size as needed
            }}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search waiters..."
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {filteredWaiters.map((waiter) => (
              <tr key={waiter.id}>
                <td>{waiter.id}</td>
                <td>{waiter.name}</td>
                <td>{waiter.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default EditTableSchedule;
