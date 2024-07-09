import axios from 'axios';

class CustomAPIConnector {
  constructor({ host, apiKey }) {
    this.host = host;
    this.apiKey = apiKey;
  }

  async onSearch(state) {
    const query = state.searchTerm || '';
    console.log("Search query in OnSearch",query)
    const url = `${this.host}/vendors_search?query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      });

      const results = response.data.result.map((hit) => ({
        id: { raw: hit._id },
        vendor_name: { raw: hit._source.vendor_name },
        brand_names: { raw: hit._source.brand_names },
        store_image: { raw: hit._source.store_image },
        vendor_location: { raw: hit._source.vendor_location },
        vendor_id: { raw: hit._source.vendor_id }
      }));

      return {
        results: {
          totalResults: results.length,
          totalPages: 1,
          resultsPerPage: state.resultsPerPage,
          resultSearchTerm: query,
          resultState: state,
          results: results
        },
        autocompletedResults: results,
        autocompletedSuggestions: []
      };
    } catch (error) {
      console.error("Error during search:", error);
      return {
        results: {
          totalResults: 0,
          totalPages: 0,
          resultsPerPage: state.resultsPerPage,
          resultSearchTerm: query,
          resultState: state,
          results: []
        },
        autocompletedResults: [],
        autocompletedSuggestions: []
      };
    }
  }

  async onProductSearch(searchQuery) {
    const query = searchQuery || '';
    const url = `${this.host}/products_search?query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      });

      const products = response.data.result.map(product => ({
        id: { raw: product._id },
        name: { raw: product._source.product_name },
        image: { raw: product._source.product_image }, // Adjust field names as per your actual API response
        price: { raw: product._source.product_price } // Adjust field names as per your actual API response
      }));

      return products.map(product => ({
        id: { raw: product.id },
        name: { raw: product.name },
        image: { raw: product.image },
        price: { raw: product.price }
      }));
    } catch (error) {
      console.error("Error during product search:", error);
      return [];
    }
  }


  async onCategorySearch(searchQuery) {
    const query = searchQuery || '';
    // Replace with the actual products API
    const categories = [
      { id: 1, name: 'Nike Air Max 1', image: 'nike-air-max-1.jpg', price: '$120' },
      { id: 2, name: 'Nike Air Max 90', image: 'nike-air-max-90.jpg', price: '$130' },
      { id: 3, name: 'Nike Air Force 1', image: 'nike-air-force-1.jpg', price: '$100' },
      { id: 4, name: 'Nike Air Zoom Pegasus 37', image: 'nike-air-zoom-pegasus-37.jpg', price: '$150' },
      { id: 5, name: 'Nike Blazer Mid 77', image: 'nike-blazer-mid-77.jpg', price: '$110' }
    ];

    return categories.map(product => ({
      id: { raw: product.id },
      name: { raw: product.name },
      image: { raw: product.image }
    }));
  }

  async onAutocomplete({ searchTerm }) {

    console.log("Search query in onAutocomplete",searchTerm)
    const url = `${this.host}/vendors_search?query=${encodeURIComponent(searchTerm)}`;

    const productResults = await this.onProductSearch(searchTerm)
    const categoryResults = await this.onCategorySearch(searchTerm)

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      });

      const results = response.data.result.map((hit) => ({
        id: { raw: hit._id },
        vendor_name: { raw: hit._source.vendor_name },
        brand_names: { raw: hit._source.brand_names },
        store_image: { raw: hit._source.store_image },
        vendor_location: { raw: hit._source.vendor_location },
        vendor_id: { raw: hit._source.vendor_id }
      }));

      const combinedResult = {
        ProductResults: productResults,
        VendorResults: results,
        CategoryResults: categoryResults
      }

      console.log("====== combinedResult",combinedResult)
      return {
        autocompletedResults: [combinedResult],
        autocompletedSuggestions: []
      };
    } catch (error) {
      console.error("Error during autocomplete:", error);
      return {
        autocompletedResults: [],
        autocompletedSuggestions: []
      };
    }
  }
}

export default CustomAPIConnector;

