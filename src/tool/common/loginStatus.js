import Cookies from 'js-cookie';

export  function loginStatus(){
  if(!Cookies.get('username')){
    localStorage.removeItem("a");
    localStorage.projectName = "";
    window.location.href='/login';
    return false;
  }else{
    const inFifteenMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
    Cookies.set('username', Cookies.get('username'), { expires: inFifteenMinutes, path: '' });
  }
}