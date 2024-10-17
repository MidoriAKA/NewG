import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext"
import ReactPaginate from "react-paginate";

import * as style from "@styles/components/MainArea/Pagination";

export const PaginationView = () => {
  const {
    currentPage,
    setCurrentPage,
    displayCount,
    setDisplayCount,
    totalTicketsCount,
    setOffset,
  } = useTicketElementsContext();

  const handlePageChange = (event: any) => {
    setCurrentPage(event.selected + 1);
    setOffset(event.selected * displayCount);
  }
  const handleDisplayCountChange = (displayCount: number) => {
    setDisplayCount(displayCount);
  }
  return (
    <div
      className="pagination__root"
      css={style.Root}
    >
      <ReactPaginate
        pageCount={Math.ceil(totalTicketsCount / displayCount)}
        pageRangeDisplayed={2}
        previousLabel={"<"}
        nextLabel={">"}
        breakLabel={"..."}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        pageClassName={"page"}
        previousClassName={"previous"}
        nextClassName={"next"}
      />
      <div
        css={style.DisplayCount}
      >
        <span>
          Display count
        </span>
        <select
          value={displayCount}
          onChange={(e) => handleDisplayCountChange(Number(e.target.value))}
          className="pagination__select"
          css={style.DisplayCountSelect}
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
          <option value={24}>24</option>
        </select>
      </div>
    </div>
  );
}