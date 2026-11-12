import Link from 'next/link';
import { Actions } from '../components/Common';

export default function NotFound() {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <h1>페이지를 찾을 수 없습니다</h1>
          <h2 className="sr">주소가 바뀌었거나 아직 열리지 않은 페이지입니다</h2>
          <p>주소가 바뀌었거나 아직 열리지 않은 페이지입니다. <Link href="/area/">지역 안내</Link>에서 찾아보세요.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
