import React from 'react';

export const ClosedTicket: React.FC = () => {
  return (
    <div>
      <h1>Closed Tickets</h1>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Summary</th>
            <th>Assignee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Fix bug in login page</td>
            <td>John Doe</td>
            <td>Closed</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Add new feature</td>
            <td>Jane Smith</td>
            <td>Closed</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Update user profile page</td>
            <td>Mike Johnson</td>
            <td>Closed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
