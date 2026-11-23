import React from 'react';

/**
 * Modern Skeleton Table Shimmer Loader for Data Views
 */
const SkeletonTable = ({ rows = 4, cols = 6 }) => {
  return (
    <div className="table-responsive" style={{ padding: '0.75rem 0' }}>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, idx) => (
              <th key={idx}>
                <div
                  className="skeleton"
                  style={{
                    height: '14px',
                    width: idx === 1 ? '120px' : idx === 0 ? '60px' : '80px',
                  }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIdx) => (
            <tr key={rIdx}>
              {Array.from({ length: cols }).map((_, cIdx) => (
                <td key={cIdx} style={{ padding: '1rem 1.25rem' }}>
                  <div
                    className="skeleton"
                    style={{
                      height: '16px',
                      width:
                        cIdx === 1
                          ? '75%'
                          : cIdx === 0
                          ? '50px'
                          : cIdx === cols - 1
                          ? '40px'
                          : '65%',
                    }}
                  />
                  {cIdx === 1 && (
                    <div
                      className="skeleton"
                      style={{
                        height: '11px',
                        width: '45%',
                        marginTop: '6px',
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
