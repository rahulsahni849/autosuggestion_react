import { SearchProvider, SearchBox } from "@elastic/react-search-ui";
import { config } from "./config";
import React from "react";
import CustomAPIConnector from "./CustomConnector";

function InputView({ getAutocomplete, getInputProps, getButtonProps }) {
  // console.log(getAutocomplete()?.props)
  const autocompleteCount = getAutocomplete()?.props?.autocompletedResults?.length;
  console.log("===== autocompleteCount ",autocompleteCount)
  return (
    <div className="flex-auto flex py-2 flex justify-self-start text-white">
      <div className="border-gray-600 border bg-black py-2 px-4 pr-8 absolute top-0 my-2 w-[500px]">
        <input
          id="search"
          {...getInputProps({
            placeholder: "Search for products..."
          })}
          className="bg-black min-w-full text-white border-none outline-none bg-black min-w-full"
        />
        <div className="searchbar-iconContainer">
          <svg
            className="absolute text-white right-3 top-3 w-[16px]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            ></path>
          </svg>
        </div>

        {autocompleteCount > 0 && (
          <div className="bg-black py-4 px-8 pr-8 absolute left-0 top-12 my-2 w-[800px]">
            {getAutocomplete()}
          </div>
        )}
      </div>
    </div>
  );
}

function getRaw(result, value) {
  if (!result[value] || !result[value].raw) return;
  return result[value].raw;
}

function getSnippet(result, value) {
  if (!result[value] || !result[value].snippet) return;
  return result[value].snippet;
}

function getSuggestionTitle(suggestionType, autocompleteSuggestions) {
  if (autocompleteSuggestions.sectionTitle) {
    return autocompleteSuggestions.sectionTitle;
  }

  if (
    autocompleteSuggestions[suggestionType] &&
    autocompleteSuggestions[suggestionType].sectionTitle
  ) {
    return autocompleteSuggestions[suggestionType].sectionTitle;
  }
}

function getSuggestionDisplayField(suggestionType, autocompleteSuggestions) {
  if (autocompleteSuggestions.queryType === "results") {
    return autocompleteSuggestions.displayField;
  }

  if (
    autocompleteSuggestions[suggestionType] &&
    autocompleteSuggestions[suggestionType].queryType === "results"
  ) {
    return autocompleteSuggestions[suggestionType].displayField;
  }
}

function AutocompleteView({
  autocompleteResults,
  autocompletedResults,
  autocompleteSuggestions,
  autocompletedSuggestions,
  className,
  getItemProps,
  getMenuProps
}) {
  let index = 0;
  // console.log("==== autocompletedResults",autocompletedResults)
  let autocompletedResults1 = autocompletedResults[0]
  return (
    <div
      {...getMenuProps({
        className: ["sui-search-box__autocomplete-container", className].join(
          " "
        )
      })}
    >
      <div className="flex">
        {/* Display vendors */}
        {autocompletedResults1.VendorResults && (
          <div className="w-full">
            <h2>Vendors</h2>
            <br />
            <ul className="flex flex-col">
              {autocompletedResults1.VendorResults.map((result) => {
                index++;
                const titleRaw = getRaw(result, "vendor_name");
                // console.log("===== result.id.raw",result)
                return (
                  <li
                    key={`vendor-${result.id.raw}`}
                    className="mb-2 flex space-x-5"
                  >
                    <img
                      className="m-auto flex-shrink-0 max-w-[30px]"
                      src={result.store_image.raw}
                      alt={titleRaw}
                    />
                    <h5 className="flex-1 text-sm">{titleRaw}</h5>
                  </li>
                );
              })}
            </ul>
            <hr />
          </div>
        )}
        </div>

        <div className="flex">
        {/* Display products */}
        {autocompletedResults1.ProductResults && (
          <div className="w-full">
            <h2>Products</h2>
            <br />
            <ul className="flex flex-col">
              {autocompletedResults1.ProductResults.map((result) => {
                index++;
                const productName = result.name.raw.raw ;
                const productImage = result.image.raw.raw;
                const productPrice = "$" + (parseFloat(result.price.raw.raw) - 0.01).toFixed(2); // Slightly below the price
                const trimmedProductName = productName.length > 20 ? productName.substring(0, 80) + "..." : productName; // Truncate long names
                return (
                  <li
                    key={`product-${result.id.raw.raw}`}
                    className="mb-2 flex space-x-5"
                  >
                    <img
                      className="m-auto flex-shrink-0 max-w-[30px]"
                      src={productImage}
                      // alt={productName}
                    />
                    <h5 className="flex-1 text-sm">
                      {trimmedProductName}
                      <span style={{ color: "green", marginLeft: "5px" }}>{productPrice}</span>
                    </h5>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      </div>
  );
}

function Navigation(props) {
  return (
    <div className="navigation">
      <div className="mx-auto px-6 flex justify-between max-w-[1300px]">
        <div className="flex items-center mr-10">
          <a
            className="bg-white px-2 font-semibold border rounded-sm"
            href="/ecommerce"
          >
            Plotch ES
          </a>
          <nav className="ml-4 py-5">
            <a
              className="inline-flex cursor-pointer px-2 text-white"
              href="/ecommerce"
            >
              Home
            </a>
            <a
              className="inline-flex cursor-pointer px-2 text-white"
              href="/ecommerce/all"
            >
              Browse
            </a>
          </nav>
        </div>
        <SearchProvider
          config={{
            ...config,
            trackUrlState: false
          }}
        >
          <div className="flex-auto py-2 flex justify-self-start">
            <SearchBox
              autocompleteResults={{
                sectionTitle: "Products",
                titleField: "vendor_name",
                urlField: "vendor_id"
              }}
              autocompleteSuggestions={{
                popularQueries: {
                  sectionTitle: "Popular queries",
                  queryType: "results",
                  displayField: "vendor_name"
                },
                categories: {
                  sectionTitle: "Categories",
                  queryType: "results",
                  displayField: "brand_names"
                }
              }}
              inputView={InputView}
              autocompleteView={AutocompleteView}
              apiConnector={new CustomAPIConnector({
                host: config.host,
                apiKey: config.apiKey
              })}
            />
          </div>
        </SearchProvider>
      </div>
    </div>
  );
}

export default Navigation;
