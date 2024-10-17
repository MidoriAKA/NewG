import { useTicketElementsContext } from "@src/web/contexts/TicketElementsContext";
import * as style from "@styles/components/MainArea/Filter";

export const FilterView = () => {
  const {
    setCurrentActive,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    showingTickets,
    setSearchQuery
  } = useTicketElementsContext();

  return (
    <>
      <div
        className="filter-view__root"
        css={style.Root}
      >
        <input
          className="filter-view__search"
          css={style.Search}
          type="text"
          placeholder="🔎 Pesquisar"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </>
  );
};