export async function getServerSideProps() {
  return { redirect: { destination: "/biofield-protocol", permanent: false } };
}
export default function Home(){ return null; }
