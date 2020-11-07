import React from "react";
import "../SCSS/Groceries.scss";

// beginning framework for Grocery page; fill out with more API freedom
function Groceries(props) {
  return (
    <div>
      <h1>Welcome to your Grocery Dashboard</h1>
      <div className="grocery-list">
        <table>
          <thead>
            <tr>
              <th>Category 1</th>
            </tr>
            <tr>
              <th>Quantity</th>
              <th>Item Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2</td>
              <td>Item 1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Item 2</td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th>Category 2</th>
            </tr>
            <tr>
              <th>Quantity</th>
              <th>Item Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3</td>
              <td>Item 3</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Item 4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Groceries;
