import Layout from '../components/Layout';
import Head from 'next/head';
import SectionRenderer from '../components/SectionRenderer';

export default function Home({ page, settings }) {
  return (
    <Layout>
      <Head>
        <title>{`${settings?.siteTitle || 'PawFresh'} | Premium Pet Nutrition`}</title>
        <meta name="description" content={settings?.siteTagline || 'Premium pet nutrition.'} />
      </Head>
      <main className="bg-white">
        <SectionRenderer sections={page?.sections} settings={settings} />
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    const res = await fetch(`${wpUrl}/wp-json/headless/v1/site`);
    const data = await res.json();
    const homePage = data.pages.find(p => p.slug === 'home');
    return { props: { page: homePage || null, settings: data.settings || {} }, revalidate: 60 };
  } catch (error) {
    return { props: { page: null, settings: {} }, revalidate: 60 };
  }
}
