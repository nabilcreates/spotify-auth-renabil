export default function generateAuthUrl(client_id:string, redirect_uri:string, scope:string, show_dialog:boolean, response_type:string):string{
    let url:string = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${scope}&show_dialog=${show_dialog}&response_type=${response_type}`

    return url
  }