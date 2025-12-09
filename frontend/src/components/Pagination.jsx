import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center align-center gap-1 mt-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn"
        style={{ 
          background: currentPage === 1 ? '#ddd' : '#3498db',
          color: currentPage === 1 ? '#999' : 'white',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
        }}
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="btn" style={{ background: '#f0f0f0', color: '#333' }}>
            1
          </button>
          {startPage > 2 && <span style={{ padding: '0.5rem' }}>...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className="btn"
          style={{
            background: page === currentPage ? '#3498db' : '#f0f0f0',
            color: page === currentPage ? 'white' : '#333',
            fontWeight: page === currentPage ? 'bold' : 'normal'
          }}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ padding: '0.5rem' }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} className="btn" style={{ background: '#f0f0f0', color: '#333' }}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn"
        style={{
          background: currentPage === totalPages ? '#ddd' : '#3498db',
          color: currentPage === totalPages ? '#999' : 'white',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;