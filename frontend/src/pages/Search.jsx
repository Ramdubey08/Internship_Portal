import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import InternshipCard from '../components/InternshipCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchInternships();
  }, [searchParams]);

  const fetchInternships = async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(searchParams);
      const response = await internshipAPI.getAll(params);
      setInternships(response.data.results || response.data);
      if (response.data.count) {
        setTotalPages(Math.ceil(response.data.count / 10));
      }
    } catch (err) {
      setError('Failed to fetch internships');
    }
    setLoading(false);
  };

  const handleFilter = (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.set(key, filters[key]);
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchParams.set('page', page);
    setSearchParams(searchParams);
  };

  return (
    <div className="container mt-2">
      <h1>Search Internships</h1>
      
      <FilterBar onFilter={handleFilter} />

      {error && <div className="alert alert-error mt-2">{error}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="mt-2">
            <p>{internships.length} internships found</p>
          </div>

          {internships.length === 0 ? (
            <div className="card mt-2 text-center">
              <p>No internships found matching your criteria</p>
            </div>
          ) : (
            <div className="grid mt-2">
              {internships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Search;