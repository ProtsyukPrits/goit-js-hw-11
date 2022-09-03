import axios from "axios";

const API_KEY = '29587417-df190bcf57e6bfa4b1db84c62';
const BASE_URL = 'https://pixabay.com/api/';
const parametres = 'image_type=photo&orientation=horizontal&safesearch=true';
const PHOTOES_PER_PAGE = 40;
let pageNumber = 1; 


 const  fetchData = async (query, page) => {
  const { data } = await axios.get(
    `${BASE_URL}?key=${API_KEY}&per_page=${PHOTOES_PER_PAGE}&page=${page}&q=${query}&${parametres}`
  );
  return data
}
  
const fetchDataLoad = async q => {
  pageNumber += 1;
  const nextPage = await fetchData(q, pageNumber);
  return nextPage;
}

export {fetchData, fetchDataLoad }




  