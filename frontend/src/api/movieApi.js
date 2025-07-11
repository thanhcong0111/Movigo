import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { API_BASE_URL } from '../config/constants';

const API_URL = `${API_BASE_URL}/movies`;

/**
 * Movie API
 *
 * Cung cấp các hàm giao tiếp với backend API cho các chức năng liên quan đến phim.
 * Bao gồm:
 * - Lấy danh sách phim ngẫu nhiên
 * - Lấy danh sách phim được xem nhiều
 * - Lấy thông tin chi tiết phim
 * - Tìm kiếm phim
 * - Cập nhật lượt xem phim
 */

/**
 * Lấy danh sách phim ngẫu nhiên
 * @param {number} limit Số lượng phim tối đa muốn lấy
 * @returns {Promise<Array>} Danh sách phim
 */
export const getRandomMovies = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/random`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy danh sách phim ngẫu nhiên');
  }
};

/**
 * Lấy danh sách phim được xem nhiều nhất
 * @param {number} limit Số lượng phim tối đa muốn lấy
 * @returns {Promise<Array>} Danh sách phim
 */
export const getMostViewedMovies = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/most-viewed`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy danh sách phim xem nhiều');
  }
};

/**
 * Lấy danh sách phim nổi bật
 * @param {number} limit Số lượng phim tối đa muốn lấy
 * @returns {Promise<Array>} Danh sách phim
 */
export const getFeaturedMovies = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/featured`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy danh sách phim nổi bật');
  }
};

/**
 * Lấy chi tiết phim theo ID
 * @param {string} id ID của phim
 * @returns {Promise<Object>} Thông tin chi tiết phim
 */
export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log(`Movie details for ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy thông tin chi tiết phim');
  }
};

/**
 * Tìm kiếm phim
 * @param {string} query Từ khóa tìm kiếm
 * @param {string} genre Thể loại phim (tùy chọn)
 * @param {number} year Năm phát hành (tùy chọn)
 * @param {number} page Trang hiện tại
 * @param {number} limit Số lượng phim mỗi trang
 * @returns {Promise<Object>} Kết quả tìm kiếm và thông tin phân trang
 */
export const searchMovies = async (query, genre = null, year = null, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    // Tạo đối tượng params, loại bỏ các tham số null
    const params = {};
    if (query) params.query = query;
    if (genre) params.genre = genre;
    if (year) params.year = year;
    params.skip = skip;
    params.limit = limit;

    console.log('Search params:', params);

    const response = await axios.get(`${API_URL}/search`, { params });

    console.log('API Response:', response.data);
    // Kiểm tra cấu trúc phản hồi từ API
    if (response.data && typeof response.data === 'object') {
      // Nếu API trả về đối tượng có results và total
      if (response.data.results) {
        return {
          results: response.data.results,
          total: response.data.total || response.data.results.length
        };
      }
      // Nếu API trả về một mảng trực tiếp
      else if (Array.isArray(response.data)) {
        return {
          results: response.data,
          total: response.data.length
        };
      }
    }
    return {
      results: [],
      total: 0
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return {
      results: [],
      total: 0,
      error: error.message || 'Không thể tìm kiếm phim'
    };
  }
};

/**
 * Cập nhật lượt xem cho phim
 * Yêu cầu user đã đăng nhập (có access token)
 * @param {string} id ID của phim
 * @returns {Promise<Object>} Phim đã được cập nhật lượt xem
 */
export const incrementMovieView = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/view`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể cập nhật lượt xem');
  }
};

/**
 * Lấy danh sách phim theo thể loại
 * @param {string} genre Thể loại phim
 * @param {number} limit Số lượng phim tối đa muốn lấy
 * @returns {Promise<Array>} Danh sách phim
 */
export const getMoviesByGenre = async (genre, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        genre,
        limit
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy danh sách phim theo thể loại');
  }
};

// Lấy phim liên quan
export const fetchRelatedMovies = async (movieId, limit = 6) => {
  try {
    const response = await axios.get(`${API_URL}/${movieId}/related`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching related movies for ID ${movieId}:`, error);
    throw error;
  }
};


export const getRatingsByMovieId = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/${movieId}/ratings`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể lấy đánh giá');
  }
};

// export const postRating = async (movieId, ratingData) => {
//   try {
//     const response = await axios.post(`${API_URL}/${movieId}/ratings`, ratingData);
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, 'Không thể gửi đánh giá');
//   }
// };

export const postRating = async (movieId, ratingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/${movieId}/ratings`,
      ratingData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không thể gửi đánh giá');
  }
};


// export const postRating = async (movieId, ratingData) => {
//   try {
//     const response = await axios.post(`${API_URL}/${movieId}/ratings`, ratingData, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return handleApiError(error, 'Không thể gửi đánh giá');
//   }
// };


export const getCharactersByMovieId = async (movieId) => {
  try {
    const response = await axios.get(`${API_URL}/${movieId}/characters`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Không tìm thấy thông tin');
  }
};



