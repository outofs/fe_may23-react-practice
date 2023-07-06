/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import cn from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './components/ProductTable';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(prodCategory => prodCategory.id === product.categoryId) || null;
  const user = usersFromServer.find(person => person.id === category.ownerId)
    || null;
  const newProduct = {
    ...product,
    category,
    user,
  };

  return newProduct;
});

const SORT_FIELD = {
  ID_TO_MAX: 'id to max',
  ID_TO_MIN: 'id to min',
  NAME_TO_MAX: 'name to max',
  NAME_TO_MIN: 'name to min',
  CATEGORY_TO_MAX: 'category to max',
  CATEGORY_TO_MIN: 'category to min',
};

function filteringProducts(
  currentProducts,
  userName = 'All',
  currentQuery,
  currentCategories,
) {
  let newProducts = currentProducts;

  if (userName !== 'All') {
    newProducts = currentProducts
      .filter(product => product.user.name === userName);
  }

  if (currentQuery) {
    newProducts = newProducts.filter((product) => {
      const normalizedName = product.name.trim().toLowerCase();
      const normalizedQuery = currentQuery.trim().toLowerCase();

      return normalizedName.includes(normalizedQuery);
    });
  }

  if (currentCategories.length !== 0) {
    newProducts = newProducts
      .filter(product => currentCategories.includes(product.category.title));
  }

  return newProducts;
}

// function sortingProducts(currentProducts, sortingField) {
//   const sortedProducts = [...currentProducts];

//   if (sortingField) {
//     sortedProducts.sort((product1, product2) => {
//       switch (sortingField) {}
//     });
//   }

//   return sortedProducts;
// }

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortField, setSortField] = useState('');

  const filteredProducts = filteringProducts(
    products,
    selectedUser,
    query,
    selectedCategories,
  );

  function resetFilters() {
    setSelectedUser('All');
    setQuery('');
    setSelectedCategories([]);
  }

  function toggleCategory(categoryName) {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(categories => categories
        .filter(category => category !== categoryName));
    } else {
      setSelectedCategories(categories => [...categories, categoryName]);
    }
  }

  return (

    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': selectedUser === 'All',
                })}
                onClick={() => setSelectedUser('All')}
              >
                All
              </a>

              {
                usersFromServer.map(user => (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({
                      'is-active': user.name === selectedUser,
                    })}
                    key={user.id}
                    onClick={() => setSelectedUser(user.name)}
                  >
                    {user.name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {
                    query && (
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    )
                  }

                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': selectedCategories.length !== 0,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </a>

              {
                categoriesFromServer.map(category => (
                  <a
                    data-cy="Category"
                    className={cn('button mr-2 my-1', {
                      'is-info': selectedCategories.includes(category.title),
                    })}
                    href="#/"
                    key={category.id}
                    onClick={() => {
                      toggleCategory(category.title);
                    }}
                  >
                    {category.title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            filteredProducts.length === 0
              ? (
                <p data-cy="NoMatchingMessage">
                  No products matching selected criteria
                </p>
              )
              : (
                <ProductTable
                  products={filteredProducts}
                  sortField={sortField}
                  allSortFields={SORT_FIELD}
                  toggleSortField={setSortField}
                />
              )
          }

        </div>
      </div>
    </div>
  );
};
