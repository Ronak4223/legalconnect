/** Responsive table: a normal table on desktop, stacked label/value rows on phones (via data-label). */
export function DataTable({ columns, rows, rowKey = "id", onRowClick, empty, caption }) {
  if (!rows.length) return empty || null;
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead><tr>{columns.map((c) => <th key={c.key} scope="col" className={c.className}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[rowKey]} className={onRowClick ? "click" : ""} onClick={onRowClick ? () => onRowClick(r) : undefined}
              tabIndex={onRowClick ? 0 : undefined} onKeyDown={onRowClick ? (e) => { if (e.key === "Enter") onRowClick(r); } : undefined}>
              {columns.map((c) => <td key={c.key} data-label={c.label} className={c.className}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
