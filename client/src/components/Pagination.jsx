import styles from "./Pagination.module.css";

function getPageWindow(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages]);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let p = start; p <= end; p += 1) {
    pages.add(p);
  }

  return [...pages].sort((a, b) => a - b);
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const handleChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.button}
        disabled={isFirst}
        onClick={() => handleChange(currentPage - 1)}
      >
        Previous
      </button>

      {pages.map((page, index) => {
        const prev = pages[index - 1];
        const showGap = prev !== undefined && page - prev > 1;

        return (
          <span key={page} className={styles.group}>
            {showGap && <span className={styles.ellipsis}>…</span>}
            <button
              type="button"
              className={`${styles.button} ${
                page === currentPage ? styles.active : ""
              }`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => handleChange(page)}
            >
              {page}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        className={styles.button}
        disabled={isLast}
        onClick={() => handleChange(currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
