import Layout from '../components/Layout';
import Head from 'next/head';
import SectionRenderer from '../components/SectionRenderer';

export default function About({ page, settings }) {
  return (
    <Layout>
      <Head>
        <title>{`${page?.title || 'About Us'} | ${settings?.siteTitle || 'PawFresh'}`}</title>
      </Head>
      <main className="bg-white min-h-screen">
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
    const aboutPage = data.pages.find(p => p.slug === 'about');
    return { props: { page: aboutPage || null, settings: data.settings || {} }, revalidate: 60 };
  } catch (error) {
    return { props: { page: null, settings: {} }, revalidate: 60 };
  }
}
