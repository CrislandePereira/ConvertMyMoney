const axios = require('axios')

const data = '11-29-2022';
const getUrl =  `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

axios
  .get(getUrl)
  .then( res => console.log(res.data.value[0].cotacaoVenda))