
import type { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react';
import 'semantic-ui-css/semantic.min.css'
import { Loader } from 'semantic-ui-react';

interface searchCatImage {

  id: string;
  url: string;
  width: number;
  height:number;

}


interface IndexPageProps{
  initialCatImageUrl : string;
}
// initialCatImageUrlをstring型で返さなきゃならないっていう interface IndexPagePropsというジェネリックスを用意した。　


const fetchCatImage = async ():Promise<searchCatImage> => {
  const res =  await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  // console.log(result[0]);
  return result[0];
};

const Home: NextPage<IndexPageProps> = ({initialCatImageUrl} ) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
  const [isLoading,setIsLoading] = useState(false);


  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    setCatImageUrl(catImage.url);
    setIsLoading(false);


// :Promise<searchCatImage> これをやっておくと取ってきたデータ以外の値を表示させようとしたり、
// 指定したりしないとエラーが出るようになる。やっておかなにとエラー表示は覗きに行かないと出ないので
// 気付けなかったり、気付きにくかったりする。
// 事前にエラーやバグに気づくためにTypeScriptを導入する。

  };

  return (

    <div style={{
      display:'flex',
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      height:"100vh",
    }}>
      <h1>猫画像アプリ</h1>
      {isLoading ? <Loader active size="huge" inline="centered" /> :<img src={catImageUrl}
      width={500}
       height = "auto"
       
       />}
      
       
      <button style={{marginTop:18}} onClick={handleClick} >今日の猫さん</button>
    </div>
  )
}

// SSR(サーバーサイドレンダリング)
export const getServerSideProps:GetServerSideProps<IndexPageProps> = async () =>{


  //ページに飛んだときに最初から猫画像を表示させたい 
const catImage = await fetchCatImage();

// return文を書く前はgetServerSidePropsの部分がエラーになっていた

return{
  props:{
    initialCatImageUrl: catImage.url,
  },
};
// return{
  // props:{
    // initialCatImageUrl:catImage.url,
  // },
// };
// この書き方についてもう一度復習せよ

// 最終的にここで書いたinitialCatImageurlを上部のHomeコンポーネントに渡してあげる。そして
// useState()の中にinitialCatImageUrlを渡す。useState()の中の仮で置いておいた""は消してね

};



export default Home


// SSG : ビルド時にデータを取得してしまい表示させる。静的生成
// SSR : サーバー側でリクエストごとに生成する。リターン分の下に書くのが主流かもと言っていた。
// CSR : クライアント側で


// 動画内で出てくるジェネリックスというワードについて、
// 自分で決めたinterface