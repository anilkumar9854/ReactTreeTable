import React,{useEffect} from 'react';
var datas=[];
function gettingData(props) {
    useEffect( () => {
        const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            datas=data;
            console.log('This is your data', data)
            console.log('This is your data', datas)
        });
        // const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
        // axios.get(apiUrl).then((repos) => {
        //   const allRepos = repos.data;
        //   // setAppState({ loading: false, repos: allRepos });
        // });
    },[]);
}
export const apiData=datas;