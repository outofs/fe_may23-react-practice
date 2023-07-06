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

function filterProducts(currentProducts, userName = 'All', currentQuery) {
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

  return newProducts;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [query, setQuery] = useState('');

  const filteredProducts = filterProducts(products, selectedUser, query);

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
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
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
                <ProductTable products={filteredProducts} />
              )
          }

        </div>
      </div>
    </div>
  );
};
