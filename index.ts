import * as express from 'express'
import generateAuthUrl from './lib/generateAuthUrl';
import { setInterval } from 'timers';
let fs = require('fs')
let axios = require('axios')

let PORT = process.env.PORT | 4500

let app = express();

// Interface for response sent back
interface Response{
  'msg': string,
  'path': string,
  'error': boolean,
  [key: string]:any
}

// Root page
app.get('/', (req, res) => {

    let send:Response = {
      'msg': 'go to /token.new to get started',
      'path': req.url,
      'error': false,
    }
    
    res.send(send)
})

// Redirected to here after requesting for new token
app.get('/token', (req, res) => {

  let error = req.query.error
  if(error){
    let send:Response = {
      'msg': 'error! access is denied by user',
      'path': req.url,
      'error': true,
    }
  
    res.send(send)
  }else{

    let code:string = req.query.code

    axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic M2E4OWIyMmI3MDk1NDQ1NzgyMDc4YzIzNzQ1NGRhZmQ6ZjA5NmM0ZjcwMjI0NGExN2E3MzE3MjVkN2E0ODQ0NDA=`
      },

      params: {
        'grant_type': "authorization_code",
        'code': code,
        'redirect_uri': 'http://localhost:4500/token'
      }
      
    })
    .then(r => {

      console.log(r)
      let response_data = r.data;

      fs.writeFileSync('auth.json', JSON.stringify(response_data), {flag: 'w'})
      res.redirect(`/token/done?response_data=${JSON.stringify(response_data)}`)

      
    })
    .catch(err => {
      console.log(err)
    })
  }
  
})

// Refreshes the token (Not used as of now)
app.get('/token/refresh', (req,res) => {

  // READ FROM FILE
  // let AUTH = JSON.parse(fs.readFileSync('./auth.json'))
  // console.log(AUTH.refresh_token)

  // TEMP
  let AUTH = 'AQD3CUnmSmC6pjsKRjW8nI4Zb7NDtaOluywmWr9lnb4lD-fwjWXqw4Byj8ftxB5e6Mo27cdhTiXHTAG79er4FHoB9vnY2ZeLGgm2n6cUpoo9Z15gdbZ61j5E2dm7BvxoXh6JSA'
  
  axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic M2E4OWIyMmI3MDk1NDQ1NzgyMDc4YzIzNzQ1NGRhZmQ6ZjA5NmM0ZjcwMjI0NGExN2E3MzE3MjVkN2E0ODQ0NDA=`
    },

    params: {
      'grant_type': "refresh_token",
      'refresh_token': AUTH,
    }
    
  })
  .then(r => {

    console.log(r)
    let response_data = r.data;

    fs.writeFileSync('auth.json', JSON.stringify(response_data), {flag: 'w'})
    res.send(response_data);

  })
  .catch(err => {
    console.log(err)
  })
  
})

// Redirected to here from /token
app.get('/token/done', (req, res) => {
  let send = JSON.parse(req.query.response_data)
  res.send({data: send})

})

app.get('/token/new', (req, res) => {

  let redirect_url:string = generateAuthUrl('3a89b22b7095445782078c237454dafd', 'http://localhost:4500/token', 'user-read-currently-playing', false, 'code')

  res.redirect(redirect_url)
  
})

app.listen(PORT, () => {
    console.log('running')
})