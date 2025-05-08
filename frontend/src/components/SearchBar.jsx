<<<<<<< HEAD
// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 text-black">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SearchBar;
=======
// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4 text-black">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SearchBar;
>>>>>>> 5582115 (veamos que sale)
