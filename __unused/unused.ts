// import generateAuthUrl from './lib/generateAuthUrl';

// app.get('/token', (req, res) => {
//     let error = req.query.error
//     if(error){
//       let send:Response = {
//         'msg': 'error! access is denied by user',
//         'path': req.url,
//         'error': true,
//       }
    
//       res.send(send)
//     }else{
  
//       let code:string = req.query.code
  
//       axios({
//         url: 'https://accounts.spotify.com/api/token',
//         method: 'post',
        
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Authorization': `Basic M2E4OWIyMmI3MDk1NDQ1NzgyMDc4YzIzNzQ1NGRhZmQ6ZjA5NmM0ZjcwMjI0NGExN2E3MzE3MjVkN2E0ODQ0NDA=`
//         },
  
//         params: {
//           'grant_type': "authorization_code",
//           'code': code,
//           'redirect_uri': '*'
//         }
        
//       })
//       .then(r => {
  
//         console.log(r)
//         let response_data = r.data;
  
//         fs.writeFileSync('auth.json', JSON.stringify(response_data), {flag: 'w'})
//         res.redirect(`/token/done?response_data=${JSON.stringify(response_data)}`)
  
        
//       })
//       .catch(err => {
//         console.log(err)
//       })
//     }
    
//   })

// app.get('/token/new', (req, res) => {
//     let redirect_url:string = generateAuthUrl('3a89b22b7095445782078c237454dafd', '*', 'user-read-currently-playing', false, 'code')
//     res.redirect(redirect_url)
    
//   })

// // Redirected to here from /token
// app.get('/token/done', (req, res) => {
//     let send = JSON.parse(req.query.response_data)
//     res.send({data: send})
  
//   })