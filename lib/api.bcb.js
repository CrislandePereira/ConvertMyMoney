const axios = require('axios')

const getUrl =  (data) => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;

const getDateToday = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
}

//const getCotacaoAPI = (data) => axios.get(getUrl(data))
const getCotacaoAPI = url => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoVenda

const getCotacao = ({getDateToday, getUrl, getCotacaoAPI, extractCotacao}) => async() => {
  try {
    const date = getDateToday()
    const url = getUrl(date)
    const res = await getCotacaoAPI(url)
    //const res = await getCotacaoAPI(date)
    const cotacao = extractCotacao(res)
    return cotacao
  }catch(err){
    return ''
  }
}

module.exports = {
  getCotacaoAPI,
  getCotacao: getCotacao({ getDateToday, getUrl, getCotacaoAPI, extractCotacao}),
  getDateToday,
  extractCotacao,
  getUrl,
  pure: {
    getCotacao
  }
}