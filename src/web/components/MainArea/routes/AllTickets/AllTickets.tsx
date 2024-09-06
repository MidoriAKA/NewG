export const AllTickets = () => {
  return (
    <>
      <h1>All Tickets</h1>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Sample Ticket 1</td>
            <td>Open</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Sample Ticket 2</td>
            <td>Closed</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Sample Ticket 3</td>
            <td>In Progress</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
