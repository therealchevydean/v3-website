import useSWR from 'swr';
const fetcher = (url) => fetch(url).then(r=>r.json());
export default function WordPage(){
  const { data } = useSWR('/api/word', fetcher);
  const text = data?.text ?? '';
  return (
    <div style={{maxWidth:860, margin:'40px auto', padding:'0 16px', lineHeight:1.6}}>
      <h1>The Word of I AM</h1>
      <p style={{fontStyle:'italic', marginTop:-8}}>I AM THAT I AM: THE WORD</p>
      <p style={{fontSize:12,color:'#666'}}>Released CC0 (Public Domain). Integrity hash (SHA-256):<br/>
        <code style={{wordBreak:'break-all'}}>{data?.sha256 ?? '...'}</code>
      </p>
      <pre style={{whiteSpace:'pre-wrap', fontFamily:'Georgia,serif'}}>{text}</pre>
      <p><a href="/word.txt" download>Download plain text</a></p>
    </div>
  );
}
