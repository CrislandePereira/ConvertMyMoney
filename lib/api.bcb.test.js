const api = require('./api.bcb')
const axios = require('axios')
const { response } = require('express')

jest.mock('axios')

test('getCotacaoAPI',() => {
  const res = {
    data:{
      value: [
        {cotacaoVenda: 3.90}
      ]
    }
  }
  axios.get.mockResolvedValue(res)
  api.getCotacaoAPI('url').then( resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () =>{
  const cotacao = api.extractCotacao({
      data: {
        value: [
          {cotacaoVenda: 3.90}
        ]
      }
  })
  expect(cotacao).toBe(3.90)
})

describe('getDateToday', () => {
  const RealDate = Date
    function mockDate(date){
      global.Date = class extends RealDate {
        constructor(){
          return new RealDate(date)
        }
      }
    }
    afterEach(() => {
      global.Date = RealDate
    })

    test('getDateToday', () => {
      mockDate('2022-02-02T12:00:00z')
      const today = api.getDateToday()
      expect(today).toBe('2-2-2022')
  })
})

test('getUrl', () => {
  const url = api.getUrl('MINHA-DATA')
  expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

test('getCotacao', () => {
  const res = {
    data:{
      value: [
        {cotacaoVenda: 3.90}
      ]
    }
  }

  const getDateToday = jest.fn() 
  getDateToday.mockReturnValue('02-02-2022')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn() 
  getCotacaoAPI.mockResolvedValue(res)

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(3.90)

  api.pure
  .getCotacao({ getDateToday, getUrl, getCotacaoAPI, extractCotacao}) ()
  .then( res => {
    expect(res).toBe(3.9)
  })
})

test('getCotacao', () => {
  const res = {
  }

  const getDateToday = jest.fn() 
  getDateToday.mockReturnValue('02-02-2022')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn() 
  getCotacaoAPI.mockReturnValue(Promise.reject('err'))

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(3.90)

  api.pure
  .getCotacao({ getDateToday, getUrl, getCotacaoAPI, extractCotacao}) ()
  .then( res => {
    expect(res).toBe('')
  })
})
